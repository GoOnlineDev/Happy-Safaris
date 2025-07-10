"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import { useUser } from "@/hooks/useUser";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MessageSquare, Send, Plus, Search } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: string;
  senderName: string;
  timestamp: any;
  isStaff: boolean;
}

interface Conversation {
  id: Id<"conversations">;
  title: string;
  lastMessage: string;
  timestamp: any;
  unreadCount: number;
  imageUrl?: string;
}

export default function InboxPage() {
  const { user, isLoading } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConversation, setActiveConversation] = useState<Id<"conversations"> | undefined>(undefined);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Convex queries & mutations
  function isValidConvexId(id: unknown): id is string {
    return typeof id === "string" && id.length > 0;
  }
  const getUserConversations = useQuery(api.conversations.getUserConversations, user ? { userId: user._id } : undefined);
  const getConversationMessages = useQuery(
    api.conversations.getConversationMessages,
    activeConversation ? { conversationId: activeConversation } : "skip"
  );
  const sendMessageMutation = useMutation(api.conversations.sendMessage);
  const findOrCreateConversation = useMutation(api.conversations.findOrCreateConversation);
  const markAsReadMutation = useMutation(api.messages.markAsRead);
  const allUsers = useQuery(api.users.getUsers);

  // Get last messages for all conversations
  const lastMessages = useQuery(api.messages.getLastMessages, 
    getUserConversations ? { conversationIds: getUserConversations.map(conv => conv._id) } : "skip"
  );

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (activeConversation && user) {
      markAsReadMutation({
        conversationId: activeConversation,
        userId: user._id
      });
    }
  }, [activeConversation, user, markAsReadMutation]);

  // Format conversations with last messages
  const formattedConversations = useMemo(() => {
    if (!getUserConversations || !lastMessages || !allUsers) return [];

    return getUserConversations.map(conv => {
      // Find the other participant
      const otherParticipantId = conv.participantIds.find(id => id !== user?._id);
      const otherUser = allUsers.find(u => u._id === otherParticipantId);
      
      // Find last message for this conversation
      const lastMessage = lastMessages.find(msg => msg.conversationId === conv._id);
      
      const conversation: Conversation = {
        id: conv._id,
        title: otherUser ? 
          `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || otherUser.email : 
          "Unknown User",
        lastMessage: lastMessage ? lastMessage.content : "No messages yet",
        timestamp: lastMessage ? lastMessage._creationTime : conv.updatedAt,
        unreadCount: lastMessage?.unreadCount || 0,
        imageUrl: otherUser?.imageUrl
      };

      return conversation;
    }).sort((a, b) => b.timestamp - a.timestamp); // Sort by latest message
  }, [getUserConversations, lastMessages, allUsers, user?._id]);

  // Update conversations state when formatted conversations change
  useEffect(() => {
    setConversations(formattedConversations);
  }, [formattedConversations]);

  // Handle new message notifications
  useEffect(() => {
    if (!messages || !activeConversation) return;

    // Show notification for new messages if not in active conversation
    const latestMessage = messages[messages.length - 1];
    if (
      latestMessage &&
      latestMessage.sender !== user?._id &&
      latestMessage.timestamp > Date.now() - 1000 // Message is new (within last second)
    ) {
      // Check if the browser supports notifications
      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification(`New message from ${latestMessage.senderName}`, {
          body: latestMessage.content,
          icon: "/logo.png"
        });

        // Close notification after 5 seconds
        setTimeout(() => notification.close(), 5000);
      }
      // Play notification sound if available
      try {
        const audio = new Audio("/notification.mp3");
        audio.play().catch(e => console.log("Error playing notification sound:", e));
      } catch (error) {
        console.log("Notification sound not available:", error);
      }
    }
  }, [messages, activeConversation, user?._id]);

  // Request notification permissions on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Fetch messages for active conversation from Convex
  useEffect(() => {
    if (!user || !activeConversation || !getConversationMessages) {
      setMessages([]);
      return;
    }

    const messages = getConversationMessages.map(msg => {
      // Find user info for sender
      const senderUser = allUsers?.find((u: any) => u._id === msg.senderId);
      return {
        id: msg._id,
        content: msg.content,
        sender: msg.senderId,
        senderName: senderUser ? 
          `${senderUser.firstName || ''} ${senderUser.lastName || ''}`.trim() || 
          senderUser.email : 
          "Unknown User",
        timestamp: msg._creationTime,
        isStaff: senderUser?.role === 'admin'
      };
    });

    setMessages(messages);
    scrollToBottom();
  }, [user, activeConversation, getConversationMessages, allUsers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeConversation) return;

    try {
      await sendMessageMutation({
        conversationId: activeConversation,
        senderId: user._id,
        content: newMessage.trim()
      });
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      // TODO: Show error toast
    }
  };

  const handleNewConversation = async () => {
    if (!newConversationTitle || !user) return;
    try {
      const otherUserId = newConversationTitle as any; // now this is the _id selected from dropdown
      const result = await findOrCreateConversation({
        userA: user._id,
        userB: otherUserId,
      });
      setShowNewConversation(false);
      setNewConversationTitle("");
      if (result && result._id) setActiveConversation(result._id);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-400">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-2">Loading messages...</p>
      </div>
    );
  }

  if (!user || user.role === 'tourist') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl text-primary font-bold">Access Denied</h1>
        <p className="text-gray-400 mt-2">You do not have permission to view this page.</p>
        <Link href="/portal">
          <Button className="mt-4 bg-primary text-secondary hover:bg-primary/90">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ProtectedPortal>
      <div className="h-full flex flex-col max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary p-4 md:p-6">Inbox</h1>
        <div className="flex-grow flex border border-accent rounded-lg bg-secondary shadow-lg overflow-hidden">
          {/* Users List */}
          <aside className="w-1/3 md:w-1/4 border-r border-accent overflow-y-auto">
            <div className="p-4 border-b border-accent">
              <h2 className="text-xl font-semibold text-white">Conversations</h2>
            </div>
            <ul className="divide-y divide-accent">
              {conversations
                .filter(conv => conv.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((conversation) => (
                  <li
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation.id)}
                    className={`p-4 cursor-pointer hover:bg-background-light ${
                      activeConversation === conversation.id
                        ? "bg-background-light"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {conversation.imageUrl ? (
                        <div className="relative">
                          <img 
                            src={conversation.imageUrl} 
                            alt={conversation.title}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-secondary text-xs font-bold">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-[#3a4441] flex items-center justify-center">
                            <span className="text-[#e3b261] text-lg">
                              {conversation.title[0]?.toUpperCase()}
                            </span>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-secondary text-xs font-bold">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {conversation.title}
                        </div>
                        <div className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold' : 'opacity-70'}`}>
                          {conversation.lastMessage?.length > 50
                            ? `${conversation.lastMessage.substring(0, 50)}...`
                            : conversation.lastMessage}
                        </div>
                        <div className="text-xs mt-1 opacity-50">
                          {new Date(conversation.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </aside>

          {/* Message View */}
          <main className="flex-grow flex flex-col bg-background-light">
            {activeConversation ? (
              <>
                {/* Header */}
                <header className="p-4 border-b border-accent flex items-center space-x-4 bg-secondary">
                  <img
                    src={conversations.find(conv => conv.id === activeConversation)?.imageUrl || `https://ui-avatars.com/api/?name=${conversations.find(conv => conv.id === activeConversation)?.title.split(' ').map(n => n[0]).join('')}&background=random`}
                    alt={conversations.find(conv => conv.id === activeConversation)?.title}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold text-white">{conversations.find(conv => conv.id === activeConversation)?.title}</p>
                    <p className="text-sm text-gray-400">Communicate with support team</p>
                  </div>
                </header>

                {/* Messages */}
                <div ref={messagesEndRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === user?._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="flex items-end max-w-[70%] space-x-2">
                          {message.sender !== user?._id && (
                            <div className="flex-shrink-0">
                              <div className={`h-8 w-8 rounded-full ${
                                message.isStaff ? 'bg-[#3a4441]' : 'bg-[#e3b261]'
                              } flex items-center justify-center`}>
                                <span className={`text-sm ${
                                  message.isStaff ? 'text-[#e3b261]' : 'text-[#1a2421]'
                                }`}>
                                  {message.senderName[0]?.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender === user?._id
                                ? "bg-[#e3b261] text-[#1a2421]"
                                : "bg-[#3a4441] text-white"
                            }`}
                          >
                            <div className="text-sm font-medium mb-1">
                              {message.senderName}
                            </div>
                            <div className="break-words">{message.content}</div>
                            <div className="text-xs mt-1 opacity-70">
                              {new Date(message.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-accent bg-secondary">
                  <div className="flex items-center space-x-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-grow bg-background-light border-accent text-white"
                    />
                    <Button
                      type="submit"
                      className="bg-primary text-secondary hover:bg-primary/90"
                      disabled={!newMessage.trim()}
                    >
                      {/* <Send className="h-4 w-4" /> */}
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center text-gray-500">
                <p>Select a conversation to view messages</p>
              </div>
            )}
          </main>
        </div>

        {/* New Conversation Modal */}
        {showNewConversation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-[#1a2421] border-[#3a4441] p-6">
              <h3 className="text-xl font-semibold text-white mb-4">New Conversation</h3>
              <div className="space-y-4">
                <select
                  value={newConversationTitle}
                  onChange={(e) => setNewConversationTitle(e.target.value)}
                  className="w-full p-2 rounded bg-[#2a3431] border border-[#3a4441] text-white"
                >
                  <option value="" disabled>Select a user to chat with...</option>
                  {allUsers && allUsers
                    .filter((u: any) => u._id !== user?._id && u.role === (user?.role === 'admin' ? 'tourist' : 'admin'))
                    .map((u: any) => (
                      <option key={u._id} value={u._id}>
                        {u.firstName || ''} {u.lastName || ''} ({u.email})
                      </option>
                    ))}
                </select>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewConversation(false)}
                    className="border-[#3a4441] text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNewConversation}
                    className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
                    disabled={!newConversationTitle}
                  >
                    Start Chat
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ProtectedPortal>
  );
} 
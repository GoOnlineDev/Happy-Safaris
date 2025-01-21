"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { MessageSquare, Send, Plus, Search } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: string;
  senderName: string;
  timestamp: any;
  isStaff: boolean;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: any;
  unread: boolean;
}

export default function InboxPage() {
  const { user, userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState("");

  // Fetch conversations
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'conversations'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationsData: Conversation[] = [];
      snapshot.forEach((doc) => {
        conversationsData.push({ id: doc.id, ...doc.data() } as Conversation);
      });
      setConversations(conversationsData);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!user || !activeConversation) return;

    const q = query(
      collection(db, 'users', user.uid, 'conversations', activeConversation, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData: Message[] = [];
      snapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [user, activeConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !activeConversation) return;

    try {
      await addDoc(
        collection(db, 'users', user.uid, 'conversations', activeConversation, 'messages'),
        {
          content: newMessage,
          sender: user.uid,
          senderName: userProfile?.name || user.email,
          timestamp: serverTimestamp(),
          isStaff: false,
        }
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNewConversation = async () => {
    if (!newConversationTitle.trim() || !user) return;

    try {
      const conversationRef = await addDoc(
        collection(db, 'users', user.uid, 'conversations'),
        {
          title: newConversationTitle,
          lastMessage: "Conversation started",
          timestamp: serverTimestamp(),
          unread: false,
        }
      );
      setActiveConversation(conversationRef.id);
      setShowNewConversation(false);
      setNewConversationTitle("");
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <ProtectedPortal>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#e3b261] mb-2">Inbox</h1>
          <p className="text-gray-400">Communicate with Happy Safaris support team</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1 bg-[#1a2421] border-[#3a4441] p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Conversations</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewConversation(true)}
                  className="text-[#e3b261] hover:text-[#c49a51]"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-transparent border-[#3a4441] text-white"
                />
              </div>

              <div className="space-y-2">
                {conversations
                  .filter(conv => conv.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setActiveConversation(conversation.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        activeConversation === conversation.id
                          ? "bg-[#e3b261] text-[#1a2421]"
                          : "hover:bg-[#3a4441] text-gray-400"
                      }`}
                    >
                      <div className="font-medium">{conversation.title}</div>
                      <div className="text-sm truncate">
                        {conversation.lastMessage}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          {/* Messages Area */}
          <Card className="lg:col-span-3 bg-[#1a2421] border-[#3a4441] p-4 flex flex-col h-[calc(100vh-16rem)]">
            {activeConversation ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isStaff ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isStaff
                            ? "bg-[#3a4441] text-white"
                            : "bg-[#e3b261] text-[#1a2421]"
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {message.senderName}
                        </div>
                        <div>{message.content}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="bg-transparent border-[#3a4441] text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-[#e3b261]" />
                  <p>Select a conversation or start a new one</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* New Conversation Modal */}
        {showNewConversation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-[#1a2421] border-[#3a4441] p-6">
              <h3 className="text-xl font-semibold text-white mb-4">New Conversation</h3>
              <div className="space-y-4">
                <Input
                  value={newConversationTitle}
                  onChange={(e) => setNewConversationTitle(e.target.value)}
                  placeholder="Conversation title..."
                  className="bg-transparent border-[#3a4441] text-white"
                />
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
                  >
                    Create
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
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// List all messages
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const messages = await ctx.db
      .query("messages")
      .order("asc")
      .collect();

    // Fetch user information for each message
    const messagesWithAuthors = await Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db.get(message.senderId);
        return {
          ...message,
          author: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
        };
      })
    );

    return messagesWithAuthors;
  },
});

// Send a new message
export const send = mutation({
  args: {
    content: v.string(),
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify the user exists
    const user = await ctx.db.get(args.senderId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create the message
    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      conversationId: args.conversationId,
      senderId: args.senderId,
      isRead: false, // New messages start as unread
    });

    return messageId;
  },
});

// Mark messages as read
export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get all unread messages in the conversation not sent by the user
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", q => q.eq("conversationId", args.conversationId))
      .filter(q => 
        q.and(
          q.eq(q.field("isRead"), false),
          q.neq(q.field("senderId"), args.userId)
        )
      )
      .collect();

    // Mark all messages as read
    await Promise.all(
      unreadMessages.map(message =>
        ctx.db.patch(message._id, { isRead: true })
      )
    );

    return unreadMessages.length;
  },
});

// Get unread count for conversations
export const getUnreadCount = query({
  args: { 
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const unreadCount = await ctx.db
      .query("messages")
      .withIndex("by_conversation", q => q.eq("conversationId", args.conversationId))
      .filter(q => 
        q.and(
          q.eq(q.field("isRead"), false),
          q.neq(q.field("senderId"), args.userId)
        )
      )
      .collect();

    return unreadCount.length;
  },
});

// Get the last message for a conversation
export const getLastMessage = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const message = await ctx.db
      .query("messages")
      .withIndex("by_conversation", q => q.eq("conversationId", args.conversationId))
      .order("desc")
      .first();

    if (!message) return null;

    const sender = await ctx.db.get(message.senderId);
    return {
      ...message,
      senderName: sender ? `${sender.firstName || ''} ${sender.lastName || ''}`.trim() || sender.email : "Unknown User"
    };
  },
});

// Get last messages for multiple conversations
export const getLastMessages = query({
  args: { conversationIds: v.array(v.id("conversations")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const lastMessages = [];
    for (const conversationId of args.conversationIds) {
      const message = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) =>
          q.eq("conversationId", conversationId)
        )
        .order("desc")
        .first();

      if (message) {
        const sender = await ctx.db.get(message.senderId);

        // Get unread count for this conversation
        const unreadMessages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conversationId)
          )
          .filter((q) =>
            q.and(
              q.eq(q.field("isRead"), false),
              q.neq(q.field("senderId"), user._id)
            )
          )
          .collect();

        lastMessages.push({
          ...message,
          senderName:
            sender
              ? `${sender.firstName || ""} ${sender.lastName || ""}`.trim() ||
                sender.email
              : "Unknown User",
          unreadCount: unreadMessages.length,
        });
      }
    }

    return lastMessages;
  },
}); 
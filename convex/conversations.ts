import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Get all conversations for a user (tourist or admin)
export const getUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("User not found");
  const conversations = await ctx.db.query("conversations").collect();
  // For tourists: only show conversations with admins. For admins: show all, or only with tourists.
  if (user.role === "tourist") {
    // Find conversations where the other participant is an admin
    const result = [];
    for (const conv of conversations) {
      if (conv.participantIds.includes(userId)) {
        // Find the other participant
        const otherId = conv.participantIds.find((id) => id !== userId);
        if (!otherId) continue;
        const otherUser = await ctx.db.get(otherId);
        if (otherUser && otherUser.role === "admin") {
          result.push(conv);
        }
      }
    }
    return result;
  } else if (user.role === "admin") {
    // Option 1: show all conversations
    // return conversations.filter(conv => conv.participantIds.includes(userId));
    // Option 2: only conversations with tourists
    const result = [];
    for (const conv of conversations) {
      if (conv.participantIds.includes(userId)) {
        const otherId = conv.participantIds.find((id) => id !== userId);
        if (!otherId) continue;
        const otherUser = await ctx.db.get(otherId);
        if (otherUser && otherUser.role === "tourist") {
          result.push(conv);
        }
      }
    }
    return result;
  } else {
    // Unknown role, return nothing
    return [];
  }
},
});

// Find or create a conversation between two users
export const findOrCreateConversation = mutation({
  args: { userA: v.id("users"), userB: v.id("users") },
  handler: async (ctx, { userA, userB }) => {
  // Fetch both users
  const user1 = await ctx.db.get(userA);
  const user2 = await ctx.db.get(userB);
  if (!user1 || !user2) throw new Error("User not found");
  // Only allow conversations between a tourist and an admin
  const roles = [user1.role, user2.role];
  if (!(roles.includes("tourist") && roles.includes("admin"))) {
    throw new Error("Conversations can only be between a tourist and an admin");
  }
  // Try to find an existing conversation
  const conversations = await ctx.db
    .query("conversations")
    .collect();
  const existing = conversations.find((conv) =>
    conv.participantIds.includes(userA) &&
    conv.participantIds.includes(userB) &&
    conv.participantIds.length === 2
  );
  if (existing) return existing;
  // Otherwise, create new
  const now = Date.now();
  const id = await ctx.db.insert("conversations", {
    participantIds: [userA, userB],
    createdAt: now,
    updatedAt: now,
  });
  return await ctx.db.get(id);
  }
});


// Send a message in a conversation
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.conversationId, { updatedAt: Date.now() });
    return await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      content: args.content,
      isRead: false
    });
  },
});

// Get all messages for a conversation
export const getConversationMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", q => q.eq("conversationId", conversationId))
      .order("asc")
      .collect();

    // Fetch user information for each message
    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        return {
          ...message,
          senderName: sender ? `${sender.firstName || ''} ${sender.lastName || ''}`.trim() || sender.email : "Unknown User",
          senderRole: sender?.role || "unknown"
        };
      })
    );

    return messagesWithSenders;
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getForBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, { bookingId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const ticket = await ctx.db
      .query("supportTickets")
      .withIndex("by_bookingId", (q) => q.eq("bookingId", bookingId))
      .first();

    if (!ticket) return null;

    const messages = await ctx.db
      .query("supportMessages")
      .withIndex("by_ticketId", (q) => q.eq("ticketId", ticket._id))
      .order("asc")
      .collect();

    return { ...ticket, messages };
  },
});

export const createTicket = mutation({
  args: {
    bookingId: v.id("bookings"),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, { bookingId, subject, message }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
    if(!user) throw new Error("User not found");

    const existingTicket = await ctx.db
      .query("supportTickets")
      .withIndex("by_bookingId", (q) => q.eq("bookingId", bookingId))
      .first();

    if (existingTicket) {
      // A ticket for this booking already exists.
      // We can add the message to it instead of creating a new one.
      await ctx.db.insert("supportMessages", {
        ticketId: existingTicket._id,
        senderId: user._id,
        content: message,
        isRead: false,
      });
      return existingTicket._id;
    }

    const ticketId = await ctx.db.insert("supportTickets", {
      bookingId,
      userId: user._id,
      subject,
      status: "open",
    });

    await ctx.db.insert("supportMessages", {
      ticketId,
      senderId: user._id,
      content: message,
      isRead: false,
    });

    return ticketId;
  },
});

export const addMessage = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    content: v.string(),
  },
  handler: async (ctx, { ticketId, content }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
    if(!user) throw new Error("User not found");

    await ctx.db.insert("supportMessages", {
      ticketId,
      senderId: user._id,
      content,
      isRead: false,
    });
  },
});

export const closeTicket = mutation({
    args: { ticketId: v.id("supportTickets") },
    handler: async (ctx, { ticketId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        // Add role check for admin/support staff here in a real app
        
        await ctx.db.patch(ticketId, { status: "closed" });
    }
}) 
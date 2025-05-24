import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    userId: v.string(),
    userEmail: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.optional(v.string()),
    tourId: v.id("tours"),
    tourName: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    guests: v.object({
      adults: v.number(),
      children: v.number(),
      infants: v.number(),
    }),
    specialRequests: v.optional(v.string()),
    totalPrice: v.number(),
    depositAmount: v.number(),
    paymentStatus: v.string(),
    bookingStatus: v.string(),
    bookingReference: v.string(),
    emailNotifications: v.boolean(),
    whatsappUpdates: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Ensure user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    
    // Verify the user matches
    if (identity.subject !== args.userId) {
      throw new Error("Unauthorized");
    }
    
    // Create the booking
    const bookingId = await ctx.db.insert("bookings", {
      userId: args.userId,
      userEmail: args.userEmail,
      firstName: args.firstName,
      lastName: args.lastName,
      phone: args.phone || "",
      tourId: args.tourId,
      tourName: args.tourName,
      startDate: args.startDate,
      endDate: args.endDate,
      guests: args.guests,
      specialRequests: args.specialRequests || "",
      totalPrice: args.totalPrice,
      depositAmount: args.depositAmount,
      paymentStatus: args.paymentStatus,
      bookingStatus: args.bookingStatus,
      bookingReference: args.bookingReference,
      emailNotifications: args.emailNotifications,
      whatsappUpdates: args.whatsappUpdates,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return bookingId;
  },
});

// Get all bookings for a user
export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db
      .query("bookings")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

// Get a single booking by ID
export const get = query({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== booking.userId) {
      throw new Error("Unauthorized");
    }
    
    return booking;
  },
});

// Update booking status
export const updateStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.string(),
    paymentStatus: v.optional(v.string()),
    paymentId: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    cancellationReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== booking.userId) {
      throw new Error("Unauthorized");
    }
    
    const updates: any = {
      bookingStatus: args.status,
      updatedAt: Date.now(),
    };
    
    if (args.paymentStatus) {
      updates.paymentStatus = args.paymentStatus;
    }
    
    if (args.paymentId) {
      updates.paymentId = args.paymentId;
    }
    
    if (args.paymentMethod) {
      updates.paymentMethod = args.paymentMethod;
    }
    
    if (args.cancellationReason) {
      updates.cancellationReason = args.cancellationReason;
      updates.cancelledAt = Date.now();
    }
    
    await ctx.db.patch(args.bookingId, updates);
    
    return await ctx.db.get(args.bookingId);
  },
});

// List all bookings (admin only)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new Error("Unauthorized. Admin access required.");
    }

    return await ctx.db
      .query("bookings")
      .order("desc")
      .collect();
  },
}); 
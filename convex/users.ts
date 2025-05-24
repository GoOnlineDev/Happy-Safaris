import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// Role type definition
const ROLES = {
  ADMIN: "admin",
  TOURIST: "tourist",
} as const;

type Role = typeof ROLES[keyof typeof ROLES];

// Create a new user in the database after Clerk signup
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) {
      throw new ConvexError("User already exists");
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      role: ROLES.TOURIST, // Default role for new users
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
    
    return user;
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    clerkId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    country: v.optional(v.string()),
    address: v.optional(v.string()),
    preferredCurrency: v.optional(v.string()),
    preferredLanguage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...updates } = args;

    // Get the user first
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Update the user
    const updatedFields = {
      ...updates,
      updatedAt: Date.now(),
    };

    // Only include fields that are present in the args
    const finalUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updatedFields)) {
      if (value !== undefined) {
        finalUpdates[key] = value;
      }
    }

    await ctx.db.patch(user._id, finalUpdates);

    return user._id;
  },
});

// Get all users (admin only)
export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Set user role (admin only)
export const setUserRole = mutation({
  args: {
    clerkId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      role: args.role,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Get the current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Find user by clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    return user;
  },
});

// Public mutation for syncing user data from Clerk
export const syncUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        updatedAt: Date.now(),
      });
    } else {
      // Create new user
      await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        firstName: args.firstName ?? "",
        lastName: args.lastName ?? "",
        imageUrl: args.imageUrl,
        role: "tourist", // Default role
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    phone: v.optional(v.string()),
    country: v.optional(v.string()),
    address: v.optional(v.string()),
    preferredCurrency: v.optional(v.string()),
    preferredLanguage: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    console.log(`Updating profile for user with Clerk ID: ${identity.subject}`);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const updates = { ...args, updatedAt: Date.now() };
    console.log("Updating user profile with:", updates);

    const userId = await ctx.db.patch(user._id, updates);
    console.log(`User profile updated successfully, ID: ${userId}`);
    
    return userId;
  },
});

// Admin function to update user role
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal(ROLES.ADMIN), v.literal(ROLES.TOURIST)),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if the current user is an admin
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!currentUser || currentUser.role !== ROLES.ADMIN) {
      throw new Error("Unauthorized: Only admins can update roles");
    }

    // Update user role
    return await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });
  },
});

// Public mutation to trigger user sync from client (calls internal sync)
export const syncUserPublic = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Call the internal sync mutation
    await ctx.runMutation(internal.users.syncUser, {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
    });
  },
});

// Admin function to list all users
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if the current user is an admin
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!currentUser || currentUser.role !== ROLES.ADMIN) {
      throw new Error("Unauthorized: Only admins can list users");
    }

    return await ctx.db.query("users").collect();
  },
});

// Admin function to delete user
export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if the current user is an admin
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!currentUser || currentUser.role !== ROLES.ADMIN) {
      throw new Error("Unauthorized: Only admins can delete users");
    }

    await ctx.db.delete(args.userId);
    return { success: true };
  },
}); 
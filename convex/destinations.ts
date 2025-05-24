import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { ConvexError } from "convex/values";

// Get all destinations
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("destinations").collect();
  },
});

// Get featured destinations
export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("destinations")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
  },
});

// Get a single destination by slug without click tracking
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const destination = await ctx.db
      .query("destinations")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
    
    return destination;
  },
});

// Track a click on a destination
export const trackDestinationClick = mutation({
  args: { 
    destinationId: v.id("destinations")
  },
  handler: async (ctx, args) => {
    // Get the current destination
    const destination = await ctx.db.get(args.destinationId);
    
    if (!destination) {
      throw new ConvexError("Destination not found");
    }
    
    // Calculate new click count
    const newClickCount = (destination.clickCount || 0) + 1;
    
    // Update the destination's click count
    await ctx.db.patch(args.destinationId, { 
      clickCount: newClickCount 
    });
    
    return newClickCount;
  },
});

// Internal mutation to increment click count
const incrementClickCount = internalMutation({
  args: { 
    destinationId: v.id("destinations"), 
    newCount: v.number() 
  },
  handler: async (ctx, args) => {
    // Update the destination's click count
    await ctx.db.patch(args.destinationId, { 
      clickCount: args.newCount 
    });
    
    return args.newCount;
  },
});

// Check if current user is an admin
const isAdmin = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return false;
  }
  
  // Get the user from the database
  const user = await ctx.db
    .query("users")
    .filter((q: any) => q.eq(q.field("clerkId"), identity.subject))
    .first();
  
  // Check if the user is an admin
  return user?.role === "admin" || user?.role === "super_admin";
};

// Create a new destination (admin only)
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    country: v.string(),
    description: v.string(),
    content: v.array(
      v.object({
        type: v.string(),
        value: v.any(),
      })
    ),
    imageUrl: v.array(v.string()),
    featured: v.boolean(),
    attractions: v.array(v.string()),
    bestTimeToVisit: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated and is an admin
    if (!(await isAdmin(ctx))) {
      throw new ConvexError("Unauthorized - only admins can create destinations");
    }
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User identity not found");
    }
    
    const userId = (
      await ctx.db
        .query("users")
        .filter((q: any) => q.eq(q.field("clerkId"), identity.subject))
        .first()
    )?._id;
    
    if (!userId) {
      throw new ConvexError("User not found");
    }

    // Check if slug is unique
    const existingDestination = await ctx.db
      .query("destinations")
      .filter((q: any) => q.eq(q.field("slug"), args.slug))
      .first();
    
    if (existingDestination) {
      throw new ConvexError("A destination with this slug already exists");
    }
    
    const now = Date.now();
    
    // Create the destination
    const destinationId = await ctx.db.insert("destinations", {
      name: args.name,
      slug: args.slug,
      country: args.country,
      description: args.description,
      content: args.content,
      imageUrl: args.imageUrl,
      featured: args.featured,
      attractions: args.attractions,
      bestTimeToVisit: args.bestTimeToVisit,
      clickCount: 0,
      createdBy: userId,
      lastUpdatedBy: userId,
      createdAt: now,
      updatedAt: now,
    });
    
    return destinationId;
  },
});

// Update an existing destination (admin only)
export const update = mutation({
  args: {
    id: v.id("destinations"),
    name: v.optional(v.string()),
    country: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(
      v.array(
        v.object({
          type: v.string(),
          value: v.any(),
        })
      )
    ),
    imageUrl: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    attractions: v.optional(v.array(v.string())),
    bestTimeToVisit: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated and is an admin
    if (!(await isAdmin(ctx))) {
      throw new ConvexError("Unauthorized - only admins can update destinations");
    }
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User identity not found");
    }
    
    const userId = (
      await ctx.db
        .query("users")
        .filter((q: any) => q.eq(q.field("clerkId"), identity.subject))
        .first()
    )?._id;
    
    if (!userId) {
      throw new ConvexError("User not found");
    }
    
    // Check if destination exists
    const existingDestination = await ctx.db.get(args.id);
    
    if (!existingDestination) {
      throw new ConvexError("Destination not found");
    }
    
    // Prepare update object - create a new object without the id property
    const { id, ...updatesWithoutId } = args;
    
    // Add lastUpdatedBy and updatedAt fields
    const updates = {
      ...updatesWithoutId,
      lastUpdatedBy: userId,
      updatedAt: Date.now(),
    };
    
    // Update the destination
    await ctx.db.patch(args.id, updates);
    
    return args.id;
  },
});

// Delete a destination (admin only)
export const deleteDestination = mutation({
  args: {
    id: v.id("destinations"),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated and is an admin
    if (!(await isAdmin(ctx))) {
      throw new ConvexError("Unauthorized - only admins can delete destinations");
    }
    
    // Check if destination exists
    const existingDestination = await ctx.db.get(args.id);
    
    if (!existingDestination) {
      throw new ConvexError("Destination not found");
    }
    
    // Delete the destination
    await ctx.db.delete(args.id);
    
    return { success: true };
  },
});

// Get destination analytics (admin only)
export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    // Check if user is authenticated and is an admin
    if (!(await isAdmin(ctx))) {
      throw new ConvexError("Unauthorized - only admins can view analytics");
    }

    const destinations = await ctx.db.query("destinations").collect();
    
    // Calculate analytics
    return destinations.map(destination => ({
      id: destination._id,
      name: destination.name,
      clicks: destination.clickCount || 0
    }));
  },
});

// Get a single destination by ID
export const getById = query({
  args: { id: v.id("destinations") },
  handler: async (ctx, args) => {
    const destination = await ctx.db.get(args.id);
    
    if (!destination) {
      throw new ConvexError("Destination not found");
    }
    
    return destination;
  },
});

// Search destinations by name, country, attractions, or description
export const searchDestinations = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const q = args.query.trim().toLowerCase();
    if (!q) return [];
    const all = await ctx.db.query("destinations").collect();
    return all.filter(dest =>
      dest.name.toLowerCase().includes(q) ||
      dest.country.toLowerCase().includes(q) ||
      dest.description.toLowerCase().includes(q) ||
      (dest.attractions && dest.attractions.some((a) => a.toLowerCase().includes(q)))
    );
  },
}); 
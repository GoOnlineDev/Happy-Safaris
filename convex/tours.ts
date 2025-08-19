import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { ConvexError } from "convex/values";

// Get all tours
export const getAll = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    return await ctx.db.query("tours").collect();
  },
});

// Get featured tours
export const getFeatured = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const featured = await ctx.db
      .query("tours")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
    return featured
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 6);
  },
});

// Get tour by slug
export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      reviews: v.array(v.object({
        _id: v.id("reviews"),
        _creationTime: v.number(),
        userId: v.string(),
        tourId: v.id("tours"),
        rating: v.number(),
        comment: v.string(),
        images: v.optional(v.array(v.string())),
        createdAt: v.number(),
        updatedAt: v.number(),
      })),
      averageRating: v.number(),
      _id: v.id("tours"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      description: v.string(),
      duration: v.number(),
      price: v.number(),
      discountPrice: v.optional(v.number()),
      location: v.string(),
      country: v.string(),
      imageUrl: v.array(v.string()),
      featured: v.boolean(),
      destinationId: v.id("destinations"),
      maxGroupSize: v.number(),
      difficulty: v.string(),
      startDates: v.array(v.number()),
      itinerary: v.array(v.object({
        day: v.number(),
        title: v.string(),
        description: v.string(),
        accommodation: v.string(),
        meals: v.string(),
      })),
      included: v.array(v.string()),
      excluded: v.array(v.string()),
      viewCount: v.number(),
      createdBy: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const tour = await ctx.db
      .query("tours")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();

    if (!tour) {
      throw new ConvexError("Tour not found");
    }

    // The .withIndex query is more efficient but seems to be causing a type error
    // in your environment, possibly due to stale type generation.
    // Using .filter instead is a workaround.
    const reviews = await ctx.db
      .query("reviews")
      .filter((q) => q.eq(q.field("tourId"), tour._id))
      .collect();

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return {
      ...tour,
      reviews,
      averageRating,
    };
  },
});

export const getByDestinationId = query({
  args: { destinationId: v.id("destinations") },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tours")
      .withIndex("by_destinationId", (q) => q.eq("destinationId", args.destinationId))
      .collect();
  },
});

// Increment tour view count
export const incrementViewCount = mutation({
  args: {
    id: v.id("tours"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.id);
    if (!tour) {
      throw new ConvexError("Tour not found");
    }

    await ctx.db.patch(args.id, {
      viewCount: (tour.viewCount || 0) + 1,
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Get tour by ID
export const getById = query({
  args: { id: v.id("tours") },
  returns: v.any(),
  handler: async (ctx, args) => {
    const tour = await ctx.db.get(args.id);
    
    if (!tour) {
      throw new ConvexError("Tour not found");
    }
    
    return tour;
  },
});

// Get tour analytics
export const getAnalytics = query({
  args: {},
  returns: v.array(v.object({
    id: v.id("tours"),
    title: v.string(),
    country: v.string(),
    duration: v.number(),
    price: v.number(),
    views: v.number(),
    featured: v.boolean(),
  })),
  handler: async (ctx) => {
    const tours = await ctx.db.query("tours").collect();
    
    return tours.map((tour) => ({
      id: tour._id,
      title: tour.title,
      country: tour.country,
      duration: tour.duration,
      price: tour.price,
      views: tour.viewCount || 0,
      featured: tour.featured,
    }));
  },
});

// Create a new tour
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    duration: v.number(),
    price: v.number(),
    discountPrice: v.optional(v.number()),
    location: v.string(),
    country: v.string(),
    imageUrl: v.array(v.string()),
    featured: v.boolean(),
    maxGroupSize: v.number(),
    difficulty: v.string(),
    startDates: v.array(v.number()),
    itinerary: v.array(v.object({
      day: v.number(),
      title: v.string(),
      description: v.string(),
      accommodation: v.string(),
      meals: v.string(),
    })),
    included: v.array(v.string()),
    excluded: v.array(v.string()),
    destinationId: v.id("destinations"),
    clerkId: v.string(),
  },
  returns: v.id("tours"),
  handler: async (ctx, args) => {
    // Get identity from token
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    
    // Get user from DB
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new ConvexError("Unauthorized: Only admins can create tours");
    }
    
    // Check if tour with slug already exists
    const existingTour = await ctx.db
      .query("tours")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
    
    if (existingTour) {
      throw new ConvexError("A tour with this slug already exists");
    }
    
    const tourId = await ctx.db.insert("tours", {
      title: args.title,
      slug: args.slug,
      description: args.description,
      duration: args.duration,
      price: args.price,
      discountPrice: args.discountPrice,
      location: args.location,
      country: args.country,
      imageUrl: args.imageUrl,
      featured: args.featured,
      maxGroupSize: args.maxGroupSize,
      difficulty: args.difficulty,
      startDates: args.startDates,
      itinerary: args.itinerary,
      included: args.included,
      excluded: args.excluded,
      destinationId: args.destinationId,
      createdBy: args.clerkId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      viewCount: 0,
    });
    
    return tourId;
  },
});

// Update a tour
export const update = mutation({
  args: {
    id: v.id("tours"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
    price: v.optional(v.number()),
    discountPrice: v.optional(v.number()),
    location: v.optional(v.string()),
    country: v.optional(v.string()),
    imageUrl: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    maxGroupSize: v.optional(v.number()),
    difficulty: v.optional(v.string()),
    startDates: v.optional(v.array(v.number())),
    itinerary: v.optional(v.array(v.object({
      day: v.number(),
      title: v.string(),
      description: v.string(),
      accommodation: v.string(),
      meals: v.string(),
    }))),
    included: v.optional(v.array(v.string())),
    excluded: v.optional(v.array(v.string())),
    destinationId: v.optional(v.id("destinations")),
  },
  returns: v.id("tours"),
  handler: async (ctx, args) => {
    // Get identity from token
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    
    // Get user from DB
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new ConvexError("Unauthorized: Only admins can update tours");
    }
    
    // Check if tour exists
    const tour = await ctx.db.get(args.id);
    if (!tour) {
      throw new ConvexError("Tour not found");
    }
    
    // If slug is being updated, check if it's unique
    if (args.slug && args.slug !== tour.slug) {
      const existingTour = await ctx.db
        .query("tours")
        .filter((q) => q.eq(q.field("slug"), args.slug))
        .first();
      
      if (existingTour) {
        throw new ConvexError("A tour with this slug already exists");
      }
    }
    
    // Create a new object without the id
    const { id, ...updatedFields } = args;
    
    // Update tour
    await ctx.db.patch(args.id, {
      ...updatedFields,
      updatedAt: Date.now(),
    });
    
    return args.id;
  },
});

// Delete a tour
export const deleteTour = mutation({
  args: { id: v.id("tours") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Get identity from token
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    
    // Get user from DB
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new ConvexError("Unauthorized: Only admins can delete tours");
    }
    
    // Check if tour exists
    const tour = await ctx.db.get(args.id);
    if (!tour) {
      throw new ConvexError("Tour not found");
    }
    
    // Delete tour
    await ctx.db.delete(args.id);
    
    return true;
  },
});

// Search tours by title, country, location, or description
export const searchTours = query({
  args: { query: v.string() },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const q = args.query.trim().toLowerCase();
    if (!q) return [];
    const all = await ctx.db.query("tours").collect();
    return all.filter(tour =>
      tour.title.toLowerCase().includes(q) ||
      tour.country.toLowerCase().includes(q) ||
      tour.location.toLowerCase().includes(q) ||
      tour.description.toLowerCase().includes(q)
    );
  },
}); 
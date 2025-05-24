import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { ConvexError } from "convex/values";

// Get About page content
export const getAboutContent = query({
  handler: async (ctx) => {
    const about = await ctx.db.query("about").first();
    return about;
  },
});

// Update About page content (admin only)
export const updateAboutContent = mutation({
  args: {
    heroImageUrl: v.string(),
    heroHeading: v.string(),
    heroSubheading: v.string(),
    storyImageUrl: v.string(),
    storyHeading: v.string(),
    storyContent: v.string(),
    advantages: v.array(
      v.object({
        icon: v.string(),
        title: v.string(),
        description: v.string(),
      })
    ),
    values: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Only allow admins
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new ConvexError("Unauthorized: Only admins can update About page");
    }
    // Get the about doc (assume only one)
    const about = await ctx.db.query("about").first();
    if (!about) throw new ConvexError("About page not found");
    await ctx.db.patch(about._id, {
      ...args,
      updatedAt: Date.now(),
    });
    return true;
  },
});

// Create About page content (admin only, for initial setup)
export const createAboutContent = mutation({
  args: {
    heroImageUrl: v.string(),
    heroHeading: v.string(),
    heroSubheading: v.string(),
    storyImageUrl: v.string(),
    storyHeading: v.string(),
    storyContent: v.string(),
    advantages: v.array(
      v.object({
        icon: v.string(),
        title: v.string(),
        description: v.string(),
      })
    ),
    values: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Only allow admins
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new ConvexError("Unauthorized: Only admins can create About page");
    }
    // Only allow one about doc
    const existing = await ctx.db.query("about").first();
    if (existing) throw new ConvexError("About page already exists");
    await ctx.db.insert("about", {
      ...args,
      updatedAt: Date.now(),
    });
    return true;
  },
}); 
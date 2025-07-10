import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

// Get the latest hero content
export const getHeroContent = query({
  handler: async (ctx) => {
    // Always return the most recently updated hero content (should only be one row)
    const all = await ctx.db.query("hero").collect();
    if (!all.length) return null;
    // Sort by updatedAt descending, return the latest
    return all.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  },
});

// Update or create the hero content (admin only)
export const updateHeroContent = mutation({
  args: {
    backgroundImageUrl: v.string(),
    mainHeading: v.string(),
    highlightedText: v.optional(v.string()),
    subheading: v.string(),
    ctaText: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Only allow admins
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      throw new ConvexError("Unauthorized: Only admins can update hero content");
    }
    // Check if a hero row exists
    const all = await ctx.db.query("hero").collect();
    const now = Date.now();
    if (all.length) {
      // Update the latest
      const latest = all.sort((a, b) => b.updatedAt - a.updatedAt)[0];
      await ctx.db.patch(latest._id, {
        ...args,
        updatedAt: now,
      });
      return latest._id;
    } else {
      // Create new
      return await ctx.db.insert("hero", {
        ...args,
        updatedAt: now,
      });
    }
  },
}); 
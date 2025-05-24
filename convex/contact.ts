import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Mutation to save a contact message
export const createMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const newMessage = await ctx.db.insert('contactMessages', args);
    return newMessage;
  },
});

// Query to get all contact messages (for admin)
export const getMessages = query({
  handler: async (ctx) => {
    // In a real app, you might want to add authentication/authorization here
    // to ensure only admins can view messages.
    return await ctx.db.query('contactMessages').collect();
  },
});

// Query to get the single contact info document
export const getContactInfo = query({
  handler: async (ctx) => {
    // Assuming there's only one document for contact info
    return await ctx.db.query('contactInfo').first();
  },
});

// Mutation to create or update the contact info document (for admin)
export const updateContactInfo = mutation({
  args: {
    phone: v.string(),
    email: v.string(),
    location: v.string(),
    businessHours: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real app, you might want to add authentication/authorization here
    // to ensure only admins can update contact info.

    // Try to find existing contact info
    const existingInfo = await ctx.db.query('contactInfo').first();

    if (existingInfo) {
      // Update existing document
      await ctx.db.patch(existingInfo._id, args);
      return existingInfo._id;
    } else {
      // Create new document
      const newInfo = await ctx.db.insert('contactInfo', args);
      return newInfo;
    }
  },
});
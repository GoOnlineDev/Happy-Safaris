import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table to store user profiles
  users: defineTable({
    // User information from Clerk
    tokenIdentifier: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    
    // Additional user profile information
    phone: v.optional(v.string()),
    country: v.optional(v.string()),
    address: v.optional(v.string()),
    bio: v.optional(v.string()),
    
    // User preferences
    preferredCurrency: v.optional(v.string()),
    preferredLanguage: v.optional(v.string()),
    
    // User type
    role: v.string(), // "admin", "tourist"
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token_identifier", ["tokenIdentifier"]),
  
  // Conversations table for chat threads
  conversations: defineTable({
    participantIds: v.array(v.id("users")), // IDs of users (tourist, admin)
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_participant", ["participantIds"]),

  // Messages table for chat
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    isRead: v.boolean(),
    // System fields (_creationTime) will be added automatically
  }).index("by_conversation", ["conversationId"]),

  // Tours table for safari packages
  tours: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    duration: v.number(), // in days
    price: v.number(),
    discountPrice: v.optional(v.number()),
    location: v.string(),
    country: v.string(),
    imageUrl: v.array(v.string()),
    featured: v.boolean(),
    maxGroupSize: v.number(),
    difficulty: v.string(), // "easy", "moderate", "challenging"
    startDates: v.array(v.number()), // timestamps
    itinerary: v.array(v.object({
      day: v.number(),
      title: v.string(),
      description: v.string(),
      accommodation: v.string(),
      meals: v.string(),
    })),
    included: v.array(v.string()),
    excluded: v.array(v.string()),
    viewCount: v.number(), // Track number of views/clicks
    createdBy: v.string(), // clerkId of creator
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  
  // Bookings table to track tour reservations
  bookings: defineTable({
    userId: v.string(),
    userEmail: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
    tourId: v.id("tours"),
    tourName: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    guests: v.object({
      adults: v.number(),
      children: v.number(),
      infants: v.number(),
    }),
    specialRequests: v.string(),
    totalPrice: v.number(),
    depositAmount: v.number(),
    paymentStatus: v.string(),
    bookingStatus: v.string(),
    bookingReference: v.string(),
    emailNotifications: v.boolean(),
    whatsappUpdates: v.boolean(),
    paymentId: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    cancellationReason: v.optional(v.string()),
    cancelledAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_tour", ["tourId"])
    .index("by_status", ["bookingStatus"])
    .index("by_payment_status", ["paymentStatus"]),
  
  // Reviews for tours
  reviews: defineTable({
    userId: v.string(), // clerkId
    tourId: v.id("tours"),
    rating: v.number(), // 1-5
    comment: v.string(),
    images: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  
  // Destinations for travel
  destinations: defineTable({
    name: v.string(),
    slug: v.string(),
    country: v.string(),
    description: v.string(),
    content: v.array(v.object({
      type: v.string(), // "paragraph", "heading", "list", "quote", "imageGroup"
      value: v.any(), // content depends on type
    })),
    imageUrl: v.array(v.string()),
    featured: v.boolean(),
    attractions: v.array(v.string()),
    bestTimeToVisit: v.string(),
    clickCount: v.number(), // Track number of clicks/views
    createdBy: v.id("users"), // Link to the admin who created this
    lastUpdatedBy: v.id("users"), // Link to the admin who last updated this
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // FAQ entries
  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    category: v.string(), // "general", "bookings", "tours", "safety", etc.
    orderIndex: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Hero section content for the home page
  hero: defineTable({
    backgroundImageUrl: v.string(),
    mainHeading: v.string(),
    highlightedText: v.optional(v.string()),
    subheading: v.string(),
    updatedAt: v.number(),
  }),

  // About Us section content for the About page
  about: defineTable({
    heroImageUrl: v.string(),
    heroHeading: v.string(),
    heroSubheading: v.string(),
    storyImageUrl: v.string(),
    storyHeading: v.string(),
    storyContent: v.string(),
    advantages: v.array(
      v.object({
        icon: v.string(), // e.g. 'Binoculars', 'Leaf', 'Shield'
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
    updatedAt: v.number(),
  }),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  }),

  contactInfo: defineTable({
    phone: v.string(),
    email: v.string(),
    location: v.string(),
    businessHours: v.string(),
  })
}); 
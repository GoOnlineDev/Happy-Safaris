import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { WebhookEvent } from "@clerk/backend";

export const processClerkWebhook = internalAction({
  args: { headers: v.any(), payload: v.any() },
  handler: async (ctx, args) => {
    const evt = args.payload as WebhookEvent;
    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses?.[0]?.email_address;

      if (!primaryEmail) {
        throw new Error("User must have an email address");
      }

      // Sync user data to Convex
      await ctx.runMutation(internal.users.syncUser, {
        clerkId: id,
        email: primaryEmail,
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        imageUrl: image_url ?? undefined,
      });
    }

    if (eventType === "user.deleted") {
      // Handle user deletion if needed
      // You might want to add a deleteUser internal mutation
      console.log("User deleted:", evt.data.id);
    }
  },
}); 
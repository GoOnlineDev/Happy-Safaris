import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const payload = JSON.parse(payloadString);
    const { type, data } = payload;

    if (type === "user.created" || type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const primaryEmail = email_addresses?.[0]?.email_address;

      if (!primaryEmail) {
        return new Response("User must have an email address", { status: 400 });
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

    return new Response(null, { status: 200 });
  }),
});

export default http; 
"use client";

import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useEffect } from "react";

export function useAuth() {
  const clerkAuth = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { isAuthenticated, isLoading: convexLoading } = useConvexAuth();
  const convexUser = useQuery(api.users.getCurrentUser);
  const syncUserPublic = useMutation(api.users.syncUserPublic);

  // Sync user data when Clerk user changes
  useEffect(() => {
    const syncUserData = async () => {
      if (clerkAuth.isLoaded && clerkAuth.userId && isAuthenticated && clerkUser && !convexUser) {
        try {
          console.log("Syncing user data from Clerk to Convex...");
          await syncUserPublic({
            clerkId: clerkAuth.userId,
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            firstName: clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || "",
            lastName: clerkUser.lastName || "",
            imageUrl: clerkUser.imageUrl,
          });
          console.log("User data synced successfully");
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    };

    if (clerkAuth.isLoaded) {
      syncUserData();
    }
  }, [clerkAuth, clerkUser, isAuthenticated, syncUserPublic]);

  const logout = useCallback(async () => {
    try {
      window.location.href = "/sign-out-callback";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  return {
    user: convexUser || clerkUser,
    isLoading: !clerkAuth.isLoaded || convexLoading || (clerkUser && !convexUser),
    isAuthenticated: isAuthenticated && !!clerkUser && !!convexUser,
    logout,
  };
} 
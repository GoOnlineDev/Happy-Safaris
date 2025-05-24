"use client";

import { useAuth as useClerkAuth, useUser, useClerk } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useEffect } from "react";

export function useAuth() {
  const { isLoaded: isClerkLoaded, userId, sessionId } = useClerkAuth();
  const { isAuthenticated, isLoading: isConvexLoading } = useConvexAuth();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  
  // Get user profile from Convex if authenticated
  const profile = useQuery(
    api.users.getUserByClerkId, 
    userId ? { clerkId: userId } : "skip"
  );

  // Sync user mutation
  const syncUser = useMutation(api.users.syncUser);

  // Sync user data with Convex when authenticated
  useEffect(() => {
    const syncUserData = async () => {
      if (isAuthenticated && userId && user) {
        try {
          console.log('Syncing user data to Convex...');
          await syncUser({
            clerkId: userId,
            email: user.primaryEmailAddress?.emailAddress || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            imageUrl: user.imageUrl || undefined,
          });
          console.log('User data synced successfully');
        } catch (error) {
          console.error('Error syncing user data:', error);
        }
      }
    };

    syncUserData();
  }, [isAuthenticated, userId, user, syncUser]);

  // Calculate loading state from both Clerk and Convex
  const loading = !isClerkLoaded || isConvexLoading;

  // Function to check if user has a specific role
  const hasRole = (role: string) => {
    if (!profile) return false;
    return profile.role === role;
  };

  const logout = async () => {
    await signOut();
    router.push("/");
  };

  return {
    user,
    profile,
    userId,
    sessionId,
    loading,
    isAuthenticated,
    isAdmin: hasRole("admin"),
    isSuperAdmin: hasRole("superadmin"),
    isGuide: hasRole("guide"),
    isTourist: hasRole("tourist"),
    logout,
  };
} 
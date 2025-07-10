"use client";

import { useAuth as useClerkAuth, useUser, useClerk } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../convex/_generated/api";
import { useQuery } from "convex/react";

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
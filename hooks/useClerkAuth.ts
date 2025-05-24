import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useAuth = () => {
  const { isLoaded, userId, sessionId, signOut } = useClerkAuth();
  const { user } = useUser();
  const router = useRouter();
  const syncUser = useMutation(api.users.syncUserPublic);

  // Sync user data when Clerk user changes
  useEffect(() => {
    if (isLoaded && userId && user) {
      // Sync user data including image URL to Convex
      syncUser({
        clerkId: userId,
        email: user.primaryEmailAddress?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        imageUrl: user.imageUrl,
      }).catch(error => {
        console.error("Error syncing user data:", error);
      });
    }
  }, [isLoaded, userId, user, syncUser]);

  const logout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    isLoaded,
    isAuthenticated: !!userId,
    sessionId,
    user,
    logout,
  };
}; 
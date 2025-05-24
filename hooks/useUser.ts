import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

export function useUser() {
  const { isSignedIn, isLoaded } = useAuth();
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const updateRole = useMutation(api.users.updateUserRole);

  const isAdmin = user?.role === "admin";
  const isTourist = user?.role === "tourist";

  return {
    user,
    isAdmin,
    isTourist,
    isLoading: !isLoaded || (isSignedIn && user === undefined),
    updateProfile: async (data: {
      phone?: string;
      country?: string;
      address?: string;
      preferredCurrency?: string;
      preferredLanguage?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      return await updateProfile(data);
    },
    updateRole: async (userId: Id<"users">, role: "admin" | "tourist") => {
      if (!isAdmin) throw new Error("Unauthorized");
      return await updateRole({ userId, role });
    },
  };
} 
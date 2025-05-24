"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useClerkAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoaded, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
} 
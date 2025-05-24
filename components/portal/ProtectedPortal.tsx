"use client";

import { useAuth } from "@/hooks/useClerkAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedPortalProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

export default function ProtectedPortal({ 
  children, 
  requireAdmin = false,
  requireSuperAdmin = false,
}: ProtectedPortalProps) {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setIsLoading(false);
      
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a2421] flex items-center justify-center">
        <div className="text-[#e3b261] text-lg">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
} 
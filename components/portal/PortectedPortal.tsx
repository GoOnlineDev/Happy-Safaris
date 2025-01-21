"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (requireSuperAdmin && !isSuperAdmin) {
        router.push("/portal");
      } else if (requireAdmin && !isAdmin) {
        router.push("/portal");
      }
    }
  }, [user, loading, router, requireAdmin, requireSuperAdmin, isAdmin, isSuperAdmin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
} 
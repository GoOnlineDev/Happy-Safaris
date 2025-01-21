import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    return (
      <div className="min-h-screen bg-[#1a2421] flex items-center justify-center">
        <div className="text-[#e3b261] text-lg">Loading...</div>
      </div>
    );
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
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1a2421]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#e3b261]" />
      </div>
    );
  }

  return <>{children}</>;
}; 
"use client";

import { useAuth } from "@/hooks/useClerkAuth";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Map, User, Heart, CreditCard, MessageSquare } from "lucide-react";

export default function PortalPage() {
  const { user, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
    if (isAuthenticated !== undefined) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Show loading state during authentication check
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-primary text-2xl">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (isClient && !isAuthenticated) {
    redirect("/login");
  }

  const quickActions = [
    {
      title: "Browse Tours",
      description: "Explore our exciting safari adventures",
      icon: Map,
      href: "/tours",
      color: "bg-blue-500/20 text-blue-400"
    },
    {
      title: "My Bookings",
      description: "View your upcoming and past safari trips",
      icon: Calendar,
      href: "/portal/bookings",
      color: "bg-green-500/20 text-green-400"
    },
    {
      title: "Profile",
      description: "Update your personal information",
      icon: User,
      href: "/portal/profile",
      color: "bg-purple-500/20 text-purple-400"
    },
    {
      title: "Favorites",
      description: "View your saved destinations",
      icon: Heart,
      href: "/portal/favorites",
      color: "bg-red-500/20 text-red-400"
    },
    {
      title: "Payment Methods",
      description: "Manage your payment options",
      icon: CreditCard,
      href: "/portal/payments",
      color: "bg-amber-500/20 text-amber-400"
    },
    {
      title: "Support",
      description: "Get help with your bookings",
      icon: MessageSquare,
      href: "/portal/support",
      color: "bg-teal-500/20 text-teal-400"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome, {user?.firstName || "Explorer"}!</h1>
        <p className="text-gray-400">Manage your safaris and explore new adventures</p>
      </div>
      
      {/* User welcome card */}
      <div className="bg-background-light p-6 rounded-xl shadow-lg flex items-center gap-6">
        <div className="flex-shrink-0">
          {user?.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className="h-20 w-20 rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center text-primary">
              <User className="h-10 w-10" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
          <div className="mt-3">
            <Link href="/portal/profile">
              <span className="text-primary hover:text-primary/90 transition flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Edit Profile</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick actions grid */}
      <h2 className="text-2xl font-semibold text-primary mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link 
            key={action.title} 
            href={action.href}
            className="bg-background-light rounded-xl shadow-lg p-6 border border-accent hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-md ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-1">{action.title}</h3>
                <p className="text-gray-400">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 
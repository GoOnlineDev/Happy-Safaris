"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  Users,
  CalendarDays,
  Map,
  X,
  BarChart2,
  CreditCard,
  UserCircle,
  Globe,
  Info,
  Mail,
} from "lucide-react";

const adminRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/portal",
    color: "text-sky-500",
  },
  {
    label: "Hero Section",
    icon: LayoutDashboard,
    href: "/portal/hero",
    color: "text-yellow-400",
  },
  {
    label: "About Page",
    icon: Info,
    href: "/portal/about",
    color: "text-green-400",
  },
  {
    label: "Bookings",
    icon: BookOpen,
    href: "/portal/bookings",
    color: "text-violet-500",
  },
  {
    label: "Tours",
    icon: Map,
    href: "/portal/tours",
    color: "text-pink-700",
  },
  {
    label: "Destinations",
    icon: Globe,
    href: "/portal/destinations",
    color: "text-blue-500",
  },
  {
    label: "Users",
    icon: Users,
    color: "text-orange-700",
    href: "/portal/users",
  },
  {
    label: "Analytics",
    icon: BarChart2,
    href: "/portal/analytics",
    color: "text-green-500",
  },
  {
    label: "Payments",
    icon: CreditCard,
    href: "/portal/payments",
    color: "text-yellow-500",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    href: "/portal/inbox",
    color: "text-emerald-500",
  },
  {
    label: "Contact",
    icon: Mail,
    href: "/portal/contact",
    color: "text-indigo-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/portal/settings",
  },
];

const touristRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/portal",
    color: "text-sky-500",
  },
  {
    label: "My Bookings",
    icon: CalendarDays,
    href: "/portal/my-bookings",
    color: "text-violet-500",
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/portal/profile",
    color: "text-blue-500",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    href: "/portal/inbox",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/portal/settings",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  className?: string;
}

export function Sidebar({ isOpen, onClose, isMobile, className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const routes = isAdmin ? adminRoutes : touristRoutes;

  return (
    <div className={cn(
      isMobile
        ? isOpen
          ? "fixed inset-y-0 left-0 z-50 w-64 bg-[#1a2421] transform transition-transform duration-300 ease-in-out"
          : "hidden"
        : "fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] z-30 border-r border-[#232b27] shadow-sm bg-[#1a2421] overflow-y-auto",
      className
    )}>
      <div className="space-y-4 py-4 flex flex-col h-full text-white">
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        )}
        <div className="px-3 py-2 flex-1">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-[#e3b261] hover:bg-[#2a3431] rounded-lg transition",
                  pathname === route.href ? "text-[#e3b261] bg-[#2a3431]" : "text-zinc-400",
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  Calendar,
  Settings,
  FileText,
  BarChart,
  Shield,
  X,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PortalSidebar({ isOpen, onClose }: PortalSidebarProps) {
  const pathname = usePathname();
  const { isAdmin, isSuperAdmin } = useAuth();

  const menuItems = [
    { href: "/portal", label: "Dashboard", icon: Home },
    { href: "/portal/bookings", label: "My Bookings", icon: Calendar },
    { href: "/portal/payments", label: "Payments", icon: CreditCard },
    { href: "/portal/inbox", label: "Inbox", icon: MessageSquare },
    { href: "/portal/profile", label: "Profile", icon: FileText },
    ...(isAdmin ? [
      { href: "/portal/users", label: "Users", icon: Users },
      { href: "/portal/analytics", label: "Analytics", icon: BarChart },
    ] : []),
    ...(isSuperAdmin ? [
      { href: "/portal/settings", label: "Settings", icon: Settings },
      { href: "/portal/roles", label: "Role Management", icon: Shield },
    ] : []),
  ];

  const sidebarContent = (
    <nav className="space-y-2">
      <div className="flex justify-end p-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-[#e3b261]"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onClose()}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
              isActive 
                ? "bg-[#e3b261] text-[#1a2421]" 
                : "text-gray-300 hover:text-[#e3b261]"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#1a2421] border-r border-[#3a4441] p-6">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed left-0 top-0 w-64 h-full bg-[#1a2421] border-r border-[#3a4441] p-6 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 
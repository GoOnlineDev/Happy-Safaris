"use client";

import { useAuth } from "@/hooks/useClerkAuth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Menu, User, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";


interface PortalHeaderProps {
  onMenuClick: () => void;
}

export function PortalHeader({ onMenuClick }: PortalHeaderProps) {
  const { user, logout } = useAuth();
  const convexUser = useQuery(api.users.getCurrentUser);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle menu button click
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMenuClick();
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 h-16 z-[50] transition-all duration-300 ${
        scrolled ? 'bg-[#1a2421] shadow-md' : 'bg-[#1a2421]'
      } border-b border-[#3a4441]`}>
        <div className="flex items-center justify-between h-full px-4 md:px-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:block text-gray-400 hover:text-[#e3b261] focus:outline-none"
              onClick={handleMenuClick}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg md:text-xl font-bold text-[#e3b261] truncate">
              {convexUser?.role === 'super_admin' ? 'Admin Portal' : 
               convexUser?.role === 'admin' ? 'Staff Portal' : 'Tourist Portal'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-[#e3b261] focus:outline-none hidden md:flex"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-[#e3b261] focus:outline-none"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-label="Profile Menu"
              >
                <div className="h-8 w-8 rounded-full bg-[#3a4441] flex items-center justify-center text-[#e3b261] border border-[#3a4441]">
                  {convexUser?.imageUrl ? (
                    <img 
                      src={convexUser.imageUrl} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
              </Button>
              
              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-[#1a2421] border border-[#3a4441] rounded-md shadow-lg z-[60]"
                  >
                    <div className="py-1">
                      <Link href="/portal/profile">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-gray-400 hover:text-[#e3b261] hover:bg-[#2a3431] px-4"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                      </Link>
                      <Link href="/portal/settings">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-gray-400 hover:text-[#e3b261] hover:bg-[#2a3431] px-4"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-gray-400 hover:text-[#e3b261] hover:bg-[#2a3431] px-4"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for Profile Menu (Mobile) */}
      <AnimatePresence>
        {isProfileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[45]"
            onClick={() => setIsProfileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
} 
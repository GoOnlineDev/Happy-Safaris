"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useClerkAuth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Compass,
  Map,
  Info,
  Phone,
  FileText,
  LayoutDashboard,
} from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, logout } = useAuth();
  
  // Fetch the current user's profile from Convex
  const convexUser = useQuery(api.users.getCurrentUser);

  // Set isMounted to true on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get the profile image URL from Convex if available
  const profileImageUrl = convexUser?.imageUrl || user?.imageUrl;

  const menuItems = [
    { href: "/destinations", label: "Destinations", icon: Compass },
    { href: "/tours", label: "Tours", icon: Map },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/terms", label: "Terms & Conditions", icon: FileText },
  ];

  // Initial class name for server rendering to prevent hydration mismatch
  const navClassName = `fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-6xl px-2 transition-all duration-300
    ${isMounted && (isScrolled || isOpen) ? 'bg-[#1a2421]/70' : 'bg-[#1a2421]/50'}
    rounded-full shadow-xl backdrop-blur-lg flex items-center justify-between`;

  return (
    <nav className={navClassName} style={{ minHeight: 72 }}>
      <div className="flex justify-between items-center w-full h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 z-50 ml-0 sm:ml-2">
          <div className="relative h-10 w-36 sm:w-40">
            <Image
              src="/logo.png"
              alt="Happy African Safaris"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-300 hover:text-[#e3b261] transition-colors flex items-center space-x-1"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-[#e3b261] flex items-center space-x-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {profileImageUrl ? (
                    <img 
                      src={profileImageUrl} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover border border-[#e3b261]"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#3a4441] flex items-center justify-center text-[#e3b261]">
                      {user.firstName?.[0] || user.lastName?.[0] || <User className="h-4 w-4" />}
                    </div>
                  )}
                  <span>Account</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#1a2421] border border-[#3a4441] rounded-md shadow-lg overflow-hidden"
                    >
                      <Link href="/portal">
                        <Button
                          variant="ghost"
                          className="w-full text-left text-gray-300 hover:text-[#e3b261] hover:bg-[#2a3431] flex items-center space-x-2 px-4 py-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Portal</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full text-left text-gray-300 hover:text-[#e3b261] hover:bg-[#2a3431] flex items-center space-x-2 px-4 py-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-[#e3b261]">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-300 hover:text-[#e3b261] z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 bg-[#1a2421] lg:hidden pt-20"
          >
            <div className="container mx-auto px-4 py-4 h-full overflow-y-auto">
              <div className="flex flex-col space-y-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-300 hover:text-[#e3b261] transition-colors py-2 flex items-center space-x-2 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                <div className="pt-6 border-t border-[#3a4441] space-y-4">
                  {user ? (
                    <>
                      <Link href="/portal" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full text-left text-gray-300 hover:text-[#e3b261] flex items-center space-x-2 text-lg"
                        >
                          {profileImageUrl ? (
                            <img 
                              src={profileImageUrl} 
                              alt="Profile" 
                              className="h-8 w-8 rounded-full object-cover border border-[#e3b261] mr-2"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-[#3a4441] flex items-center justify-center text-[#e3b261] mr-2">
                              {user.firstName?.[0] || user.lastName?.[0] || <LayoutDashboard className="h-5 w-5" />}
                            </div>
                          )}
                          <span>Portal</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full text-left text-gray-300 hover:text-[#e3b261] flex items-center space-x-2 text-lg"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full text-gray-300 hover:text-[#e3b261] text-lg">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] text-lg">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 
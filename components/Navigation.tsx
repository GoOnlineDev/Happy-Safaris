"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useClerkAuth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  const convexUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const profileImageUrl = convexUser?.imageUrl || user?.imageUrl;

  const menuItems = [
    { href: "/destinations", label: "Destinations", icon: Compass },
    { href: "/tours", label: "Tours", icon: Map },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/terms", label: "Terms & Conditions", icon: FileText },
  ];

  const navClassName = `fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-6xl px-2 transition-all duration-300
    ${isMounted && (isScrolled || isOpen) ? 'bg-secondary/70' : 'bg-secondary/50'}
    rounded-full shadow-xl backdrop-blur-lg flex items-center justify-between`;

  return (
    <nav className={navClassName} style={{ minHeight: 72 }}>
      <div className="flex justify-between items-center w-full h-16 px-4">
        <Link href="/" className="flex items-center space-x-2 z-50 ml-0 sm:ml-2">
          <div className="relative h-10 w-36 sm:w-40">
            <Image
              src="/logo.png"
              alt="Happy African Safaris"
              fill
              className="object-contain"
              sizes="160px"
              priority
            />
          </div>
        </Link>

        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-gray-300 hover:text-primary transition-colors flex items-center space-x-1",
                pathname === item.href && "text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-primary flex items-center space-x-2"
                  >
                    {profileImageUrl ? (
                      <Image 
                        src={profileImageUrl} 
                        alt="Profile" 
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover border border-primary"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-primary">
                        {user.firstName?.[0] || user.lastName?.[0] || <User className="h-4 w-4" />}
                      </div>
                    )}
                    <span>Account</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-secondary border-accent text-gray-300">
                  <DropdownMenuItem asChild>
                    <Link href="/portal" className="cursor-pointer hover:text-primary">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Portal</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-accent" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:text-primary">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <Button>Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>

        <button
          className="lg:hidden text-gray-300 hover:text-primary z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 bg-secondary lg:hidden pt-20"
          >
            <div className="container mx-auto px-4 py-4 h-full overflow-y-auto">
              <div className="flex flex-col space-y-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-gray-300 hover:text-primary transition-colors py-2 flex items-center space-x-2 text-lg",
                      pathname === item.href && "text-primary"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                <div className="pt-6 border-t border-accent space-y-4">
                  {user ? (
                    <>
                      <Link href="/portal" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full text-left text-gray-300 hover:text-primary flex items-center space-x-2 text-lg"
                        >
                          {profileImageUrl ? (
                            <Image 
                              src={profileImageUrl} 
                              alt="Profile" 
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover border border-primary mr-2"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-primary mr-2">
                              {user.firstName?.[0] || user.lastName?.[0] || <LayoutDashboard className="h-5 w-5" />}
                            </div>
                          )}
                          <span>Portal</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full text-left text-gray-300 hover:text-primary flex items-center space-x-2 text-lg"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full text-gray-300 hover:text-primary text-lg">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-secondary text-lg">
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
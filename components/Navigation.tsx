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
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/destinations", label: "Destinations", icon: Compass },
  { href: "/tours", label: "Tours", icon: Map },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
  { href: "/terms", label: "Terms", icon: FileText },
];

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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const profileImageUrl = convexUser?.imageUrl || user?.imageUrl;

  return (
    <>
      <nav
        className={cn(
          "fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-6xl px-3 sm:px-4 transition-all duration-300 rounded-full shadow-2xl backdrop-blur-lg flex items-center justify-between",
          isMounted && (isScrolled || isOpen)
            ? "bg-secondary/80 border border-primary/20"
            : "bg-secondary/50 border border-white/10"
        )}
        style={{ minHeight: 64 }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center z-50 shrink-0"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative h-9 w-32 sm:h-10 sm:w-36">
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

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg flex items-center gap-1.5 group",
                pathname === item.href
                  ? "text-primary"
                  : "text-gray-300 hover:text-primary hover:bg-white/5"
              )}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              <span>{item.label}</span>
              {pathname === item.href && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Auth - Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-primary flex items-center gap-2 h-9 px-3"
                >
                  {profileImageUrl ? (
                    <Image
                      src={profileImageUrl}
                      alt="Profile"
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover border border-primary/60"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-primary text-sm">
                      {user.firstName?.[0] || <User className="h-3.5 w-3.5" />}
                    </div>
                  )}
                  <span className="text-sm">Account</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-secondary border-accent text-gray-300" align="end">
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
            <div className="flex items-center gap-2">
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-primary">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 text-gray-300 hover:text-primary rounded-lg transition-colors z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/98 backdrop-blur-xl lg:hidden z-40 pt-20 pb-8 overflow-y-auto"
          >
            <div className="container mx-auto px-6">
              {/* Nav links */}
              <div className="flex flex-col mt-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 py-4 px-2 border-b border-border/50 text-lg font-medium transition-colors",
                        pathname === item.href ? "text-primary" : "text-gray-200 hover:text-primary"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0", pathname === item.href ? "text-primary" : "text-gray-400")} />
                      <span>{item.label}</span>
                      {pathname === item.href && (
                        <span className="ml-auto">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Auth section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-8 pt-4"
              >
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-secondary/60 rounded-xl border border-border">
                      {profileImageUrl ? (
                        <Image
                          src={profileImageUrl}
                          alt="Profile"
                          width={44}
                          height={44}
                          className="h-11 w-11 rounded-full object-cover border-2 border-primary/50"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-accent flex items-center justify-center text-primary text-lg font-semibold">
                          {user.firstName?.[0] || <User className="h-5 w-5" />}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{user.firstName} {user.lastName}</p>
                        <p className="text-muted-foreground text-xs">{user.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                    <Link href="/portal" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-3 border-border text-gray-200 hover:text-primary h-12">
                        <LayoutDashboard className="h-5 w-5" />
                        Portal
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 h-12"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <SignInButton mode="modal" fallbackRedirectUrl="/">
                      <Button variant="outline" className="w-full border-border text-gray-200 h-12 text-base">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal" fallbackRedirectUrl="/">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base">
                        <Sparkles className="mr-1.5 h-4 w-4" />
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

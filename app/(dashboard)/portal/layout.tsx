"use client";

import { Sidebar } from "@/components/portal/Sidebar";
import { PortalHeader } from "@/components/portal/Header";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      // Only reset sidebar state when switching from mobile to desktop
      if (!isMobileView && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  return (
    <div className="min-h-screen bg-[#1a2421] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-16 bg-[#19201c] flex items-center px-6 z-40 shadow-sm">
        <PortalHeader onMenuClick={toggleSidebar} />
      </header>
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={isMobile} className="mt-0 border-r border-[#232b27] shadow-sm" />
        {/* Main Content */}
        <main className={`flex-1 pt-8 pb-8 px-4 md:px-8 max-w-6xl mx-auto w-full transition-all duration-300 ${!isMobile ? 'ml-64' : ''}`}>
          {children}
        </main>
      </div>
      {/* Floating menu button for mobile */}
      {isMobile && (
        <button
          className="fixed bottom-4 right-4 z-[100] bg-[#e3b261] text-[#1a2421] hover:bg-[#c49a51] p-3 rounded-full shadow-lg md:hidden flex items-center justify-center"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
    </div>
  );
} 
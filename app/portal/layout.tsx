"use client";

import { PortalSidebar } from "@/components/portal/Sidebar";
import { PortalHeader } from "@/components/portal/Header";
import { useState } from "react";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a2421]">
      <PortalHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <PortalSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-8 mt-16 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
} 
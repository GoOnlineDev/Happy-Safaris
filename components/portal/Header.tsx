"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Menu } from "lucide-react";

interface PortalHeaderProps {
  onMenuClick: () => void;
}

export function PortalHeader({ onMenuClick }: PortalHeaderProps) {
  const { userProfile } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#1a2421] border-b border-[#3a4441] z-40">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-400 hover:text-[#e3b261]"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg md:text-xl font-bold text-[#e3b261]">
            {userProfile?.role === 'super_admin' ? 'Admin Portal' : 
             userProfile?.role === 'admin' ? 'Staff Portal' : 'User Portal'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-[#e3b261]"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-[#e3b261]"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
} 
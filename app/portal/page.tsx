"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import { Calendar, Users, Clock, MapPin } from "lucide-react";

export default function PortalDashboard() {
  const { userProfile } = useAuth();

  return (
    <ProtectedPortal>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#e3b261] mb-2">
            Welcome back, {userProfile?.name || userProfile?.email}
          </h1>
          <p className="text-gray-400">
            Manage your bookings and account settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#e3b261]/10 rounded-lg">
                <Calendar className="h-6 w-6 text-[#e3b261]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Upcoming Tours</p>
                <h3 className="text-2xl font-bold text-white">3</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#e3b261]/10 rounded-lg">
                <Clock className="h-6 w-6 text-[#e3b261]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Tours</p>
                <h3 className="text-2xl font-bold text-white">12</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#e3b261]/10 rounded-lg">
                <MapPin className="h-6 w-6 text-[#e3b261]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Destinations</p>
                <h3 className="text-2xl font-bold text-white">5</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#e3b261]/10 rounded-lg">
                <Users className="h-6 w-6 text-[#e3b261]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Group Size</p>
                <h3 className="text-2xl font-bold text-white">4</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="p-6 bg-[#1a2421] border-[#3a4441]">
          <h2 className="text-xl font-semibold text-[#e3b261] mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {/* Add your bookings list here */}
            <p className="text-gray-400">No recent bookings found.</p>
          </div>
        </Card>
      </div>
    </ProtectedPortal>
  );
} 
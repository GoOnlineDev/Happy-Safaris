"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import { Calendar, MapPin, Users, Clock, Search, Filter } from "lucide-react";

// Mock data - replace with actual data from your backend
const bookings = [
  {
    id: "1",
    tourName: "Gorilla Trekking Adventure",
    location: "Bwindi Impenetrable Forest",
    date: "2024-04-15",
    status: "upcoming",
    participants: 2,
    duration: "3 Days",
    price: "$1,400",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
  },
  {
    id: "2",
    tourName: "Queen Elizabeth Safari",
    location: "Queen Elizabeth National Park",
    date: "2024-03-01",
    status: "completed",
    participants: 4,
    duration: "4 Days",
    price: "$2,000",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
  },
  // Add more bookings as needed
];

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <ProtectedPortal>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#e3b261] mb-2">My Bookings</h1>
          <p className="text-gray-400">Manage your tour bookings and itineraries</p>
        </motion.div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-transparent border-[#3a4441] text-white focus:border-[#e3b261]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="pl-10 bg-transparent border-[#3a4441] text-white focus:border-[#e3b261]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors">
                <div className="relative h-48">
                  <img
                    src={booking.image}
                    alt={booking.tourName}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{booking.tourName}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400">
                      <MapPin className="h-4 w-4 text-[#e3b261] mr-2" />
                      {booking.location}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 text-[#e3b261] mr-2" />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users className="h-4 w-4 text-[#e3b261] mr-2" />
                      {booking.participants} {booking.participants === 1 ? 'Person' : 'People'}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Clock className="h-4 w-4 text-[#e3b261] mr-2" />
                      {booking.duration}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-[#e3b261]">{booking.price}</span>
                    <Button className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No bookings found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedPortal>
  );
} 
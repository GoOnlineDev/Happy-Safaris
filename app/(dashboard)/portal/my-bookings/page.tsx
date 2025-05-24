"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2, Search, Calendar, Users, CreditCard } from "lucide-react";
import Link from "next/link";

export default function MyBookingsPage() {
  const { user, isLoading: userLoading } = useUser();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Get user's bookings
  const bookings = useQuery(api.bookings.list, { 
    userId: user?.clerkId || "" 
  });
  
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#e3b261]" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-[#e3b261] mb-4">Access Denied</h1>
        <p className="text-white mb-6">Please sign in to view your bookings.</p>
        <Link href="/login">
          <Button className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }
  
  // Filter bookings
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
      booking.tourName.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || booking.bookingStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#e3b261] mb-2">My Bookings</h1>
          <p className="text-gray-400">View and manage your tour bookings</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#2a3431] border-[#3a4441] text-white w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-[#2a3431] border-[#3a4441] text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-[#1a2421] border-[#3a4441]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings?.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="font-medium">
                    {booking.bookingReference}
                  </TableCell>
                  <TableCell>{booking.tourName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[#e3b261]" />
                      <span>{formatDate(booking.startDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-[#e3b261]" />
                      <span>
                        {booking.guests.adults} adults, {booking.guests.children} children
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-[#e3b261]" />
                      <span>{formatCurrency(booking.totalPrice)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.bookingStatus === "confirmed" ? "bg-green-500/10 text-green-500" :
                      booking.bookingStatus === "cancelled" ? "bg-red-500/10 text-red-500" :
                      booking.bookingStatus === "completed" ? "bg-blue-500/10 text-blue-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.paymentStatus === "paid" ? "bg-green-500/10 text-green-500" :
                      booking.paymentStatus === "refunded" ? "bg-red-500/10 text-red-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/portal/my-bookings/${booking._id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431]"
                      >
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}

              {filteredBookings?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-gray-400">No bookings found.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
} 
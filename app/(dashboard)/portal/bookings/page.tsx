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
import { Loader2, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Get all bookings
  const bookings = useQuery(api.bookings.listAll);
  
  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#e3b261]" />
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-[#e3b261] mb-4">Access Denied</h1>
        <p className="text-white mb-6">You don't have permission to access this page.</p>
        <Link href="/portal">
          <Button className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
            Back to Portal
          </Button>
        </Link>
      </div>
    );
  }
  
  // Filter bookings
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
      booking.firstName.toLowerCase().includes(search.toLowerCase()) ||
      booking.lastName.toLowerCase().includes(search.toLowerCase()) ||
      booking.tourName.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || booking.bookingStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleMessageClick = (userId: string) => {
    // Create or get existing conversation
    router.push(`/portal/inbox?userId=${userId}`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#e3b261]">Bookings</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#2a3431] border-[#3a4441] text-white w-full sm:w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-[#2a3431] border-[#3a4441] text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
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
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
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
                    {booking.firstName} {booking.lastName}
                    <br />
                    <span className="text-sm text-gray-400">{booking.userEmail}</span>
                  </TableCell>
                  <TableCell>
                    {formatDate(booking.startDate)}
                    <br />
                    <span className="text-sm text-gray-400">
                      {booking.guests.adults} adults, {booking.guests.children} children
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(booking.totalPrice)}</TableCell>
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
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMessageClick(booking.userId)}
                        className="text-[#e3b261] hover:text-[#c49a51]"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Link href={`/portal/bookings/${booking._id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431]"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
} 
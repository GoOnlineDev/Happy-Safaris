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
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function MyBookingsPage() {
  const { user, isLoading: userLoading } = useUser();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supportBookingId, setSupportBookingId] = useState<string | null>(null);
  const [supportMessage, setSupportMessage] = useState("");
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Get user's bookings
  const bookings = useQuery(api.bookings.list, { 
    userId: user?.clerkId || "" 
  });
  
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Access Denied</h1>
        <p className="text-white mb-6">Please sign in to view your bookings.</p>
        <Link href="/login">
          <Button className="bg-primary hover:bg-primary/90 text-secondary">
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

  const handleViewDetails = (bookingId: string) => {
    const booking = bookings?.find(b => b._id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    }
  };

  const handleContactSupport = (bookingId: string) => {
    setSupportBookingId(bookingId);
    setSupportMessage("");
    setIsSupportModalOpen(true);
  };

  const handleSendSupportMessage = async () => {
    if (!supportBookingId || !supportMessage) return;

    try {
      await api.supportMessages.create({
        bookingId: supportBookingId,
        message: supportMessage,
      });
      alert("Support message sent!");
      setIsSupportModalOpen(false);
      setSupportBookingId(null);
      setSupportMessage("");
    } catch (error) {
      console.error("Error sending support message:", error);
      alert("Failed to send support message.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-6">My Bookings</h1>
      </motion.div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-12 px-6 bg-secondary border border-accent rounded-lg"
        >
          <h2 className="text-2xl font-semibold text-white mb-2">No Bookings Yet</h2>
          <p className="text-gray-400 mb-6">You haven't booked any tours yet. Explore our destinations and find your next adventure!</p>
          <Link href="/destinations">
            <Button className="bg-primary hover:bg-primary/90 text-secondary">Explore Destinations</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-6">My Bookings</h1>
              <p className="text-gray-400">View and manage your tour bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background border-border text-white w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-background border-border text-white">
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

          <Card className="bg-secondary border-border">
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
                  {filteredBookings?.map((booking, index) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-secondary border-accent overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="md:col-span-1">
                            {booking.tourDetails?.imageUrl ? (
                              <img
                                src={booking.tourDetails.imageUrl}
                                alt={booking.tourName}
                                className="w-full h-40 object-cover"
                              />
                            ) : (
                              <div className="w-full h-40 bg-background-light flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="md:col-span-2 p-4">
                            <h3 className="text-xl font-bold text-primary mb-2">{booking.tourName}</h3>
                            <p className="text-gray-400 mb-2">
                              <Calendar className="h-4 w-4 inline-block mr-1" />
                              {formatDate(booking.startDate)}
                            </p>
                            <p className="text-gray-400 mb-2">
                              <Users className="h-4 w-4 inline-block mr-1" />
                              {booking.guests.adults} Adults, {booking.guests.children} Children
                            </p>
                            <p className="text-gray-400 mb-2">
                              <CreditCard className="h-4 w-4 inline-block mr-1" />
                              {formatCurrency(booking.totalPrice)}
                            </p>
                            <p className="text-gray-400 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.bookingStatus === "confirmed" ? "bg-green-500/10 text-green-500" :
                                booking.bookingStatus === "cancelled" ? "bg-red-500/10 text-red-500" :
                                booking.bookingStatus === "completed" ? "bg-blue-500/10 text-blue-500" :
                                "bg-yellow-500/10 text-yellow-500"
                              }`}>
                                {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                              </span>
                            </p>
                            <p className="text-gray-400 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.paymentStatus === "paid" ? "bg-green-500/10 text-green-500" :
                                booking.paymentStatus === "refunded" ? "bg-red-500/10 text-red-500" :
                                "bg-yellow-500/10 text-yellow-500"
                              }`}>
                                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                              </span>
                            </p>
                            <div className="flex justify-end items-center mt-6 space-x-4">
                              <Button
                                variant="outline"
                                className="border-accent text-primary hover:bg-background-light"
                                onClick={() => handleViewDetails(booking._id)}
                              >
                                View Details
                              </Button>
                              <Button 
                                className="bg-primary hover:bg-primary/90 text-secondary"
                                onClick={() => handleContactSupport(booking._id)}
                              >
                                Contact Support
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-secondary border-accent text-white">
            <DialogHeader>
              <DialogTitle className="text-primary">{selectedBooking.tourDetails?.name}</DialogTitle>
              <DialogDescription>
                Booking Details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p><strong>Status:</strong> <Badge variant={selectedBooking.status === 'Confirmed' ? 'default' : 'secondary'} className="capitalize">{selectedBooking.status}</Badge></p>
              <p><strong>Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> {selectedBooking.adults} Adults, {selectedBooking.children} Children</p>
              <p><strong>Total Price:</strong> ${selectedBooking.totalPrice.toLocaleString()}</p>
              {selectedBooking.specialRequirements && (
                <div className="pt-2">
                  <p className="font-semibold">Special Requirements:</p>
                  <p className="text-gray-400 bg-background-light p-2 rounded-md mt-1">{selectedBooking.specialRequirements}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)} variant="outline" className="border-accent text-primary hover:bg-background-light">Close</Button>
              <Button onClick={() => handleContactSupport(selectedBooking._id)} className="bg-primary hover:bg-primary/90 text-secondary">Contact Support</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Support Modal */}
      {supportBookingId && (
        <Dialog open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
          <DialogContent className="bg-secondary border-accent text-white">
            <DialogHeader>
              <DialogTitle className="text-primary">Contact Support</DialogTitle>
              <DialogDescription>
                Send a message to our support team regarding your booking.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-32 p-2 rounded-md bg-background-light border-accent text-white"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setIsSupportModalOpen(false)} variant="outline" className="border-accent text-primary hover:bg-background-light">Cancel</Button>
              <Button onClick={handleSendSupportMessage} className="bg-primary hover:bg-primary/90 text-secondary">
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 
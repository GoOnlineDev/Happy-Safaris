"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
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
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function MyBookingsPage() {
  const { user, isLoading: userLoading } = useUser();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supportBookingId, setSupportBookingId] = useState<Id<"bookings"> | null>(null);
  const [supportMessage, setSupportMessage] = useState("");
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Get user's bookings
  const bookings = useQuery(api.bookings.list, { 
    userId: user?.clerkId || "" 
  });
  const createSupportTicket = useMutation(api.support.createTicket);
  
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

  const handleViewDetails = (bookingId: Id<"bookings">) => {
    const booking = bookings?.find(b => b._id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    }
  };

  const handleContactSupport = (bookingId: Id<"bookings">) => {
    setSupportBookingId(bookingId);
    setSupportMessage("");
    setIsSupportModalOpen(true);
  };

  const handleSendSupportMessage = async () => {
    if (!supportBookingId || !supportMessage) return;

    try {
      await createSupportTicket({
        bookingId: supportBookingId,
        subject: `Support for booking: ${supportBookingId}`,
        message: supportMessage,
      });
      toast.success("Support ticket created and message sent!");
      setIsSupportModalOpen(false);
      setSupportBookingId(null);
      setSupportMessage("");
    } catch (error: any) {
      console.error("Error sending support message:", error);
      toast.error(error.message || "Failed to create support ticket.");
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

      {bookings && bookings.length === 0 ? (
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">My Bookings</h1>
              <p className="text-gray-400 mt-1">View and manage your tour bookings</p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background-light border-accent text-white w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-background-light border-accent text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {filteredBookings?.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-secondary border-accent overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="md:col-span-1">
                      {booking.tourDetails?.imageUrl ? (
                        <img
                          src={Array.isArray(booking.tourDetails.imageUrl) ? booking.tourDetails.imageUrl[0] : booking.tourDetails.imageUrl}
                          alt={booking.tourName}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-background-light flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2 p-4 flex flex-col justify-between">
                      <div>
                        <Link href={`/tours/${booking.tourDetails?.slug}`}>
                          <h3 className="text-xl font-bold text-primary hover:underline mb-2">{booking.tourName}</h3>
                        </Link>
                        <p className="text-sm text-gray-400 mb-2">Ref: {booking.bookingReference}</p>
                        <div className="flex items-center text-sm text-gray-300 mb-1">
                          <Calendar className="h-4 w-4 inline-block mr-2" />
                          <span>{formatDate(booking.startDate)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-300 mb-3">
                          <Users className="h-4 w-4 inline-block mr-2" />
                          <span>{booking.guests.adults} Adults, {booking.guests.children} Children</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                           <Badge variant={
                             booking.bookingStatus === 'confirmed' ? 'default' :
                             booking.bookingStatus === 'cancelled' ? 'destructive' :
                             'outline'
                           }>{booking.bookingStatus}</Badge>
                           <Badge variant={
                             booking.paymentStatus === 'paid' ? 'default' :
                             booking.paymentStatus === 'refunded' ? 'destructive' :
                             'outline'
                           }>{booking.paymentStatus}</Badge>
                          <span className="font-semibold text-lg text-white">{formatCurrency(booking.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end items-center mt-auto p-4 bg-background-light space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-accent text-primary hover:bg-accent"
                      onClick={() => handleViewDetails(booking._id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleContactSupport(booking._id)}
                    >
                      Contact Support
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-secondary border-accent text-white">
          <DialogHeader>
            <DialogTitle className="text-primary">{selectedBooking?.tourName}</DialogTitle>
            <DialogDescription>
              Booking Reference: {selectedBooking?.bookingReference}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="mt-4 space-y-3 text-sm">
              <p><strong>Status:</strong> <Badge variant={selectedBooking.bookingStatus === 'confirmed' ? 'default' : 'outline'}>{selectedBooking.bookingStatus}</Badge></p>
              <p><strong>Date:</strong> {formatDate(selectedBooking.startDate)}</p>
              <p><strong>Guests:</strong> {selectedBooking.guests.adults} Adults, {selectedBooking.guests.children} Children</p>
              <p><strong>Total Price:</strong> {formatCurrency(selectedBooking.totalPrice)}</p>
              <p><strong>Deposit Paid:</strong> {formatCurrency(selectedBooking.depositAmount)}</p>
              <p><strong>Payment Status:</strong> <Badge variant={selectedBooking.paymentStatus === 'paid' ? 'default' : 'outline'}>{selectedBooking.paymentStatus}</Badge></p>
              {selectedBooking.specialRequests && <p><strong>Special Requests:</strong> {selectedBooking.specialRequests}</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Support Modal */}
      <Dialog open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
        <DialogContent className="bg-secondary border-accent text-white">
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>
              Send a message regarding your booking: {bookings?.find(b => b._id === supportBookingId)?.bookingReference}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full h-32 p-2 bg-background-light border border-accent rounded-md text-white"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSupportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSendSupportMessage} disabled={!supportMessage.trim()}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
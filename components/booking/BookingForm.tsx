"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { Loader2, CalendarDays, Users, CreditCard } from "lucide-react";

interface BookingFormProps {
  tour: any; // Replace with proper tour type
  selectedDate?: Date;
  onSuccess?: () => void;
}

export function BookingForm({ tour, selectedDate, onSuccess }: BookingFormProps) {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [startDate, setStartDate] = useState<Date | undefined>(selectedDate);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [specialRequests, setSpecialRequests] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);
  
  // Calculate total price
  const totalPrice = tour.price * (guests.adults + (guests.children * 0.7));
  const depositAmount = totalPrice * 0.3; // 30% deposit
  
  // Create booking mutation
  const createBooking = useMutation(api.bookings.create);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to book this tour");
      router.push("/login");
      return;
    }
    
    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Generate a unique booking reference
      const bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
      
      // Create the booking
      const bookingId = await createBooking({
        userId: user.clerkId,
        userEmail: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        tourId: tour._id,
        tourName: tour.title,
        startDate: startDate.getTime(),
        endDate: new Date(startDate.getTime() + (tour.duration * 24 * 60 * 60 * 1000)).getTime(),
        guests,
        specialRequests,
        totalPrice,
        depositAmount,
        paymentStatus: "pending",
        bookingStatus: "draft",
        bookingReference,
        emailNotifications,
        whatsappUpdates,
      });
      
      // Redirect to thank you page
      router.push("/thank-you");
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (userLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#e3b261]" />
      </div>
    );
  }
  
  return (
    <Card className="p-6 bg-[#1a2421] border-[#3a4441]">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Date Selection */}
        <div>
          <Label className="text-gray-300 text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#e3b261]" />
            Tour Date
          </Label>
          <Select
            value={startDate ? startDate.getTime().toString() : ""}
            onValueChange={(value) => {
              const date = new Date(Number(value));
              setStartDate(date);
            }}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select tour date" />
            </SelectTrigger>
            <SelectContent>
              {tour.startDates.map((ts: number) => (
                <SelectItem key={ts} value={ts.toString()}>
                  {format(new Date(ts), "PPP")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!startDate && <p className="text-red-500 text-sm mt-2">Please select a tour date.</p>}
        </div>

        {/* Guests */}
        <div>
          <Label className="text-gray-300 text-lg">Guests</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <Label className="text-sm">Adults</Label>
              <Select
                value={guests.adults.toString()}
                onValueChange={(value) => setGuests({ ...guests, adults: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: tour.maxGroupSize }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} {i === 0 ? "Adult" : "Adults"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Children (2-12)</Label>
              <Select
                value={guests.children.toString()}
                onValueChange={(value) => setGuests({ ...guests, children: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: tour.maxGroupSize + 1 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i} {i === 1 ? "Child" : "Children"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Infants (0-2)</Label>
              <Select
                value={guests.infants.toString()}
                onValueChange={(value) => setGuests({ ...guests, infants: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 4 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i} {i === 1 ? "Infant" : "Infants"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <Label className="text-gray-300 text-lg">Special Requests</Label>
          <Textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any dietary requirements, accessibility needs, or special requests..."
            className="bg-[#2a3431] border-[#3a4441] text-white min-h-24 mt-2"
          />
        </div>

        {/* Communication Preferences */}
        <div>
          <Label className="text-gray-300 text-lg">Communication Preferences</Label>
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Email Notifications</Label>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">WhatsApp Updates</Label>
              <Switch
                checked={whatsappUpdates}
                onCheckedChange={setWhatsappUpdates}
              />
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-[#2a3431] rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Tour Date</span>
            <span className="text-white">{startDate ? format(startDate, "PPP") : "--"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Guests</span>
            <span className="text-white">{guests.adults} Adults, {guests.children} Children, {guests.infants} Infants</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-gray-300">Total Price</span>
            <span className="text-[#e3b261]">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Deposit (30%)</span>
            <span className="text-white">{formatCurrency(depositAmount)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] text-lg py-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Booking...
            </>
          ) : (
            "Book Now"
          )}
        </Button>
        <p className="text-sm text-gray-400 text-center">
          By proceeding, you agree to our terms and conditions.
        </p>
      </form>
    </Card>
  );
} 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Wallet, Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface BookingFormProps {
  tour: any;
}

export function BookingForm({ tour }: BookingFormProps) {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [startDate, setStartDate] = useState<number | undefined>(tour.startDates?.[0]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);

  const createBooking = useMutation(api.bookings.create);

  const totalGuests = adults + children;
  const pricePerAdult = tour.discountPrice || tour.price;
  const pricePerChild = pricePerAdult * 0.7; // 70% of adult price
  const subtotal = (adults * pricePerAdult) + (children * pricePerChild);
  const serviceFee = subtotal * 0.05; // 5% service fee
  const totalPrice = subtotal + serviceFee;
  const depositAmount = totalPrice * 0.3; // 30% deposit
  
  const handleGuestChange = (type: 'adults' | 'children', operation: 'increment' | 'decrement') => {
    const setter = type === 'adults' ? setAdults : setChildren;
    const currentValue = type === 'adults' ? adults : children;

    if (operation === 'increment' && totalGuests < tour.maxGroupSize) {
      setter(currentValue + 1);
    } else if (operation === 'decrement' && currentValue > (type === 'adults' ? 1 : 0)) {
      setter(currentValue - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to book this tour.");
      router.push(`/login?redirectUrl=/tours/${tour.slug}`);
      return;
    }
    if (!startDate) {
      toast.error("Please select a valid start date.");
      return;
    }
    if (totalGuests > tour.maxGroupSize) {
      toast.error(`This tour has a maximum of ${tour.maxGroupSize} guests.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingReference = `HS-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();

      await createBooking({
        userId: user.clerkId,
        userEmail: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        tourId: tour._id,
        tourName: tour.title,
        startDate,
        endDate: new Date(startDate + (tour.duration * 24 * 60 * 60 * 1000)).getTime(),
        guests: { adults, children, infants: 0 },
        specialRequests,
        totalPrice,
        depositAmount,
        paymentStatus: "pending",
        bookingStatus: "pending",
        bookingReference,
        emailNotifications,
        whatsappUpdates,
      });
      toast.success("Booking successful! You will be redirected shortly.");
      router.push("/tours/thank-you");
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <Card className="p-6 bg-secondary border-border">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-secondary border-border shadow-lg">
      <CardHeader className="p-0 mb-4">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold text-primary">${tour.discountPrice || tour.price}</span>
          <span className="text-muted-foreground">/ person</span>
        </div>
        {tour.discountPrice && (
          <span className="text-muted-foreground line-through">
            ${tour.price}
          </span>
        )}
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="tour-date" className="font-semibold text-white">Tour Date</Label>
            <Select
              value={startDate?.toString()}
              onValueChange={(value) => setStartDate(Number(value))}
              required
            >
              <SelectTrigger id="tour-date">
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {tour.startDates?.map((ts: number) => (
                  <SelectItem key={ts} value={ts.toString()}>
                    {format(new Date(ts), "EEE, MMM d, yyyy")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-semibold text-white">Guests</Label>
            <Card className="bg-background-light p-4 mt-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Adults</p>
                  <p className="text-sm text-muted-foreground">Age 13+</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button type="button" size="icon" variant="outline" onClick={() => handleGuestChange('adults', 'decrement')} disabled={adults <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-4 text-center font-bold">{adults}</span>
                  <Button type="button" size="icon" variant="outline" onClick={() => handleGuestChange('adults', 'increment')} disabled={totalGuests >= tour.maxGroupSize}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Children</p>
                  <p className="text-sm text-muted-foreground">Age 2-12</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button type="button" size="icon" variant="outline" onClick={() => handleGuestChange('children', 'decrement')} disabled={children <= 0}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-4 text-center font-bold">{children}</span>
                  <Button type="button" size="icon" variant="outline" onClick={() => handleGuestChange('children', 'increment')} disabled={totalGuests >= tour.maxGroupSize}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
           <div>
            <Label htmlFor="special-requests" className="font-semibold text-white">Special Requests</Label>
            <Textarea
              id="special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any dietary requirements, accessibility needs, or other requests..."
              className="mt-2"
            />
          </div>
          <div>
            <Label className="font-semibold text-white">Communication</Label>
            <Card className="bg-background-light p-4 mt-2 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="font-normal">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp-updates" className="font-normal">WhatsApp Updates</Label>
                <Switch
                  id="whatsapp-updates"
                  checked={whatsappUpdates}
                  onCheckedChange={setWhatsappUpdates}
                />
              </div>
            </Card>
          </div>
        </div>

        <Separator />
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">${pricePerAdult.toFixed(2)} x {adults} adults</span>
            <span className="font-semibold">${(pricePerAdult * adults).toFixed(2)}</span>
          </div>
          {children > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">${pricePerChild.toFixed(2)} x {children} children</span>
              <span className="font-semibold">${(pricePerChild * children).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service fee</span>
            <span className="font-semibold">${serviceFee.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          You will pay a 30% deposit of <strong>${depositAmount.toFixed(2)}</strong> to confirm your booking.
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
          {isSubmitting ? "Processing..." : "Continue to Payment"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">You won't be charged yet</p>
      </form>
    </Card>
  );
} 
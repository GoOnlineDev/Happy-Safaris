"use client";

import { Suspense } from "react";
import { TourDetails } from "./TourDetails";
import { BookingForm } from "@/components/booking/BookingForm";

interface TourPageClientProps {
  tour: any; // Replace with proper tour type when available
}

export function TourPageClient({ tour }: TourPageClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#e3b261]"></div>
        </div>
      }>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tour Details */}
          <div className="lg:col-span-2">
            <TourDetails tour={tour} />
          </div>
          
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold text-[#e3b261] mb-6">Book This Tour</h2>
              <BookingForm tour={tour} />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
} 
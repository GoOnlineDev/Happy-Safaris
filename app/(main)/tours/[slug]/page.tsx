"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Calendar, AlertTriangle, ChevronRight, ChevronLeft as CarouselLeft, ChevronRight as CarouselRight } from "lucide-react";
import { useState } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";

export default function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const tour = useQuery(api.tours.getBySlug, { slug });
  const [currentImage, setCurrentImage] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const { user, isLoading: userLoading } = useUser();

  if (tour === undefined) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-[#1a2421]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#e3b261] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white">Loading tour</h2>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-[#e3b261] mb-4">Tour Not Found</h1>
        <p className="text-white mb-6">The tour you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Carousel navigation handlers
  const handlePrev = () => {
    setCurrentImage((prev) =>
      prev === 0 ? (tour.imageUrl?.length || 1) - 1 : prev - 1
    );
  };
  const handleNext = () => {
    setCurrentImage((prev) =>
      prev === (tour.imageUrl?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleBookNow = () => {
    if (!user) {
      // Redirect to sign-in, with return path to this tour page
      router.push(`/login?redirectUrl=/tours/${slug}`);
      return;
    }
    setShowBooking((prev) => !prev);
  };

  return (
    <main className="min-h-screen bg-[#1a2421] pb-20">
      {/* Hero Section with Image Carousel */}
      <section className="relative h-[40vh] md:h-[60vh] flex items-center overflow-hidden mb-8">
        {tour.imageUrl && tour.imageUrl.length > 0 ? (
          <>
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={tour.imageUrl[currentImage]}
                alt={tour.title}
                fill
                className="object-cover brightness-75 transition-all duration-300"
                priority
              />
            </div>
            {tour.imageUrl.length > 1 && (
              <>
                {/* Carousel Controls */}
                <button
                  aria-label="Previous image"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 md:p-3 transition"
                >
                  <CarouselLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="Next image"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 md:p-3 transition"
                >
                  <CarouselRight className="h-5 w-5" />
                </button>
                {/* Dots for mobile/desktop */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {tour.imageUrl.map((img: string, idx: number) => (
                    <button
                      key={img}
                      className={`w-2.5 h-2.5 rounded-full border border-white transition bg-white/60 ${idx === currentImage ? "bg-[#e3b261] border-[#e3b261]" : ""}`}
                      onClick={() => setCurrentImage(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-[#2a3431]" />
        )}
        <div className="absolute top-4 left-4 z-30">
          <Button
            onClick={() => router.push("/tours")}
            variant="ghost"
            className="bg-[#1a2421]/50 text-white hover:bg-[#1a2421]/70"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </section>

      {/* Tour Info Section (moved below images, above Book Now) */}
      <section className="container mx-auto px-4 mb-6">
        <div className="max-w-3xl bg-[#232c29] rounded-lg shadow-lg p-6 md:p-8 mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {tour.title}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-4 gap-2">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-[#e3b261] mr-2" />
              <span className="text-white text-xl drop-shadow-md">{tour.country}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-[#e3b261] mr-2" />
              <span className="text-white text-base md:text-lg">Start Dates: {tour.startDates && tour.startDates.length > 0 ? tour.startDates.map((ts: number) => format(new Date(ts), "PPP")).join(", ") : "TBA"}</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#e3b261] font-semibold mr-2">Price:</span>
              <span className="text-white text-base md:text-lg">{formatCurrency(tour.price)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#e3b261] font-semibold mr-2">Duration:</span>
              <span className="text-white text-base md:text-lg">{tour.duration} days</span>
            </div>
          </div>
          <p className="text-xl text-white/90 max-w-2xl drop-shadow-md">
            {tour.description}
          </p>
        </div>
      </section>

      {/* Book Now Button */}
      <div className="container mx-auto px-4 mb-8 flex justify-center">
        <Button
          className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] text-lg px-8 py-3"
          onClick={handleBookNow}
        >
          {showBooking ? "Hide Booking" : "Book Now"}
        </Button>
      </div>

      {/* Booking Form (shown when Book Now is clicked) */}
      {showBooking && user && (
        <div className="container mx-auto px-4 mb-8 max-w-2xl">
          <BookingForm tour={tour} onSuccess={() => router.push("/tours/thank-you")} />
        </div>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Itinerary */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#e3b261]" />
                Itinerary
              </h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-4">
                {tour.itinerary.map((item, idx) => (
                  <li key={idx} className="mb-2">
                    <div className="font-semibold text-[#e3b261]">Day {item.day}: {item.title}</div>
                    <div className="ml-2 text-white">{item.description}</div>
                    <div className="ml-2 text-sm text-gray-400">Accommodation: {item.accommodation} | Meals: {item.meals}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Included */}
          {tour.included && tour.included.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Included</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                {tour.included.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Excluded */}
          {tour.excluded && tour.excluded.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Excluded</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                {tour.excluded.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
} 
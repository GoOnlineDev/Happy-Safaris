"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  Check,
  X,
  Star,
  Coffee,
  Bed,
  Utensils,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { BookingForm } from "@/components/booking/BookingForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

interface TourDetailsProps {
  tour: any; // Replace with proper tour type when available
}

export function TourDetails({ tour }: TourDetailsProps) {
  const router = useRouter();
  const { user } = useUser();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleBookNow = () => {
    if (!user) {
      // Redirect to login with redirect back to this tour
      router.push(`/login?redirect=/tours/${tour.slug}`);
      return;
    }
    setShowBooking(true);
  };

  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        {tour.imageUrl && tour.imageUrl.length > 0 ? (
          <Image
            src={tour.imageUrl[0]}
            alt={tour.title}
            fill
            className="object-cover brightness-50"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#2a3431] flex items-center justify-center">
            <p className="text-gray-400">No Image Available</p>
          </div>
        )}
        <motion.div 
          className="container relative z-10 mx-auto px-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/tours">
            <Button variant="ghost" className="text-white hover:text-[#e3b261] mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tours
            </Button>
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {tour.title}
          </h1>
          <div className="flex items-center space-x-4 text-white/90">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-[#e3b261]" />
              <span>{tour.location}, {tour.country}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-[#e3b261]" />
              <span>{tour.duration} Days</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-[#e3b261]" />
              <span>Max {tour.maxGroupSize} People</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tour Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                  <Image
                    src={tour.imageUrl[selectedImage]}
                    alt={tour.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {tour.imageUrl.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden ${
                        selectedImage === index ? "ring-2 ring-[#e3b261]" : ""
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${tour.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tour Info */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl font-bold text-[#e3b261] mb-2">{tour.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {tour.location}, {tour.country}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {tour.duration} days
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Max {tour.maxGroupSize} people
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(tour.price)}
                    {tour.discountPrice && (
                      <span className="text-lg text-gray-400 line-through ml-2">
                        {formatCurrency(tour.discountPrice)}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[#e3b261] border-[#e3b261]">
                    {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
                  </Badge>
                  {tour.featured && (
                    <Badge className="bg-[#e3b261] text-[#1a2421]">
                      Featured Tour
                    </Badge>
                  )}
                </div>

                <div className="prose prose-invert max-w-none">
                  <p>{tour.description}</p>
                </div>

                {/* Itinerary */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">Tour Itinerary</h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((day: any, index: number) => (
                      <motion.div
                        key={index}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#2a3431] rounded-lg p-6 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-[#e3b261]">
                            Day {day.day}: {day.title}
                          </h3>
                        </div>
                        <p className="text-gray-300">{day.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Bed className="h-4 w-4 text-[#e3b261]" />
                            <span>{day.accommodation}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Utensils className="h-4 w-4 text-[#e3b261]" />
                            <span>{day.meals}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Included & Excluded */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      What's Included
                    </h2>
                    <ul className="space-y-2">
                      {tour.included.map((item: string, index: number) => (
                        <motion.li
                          key={index}
                          initial="hidden"
                          animate="visible"
                          variants={fadeIn}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center text-gray-300"
                        >
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <X className="h-5 w-5 mr-2 text-red-500" />
                      Not Included
                    </h2>
                    <ul className="space-y-2">
                      {tour.excluded.map((item: string, index: number) => (
                        <motion.li
                          key={index}
                          initial="hidden"
                          animate="visible"
                          variants={fadeIn}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center text-gray-300"
                        >
                          <X className="h-4 w-4 mr-2 text-red-500" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Available Dates */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">Available Dates</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tour.startDates.map((date: number, index: number) => (
                      <motion.div
                        key={index}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#2a3431] rounded-lg p-4 flex items-center justify-center"
                      >
                        <Calendar className="h-4 w-4 mr-2 text-[#e3b261]" />
                        <span className="text-gray-300">{formatDate(date)}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-[#2a3431] p-6 rounded-lg sticky top-24"
              >
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-[#e3b261]">
                      ${tour.price}
                    </span>
                    {tour.discountPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ${tour.discountPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mt-2">per person</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="h-4 w-4 text-[#e3b261]" />
                    <span>{tour.duration} Days</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users className="h-4 w-4 text-[#e3b261]" />
                    <span>Max {tour.maxGroupSize} People</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MapPin className="h-4 w-4 text-[#e3b261]" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="h-4 w-4 text-[#e3b261]" />
                    <span>{tour.startDates?.length || 0} Available Dates</span>
                  </div>
                </div>
                <Button
                  onClick={handleBookNow}
                  className="w-full bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] text-lg py-4"
                >
                  Book Now
                </Button>
              </motion.div>

              {/* Included & Excluded */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-[#2a3431] p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold text-white mb-4">What's Included</h3>
                <ul className="space-y-2 mb-6">
                  {tour.included.map((item: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-400">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold text-white mb-4">What's Not Included</h3>
                <ul className="space-y-2">
                  {tour.excluded.map((item: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-400">
                      <X className="h-4 w-4 text-red-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Tour Dates */}
              {tour.startDates && tour.startDates.length > 0 && (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-[#2a3431] p-6 rounded-lg"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Available Dates</h3>
                  <div className="space-y-2">
                    {tour.startDates.map((date: number, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-400">
                        <Calendar className="h-4 w-4 text-[#e3b261]" />
                        <span>{new Date(date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        {/* Sticky Book Now button for mobile */}
        <div className="fixed bottom-0 left-0 w-full z-40 bg-[#1a2421] p-4 border-t border-[#232b27] flex lg:hidden">
          <Button
            onClick={handleBookNow}
            className="w-full bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] text-lg py-4"
          >
            Book Now
          </Button>
        </div>
        {/* Booking Modal */}
        <Dialog open={showBooking} onOpenChange={setShowBooking}>
          <DialogContent className="max-w-lg w-full mx-auto max-h-[90vh] overflow-y-auto p-4 md:p-6 z-50">
            <div className="flex justify-between items-center mb-4">
              <DialogTitle>Book This Tour</DialogTitle>
              <button onClick={() => setShowBooking(false)} className="text-gray-400 hover:text-[#e3b261] text-2xl" aria-label="Close">&times;</button>
            </div>
            <div className="space-y-4">
              <BookingForm tour={tour} />
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#2a3431]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-[#e3b261]">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-gray-400 mb-8">
              Contact us to book this tour or customize it to your preferences.
            </p>
            <Link href="/contact">
              <Button className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
                Contact Us
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 
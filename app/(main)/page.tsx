"use client";

import Image from "next/image";
import { ChevronRight, MapPin, Calendar, Users, Binoculars, Leaf, Shield, Star, Clock, Heart, Award, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const [email, setEmail] = useState("");
  
  // Fetch featured destinations from Convex
  const featuredDestinations = useQuery(api.destinations.getFeatured);
  
  // Fetch all destinations as fallback if no featured ones exist
  const allDestinations = useQuery(api.destinations.getAll);
  
  // Fetch featured tours from Convex
  const featuredTours = useQuery(api.tours.getFeatured);

  // Get destinations to display - either featured ones or fallback to first 3 from all destinations
  const destinationsToDisplay = 
    featuredDestinations?.length > 0 
      ? featuredDestinations.slice(0, 3) 
      : allDestinations?.slice(0, 3) || [];

  const isLoadingDestinations = featuredDestinations === undefined || (featuredDestinations.length === 0 && allDestinations === undefined);
  
  const toursToDisplay = featuredTours?.slice(0, 3) || [];
  const isLoadingTours = featuredTours === undefined;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <main className="min-h-screen px-2 sm:px-4">
      <Hero />
      
      {/* Featured Destinations */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-[#1a2421] to-[#2a3431]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-4xl font-bold text-[#e3b261] mb-4">Popular Destinations</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover the most sought-after safari destinations in Uganda, each offering unique wildlife experiences and breathtaking landscapes.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
          >
            {!isLoadingDestinations && destinationsToDisplay.length > 0 ? (
              destinationsToDisplay.map((destination, index) => (
                <motion.div key={destination._id} variants={fadeIn}>
                  <Link href={`/destinations/${destination.slug}`}>
                    <Card className="overflow-hidden bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-all duration-300 group">
                      <div className="relative h-48 sm:h-56 md:h-64">
                        <Image
                          src={destination.imageUrl[0] || "https://images.unsplash.com/photo-1516426122078-c23e76319801"}
                          alt={destination.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          priority={index === 0}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          quality={75}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">{destination.name}</h3>
                          <p className="text-sm sm:text-base text-gray-300 line-clamp-2">{destination.description.slice(0, 100)}...</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              // Skeleton loaders while data is loading
              Array(3).fill(0).map((_, index) => (
                <motion.div key={`skeleton-${index}`} variants={fadeIn}>
                  <Card className="overflow-hidden bg-[#1a2421] border-[#3a4441]">
                    <div className="relative h-64">
                      <Skeleton className="h-full w-full" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <Skeleton className="h-6 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-[#2a3431] to-[#1a2421]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-4xl font-bold text-[#e3b261] mb-4">Featured Tours</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore our most popular safari packages, designed to give you the ultimate African experience
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
          >
            {!isLoadingTours && toursToDisplay.length > 0 ? (
              toursToDisplay.map((tour, index) => (
                <motion.div key={tour._id} variants={fadeIn}>
                  <Card className="overflow-hidden bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-all duration-300">
                    <div className="relative h-48 sm:h-56 md:h-64">
                      <Image
                        src={tour.imageUrl[0] || "https://images.unsplash.com/photo-1516426122078-c23e76319801"}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        priority={index === 0}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={75}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-white">{tour.title}</h3>
                        <div className="flex items-center text-[#e3b261]">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{tour.duration} Days</span>
                        </div>
                      </div>
                      <p className="text-gray-400 mb-4">{tour.description.slice(0, 100)}...</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#e3b261]">From ${tour.price}</span>
                        <Link href={`/tours/${tour.slug}`}>
                          <Button variant="outline" className="border-[#e3b261] text-[#e3b261] hover:bg-[#e3b261] hover:text-[#1a2421]">
                            Learn More
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              // Skeleton loaders while data is loading
              Array(3).fill(0).map((_, index) => (
                <motion.div key={`skeleton-${index}`} variants={fadeIn}>
                  <Card className="overflow-hidden bg-[#1a2421] border-[#3a4441]">
                    <div className="relative h-64">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-9 w-32" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <section className="py-12 md:py-20 bg-[#1a2421]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center px-2"
          >
            <h2 className="text-4xl font-bold text-[#e3b261] mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for exclusive safari deals and wildlife updates
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-3 bg-[#2a3431] border border-[#3a4441] rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#e3b261] flex-1 max-w-md"
                required
              />
              <Button type="submit" className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] px-8">
                Subscribe
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-[#1a2421] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e3b261' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
        </div>

        <div className="container mx-auto px-2 sm:px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center px-2"
          >
            <h2 className="text-4xl font-bold text-[#e3b261] mb-6">Ready to Start Your Safari Adventure?</h2>
            <p className="text-gray-300 mb-8">
              Join us for an unforgettable journey through Uganda's most spectacular destinations
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              <Link href="/tours">
                <Button size="lg" className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] text-lg px-8">
                  Explore Tours
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-[#e3b261] text-[#e3b261] hover:bg-[#e3b261]/10 text-lg px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
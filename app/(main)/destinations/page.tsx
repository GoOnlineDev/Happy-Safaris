"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Trees, ChevronRight, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

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

export default function DestinationsPage() {
  // Fetch all destinations from Convex
  const destinations = useQuery(api.destinations.getAll) || [];
  const isLoading = destinations.length === 0;

  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center overflow-hidden pt-24">
        <Image
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
          alt="Uganda Destinations"
          fill
          className="object-cover brightness-50"
          priority
        />
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
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Destinations
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Explore Uganda's most spectacular wildlife havens and natural wonders.
          </p>
        </motion.div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 bg-gradient-to-b from-[#1a2421] to-[#2a3431]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#e3b261]" />
              <span className="ml-2 text-white">Loading destinations...</span>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {destinations.map((destination) => (
                <motion.div key={destination._id} variants={fadeIn}>
                  <Card className="overflow-hidden bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors h-full flex flex-col">
                    <div className="relative h-48">
                      {destination.imageUrl && destination.imageUrl.length > 0 ? (
                        <Image
                          src={destination.imageUrl[0]}
                          alt={destination.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#2a3431] flex items-center justify-center">
                          <p className="text-gray-400">No Image</p>
                        </div>
                      )}
                      {destination.featured && (
                        <div className="absolute top-2 left-2 bg-[#e3b261] text-[#1a2421] text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="h-4 w-4 text-[#e3b261]" />
                        <span className="text-gray-400">{destination.country}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white">{destination.name}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">{destination.description}</p>
                      
                      <div className="space-y-2 mb-6 mt-auto">
                        <h4 className="text-[#e3b261] font-medium">Key Attractions:</h4>
                        <ul className="grid grid-cols-1 gap-1">
                          {destination.attractions && destination.attractions.slice(0, 3).map((attraction, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-gray-400 text-sm">
                              <Trees className="h-3 w-3 text-[#e3b261] flex-shrink-0" />
                              <span className="truncate">{attraction}</span>
                            </li>
                          ))}
                          {destination.attractions && destination.attractions.length > 3 && (
                            <li className="text-[#e3b261] text-sm mt-1">
                              +{destination.attractions.length - 3} more...
                            </li>
                          )}
                        </ul>
                      </div>

                      <Link href={`/destinations/${destination.slug}`} className="mt-auto">
                        <Button className="w-full bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
                          Explore
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {destinations.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No destinations found.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20 bg-[#1a2421]">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-[#e3b261]">
              Capture the Moment
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Each destination offers unique photo opportunities and unforgettable moments.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {destinations.slice(0, 4).map((destination, index) => (
              <motion.div
                key={destination._id || index}
                variants={fadeIn}
                className="relative h-48 group overflow-hidden rounded-lg"
              >
                {destination.imageUrl && destination.imageUrl.length > 0 ? (
                  <Image
                    src={destination.imageUrl[0]}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2a3431] flex items-center justify-center">
                    <p className="text-gray-400">No Image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </motion.div>
            ))}
            
            {/* If we don't have enough destinations yet, fill with placeholders */}
            {Array.from({ length: Math.max(0, 4 - destinations.length) }).map((_, index) => (
              <motion.div
                key={`placeholder-${index}`}
                variants={fadeIn}
                className="relative h-48 group overflow-hidden rounded-lg bg-[#2a3431]"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-[#3a4441]" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
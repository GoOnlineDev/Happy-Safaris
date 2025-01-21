"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Trees, ChevronRight } from "lucide-react";

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

const destinations = [
  {
    name: "Bwindi Impenetrable Forest",
    description: "Home to half of the world's remaining mountain gorillas, this UNESCO World Heritage site offers unforgettable wildlife encounters.",
    highlights: ["Mountain Gorillas", "Bird Watching", "Nature Walks"],
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    location: "Southwestern Uganda"
  },
  {
    name: "Queen Elizabeth National Park",
    description: "Uganda's most popular safari destination, featuring tree-climbing lions and diverse wildlife across savannah and wetland habitats.",
    highlights: ["Tree Climbing Lions", "Boat Safaris", "Chimpanzee Tracking"],
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    location: "Western Uganda"
  },
  {
    name: "Murchison Falls",
    description: "Experience the world's most powerful waterfall and explore Uganda's largest national park teeming with wildlife.",
    highlights: ["Waterfall Views", "Game Drives", "Nile River Cruises"],
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    location: "Northwestern Uganda"
  },
  // Add more destinations as needed
];

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center overflow-hidden">
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
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {destinations.map((destination, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="overflow-hidden bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors">
                  <div className="relative h-64">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <MapPin className="h-4 w-4 text-[#e3b261]" />
                      <span className="text-gray-400">{destination.location}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{destination.name}</h3>
                    <p className="text-gray-400 mb-4">{destination.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <h4 className="text-[#e3b261] font-medium">Highlights:</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {destination.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-gray-400">
                            <Trees className="h-4 w-4 text-[#e3b261]" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
                      Explore Tours
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
            {[1, 2, 3, 4].map((_, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="relative h-48 group overflow-hidden rounded-lg"
              >
                <Image
                  src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
                  alt={`Gallery Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
"use client";

import Image from "next/image";
import { ChevronRight, MapPin, Calendar, Users, Binoculars, Leaf, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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
  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
          alt="Bwindi Impenetrable Forest"
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
            Welcome to <br />Happy Safaris
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Experience Uganda's breathtaking wildlife and culture with the most trusted name in African safari adventures.
          </p>
          <motion.div 
            className="bg-[#1a2421]/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-4xl border border-[#3a4441]"
            variants={fadeIn}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e3b261]">Destination</label>
                <div className="flex items-center space-x-2 border-b-2 border-[#3a4441] pb-2">
                  <MapPin className="h-5 w-5 text-[#e3b261]" />
                  <input 
                    type="text"
                    placeholder="Where to?"
                    className="bg-transparent outline-none flex-1 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e3b261]">Check In</label>
                <div className="flex items-center space-x-2 border-b-2 border-[#3a4441] pb-2">
                  <Calendar className="h-5 w-5 text-[#e3b261]" />
                  <input 
                    type="date"
                    className="bg-transparent outline-none flex-1 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e3b261]">Travelers</label>
                <div className="flex items-center space-x-2 border-b-2 border-[#3a4441] pb-2">
                  <Users className="h-5 w-5 text-[#e3b261]" />
                  <select className="bg-transparent outline-none flex-1 text-white">
                    <option className="bg-[#1a2421]">1 Person</option>
                    <option className="bg-[#1a2421]">2 People</option>
                    <option className="bg-[#1a2421]">3 People</option>
                    <option className="bg-[#1a2421]">4+ People</option>
                  </select>
                </div>
              </div>
              <Button className="w-full h-12 mt-auto bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
                Search Tours
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Animated wildlife silhouettes */}
        <motion.div 
          className="absolute bottom-0 right-0 w-full h-32 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Image
            src="/wildlife-silhouette.png"
            alt="Wildlife Silhouette"
            fill
            className="object-contain object-bottom"
          />
        </motion.div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-gradient-to-b from-[#1a2421] to-[#2a3431]">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 text-[#e3b261]"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Featured Experiences
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Gorilla Trekking Adventure",
                description: "Trek through Bwindi Impenetrable Forest to encounter mountain gorillas in their natural habitat.",
                price: "From $700",
                image: "https://images.unsplash.com/photo-1516426122078-c23e76319801"
              },
              {
                title: "Big Five Safari",
                description: "Experience Uganda's diverse wildlife in Queen Elizabeth National Park.",
                price: "From $500",
                image: "https://images.unsplash.com/photo-1516426122078-c23e76319801"
              },
              {
                title: "Cultural Heritage Tour",
                description: "Immerse yourself in the rich traditions of Uganda's ancient kingdoms.",
                price: "From $300",
                image: "https://images.unsplash.com/photo-1516426122078-c23e76319801"
              }
            ].map((item, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="overflow-hidden bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors">
                  <div className="relative h-64">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                    <p className="text-gray-400 mb-4">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#e3b261]">{item.price}</span>
                      <Button variant="outline" className="border-[#e3b261] text-[#e3b261] hover:bg-[#e3b261] hover:text-[#1a2421]">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
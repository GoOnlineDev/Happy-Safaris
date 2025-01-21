"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, MapPin, ChevronRight } from "lucide-react";

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

const tours = [
  {
    title: "Gorilla Trekking Adventure",
    location: "Bwindi Impenetrable Forest",
    duration: "3 Days",
    groupSize: "1-8 People",
    price: "From $700",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    description: "Trek through the misty forests of Bwindi to encounter endangered mountain gorillas in their natural habitat."
  },
  {
    title: "Queen Elizabeth Safari",
    location: "Queen Elizabeth National Park",
    duration: "4 Days",
    groupSize: "1-6 People",
    price: "From $500",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    description: "Experience Uganda's diverse wildlife including lions, elephants, and hippos in this iconic national park."
  },
  {
    title: "Murchison Falls Explorer",
    location: "Murchison Falls National Park",
    duration: "5 Days",
    groupSize: "1-8 People",
    price: "From $600",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    description: "Discover the world's most powerful waterfall and enjoy game drives in Uganda's largest national park."
  },
  // Add more tours as needed
];

export default function ToursPage() {
  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
          alt="Uganda Safari Tours"
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
            Safari Tours
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Embark on unforgettable wildlife adventures across Uganda's most spectacular national parks.
          </p>
        </motion.div>
      </section>

      {/* Tours Grid */}
      <section className="py-20 bg-gradient-to-b from-[#1a2421] to-[#2a3431]">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tours.map((tour, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="overflow-hidden bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors">
                  <div className="relative h-64">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">{tour.title}</h3>
                    <p className="text-gray-400 mb-4">{tour.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <MapPin className="h-4 w-4 text-[#e3b261]" />
                        <span>{tour.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Clock className="h-4 w-4 text-[#e3b261]" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="h-4 w-4 text-[#e3b261]" />
                        <span>{tour.groupSize}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Calendar className="h-4 w-4 text-[#e3b261]" />
                        <span>Available</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#e3b261]">{tour.price}</span>
                      <Button className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#1a2421]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-[#e3b261]">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-gray-400 mb-8">
              Let us create a custom safari experience tailored to your preferences and schedule.
            </p>
            <Button className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
              Contact Us
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
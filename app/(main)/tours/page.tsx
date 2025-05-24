"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function ToursPage() {
  const router = useRouter();
  // Fetch all tours from Convex
  const tours = useQuery(api.tours.getAll) || [];
  const isLoading = tours.length === 0;
  
  // Increment view count mutation
  const incrementViewCount = useMutation(api.tours.incrementViewCount);

  // Handle view details click
  const handleViewDetails = async (tourId: string, slug: string) => {
    try {
      await incrementViewCount({ id: tourId as any });
      router.push(`/tours/${slug}`);
    } catch (error) {
      console.error("Error incrementing view count:", error);
      // Still navigate even if view count fails
      router.push(`/tours/${slug}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center overflow-hidden pt-24">
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
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#e3b261]" />
              <span className="ml-2 text-white">Loading tours...</span>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {tours.map((tour) => (
                <motion.div key={tour._id} variants={fadeIn}>
                  <Card className="overflow-hidden bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors">
                    <div className="relative h-64">
                      {tour.imageUrl && tour.imageUrl.length > 0 ? (
                        <Image
                          src={tour.imageUrl[0]}
                          alt={tour.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#2a3431] flex items-center justify-center">
                          <p className="text-gray-400">No Image</p>
                        </div>
                      )}
                      {tour.featured && (
                        <div className="absolute top-2 left-2 bg-[#e3b261] text-[#1a2421] text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="h-4 w-4 text-[#e3b261]" />
                        <span className="text-gray-400">{tour.location}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white">{tour.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">{tour.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-6">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="h-4 w-4 text-[#e3b261]" />
                          <span>{tour.duration} Days</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Users className="h-4 w-4 text-[#e3b261]" />
                          <span>Max {tour.maxGroupSize} People</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Calendar className="h-4 w-4 text-[#e3b261]" />
                          <span>{tour.startDates?.length || 0} Dates</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <MapPin className="h-4 w-4 text-[#e3b261]" />
                          <span>{tour.country}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold text-[#e3b261]">
                            ${tour.price}
                          </span>
                          {tour.discountPrice && (
                            <span className="ml-2 text-sm text-gray-400 line-through">
                              ${tour.discountPrice}
                            </span>
                          )}
                        </div>
                        <Button 
                          className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
                          onClick={() => handleViewDetails(tour._id, tour.slug)}
                        >
                          View Details
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {tours.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No tours found.</p>
                </div>
              )}
            </motion.div>
          )}
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
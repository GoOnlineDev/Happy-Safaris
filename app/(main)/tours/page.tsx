"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { TourCard } from "@/components/TourCard";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
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
      staggerChildren: 0.1
    }
  }
};

export default function ToursPage() {
  const tours = useQuery(api.tours.getAll);
  const isLoading = tours === undefined;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1521401410292-3a1f8c16f73a"
          alt="Giraffes on a safari tour"
          fill
          className="object-cover brightness-50"
          sizes="100vw"
          priority
        />
        <motion.div 
          className="relative z-10 container mx-auto px-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 font-serif">
            Our Safari Tours
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Embark on unforgettable wildlife adventures across Uganda's most spectacular national parks.
          </p>
        </motion.div>
      </div>

      {/* Tours Grid */}
      <Section className="bg-gradient-to-b from-background to-secondary">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden bg-secondary border-border p-4">
                <Skeleton className="h-56 w-full mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))
          ) : (
            tours.map((tour) => (
              <motion.div key={tour._id} variants={fadeIn}>
                <TourCard tour={tour} />
              </motion.div>
            ))
          )}
          
          {!isLoading && tours?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No tours found at the moment.</p>
            </div>
          )}
        </motion.div>
      </Section>

      {/* Call to Action */}
      <Section className="bg-secondary">
        <div className="text-center">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary font-serif">
              Design Your Dream Safari
            </h2>
            <p className="text-muted-foreground mb-8">
              Can't find the perfect itinerary? Let us create a custom safari experience tailored to your unique preferences and schedule.
            </p>
            <Link href="/contact">
              <Button size="lg">
                Contact Us For a Custom Tour
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Section>
    </main>
  );
}
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Trees, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Section } from "@/components/Section";
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
      staggerChildren: 0.15
    }
  }
};

export default function DestinationsPage() {
  const destinations = useQuery(api.destinations.getAll);
  const isLoading = destinations === undefined;

  const allImages = destinations?.flatMap(d => d.imageUrl).slice(0, 4) || [];
  while (allImages.length < 4) {
    allImages.push("https://images.unsplash.com/photo-1516426122078-c23e76319801?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1473625247510-8ceb1760943f"
          alt="Breathtaking landscape of Uganda"
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
            Our Destinations
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Explore Uganda's most spectacular wildlife havens and natural wonders.
          </p>
        </motion.div>
      </div>

      {/* Destinations Grid */}
      <Section className="bg-gradient-to-b from-background to-secondary">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden bg-secondary border-border p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))
          ) : (
            destinations.map((destination) => (
              <motion.div key={destination._id} variants={fadeIn}>
                <Card className="overflow-hidden bg-secondary border-border hover:border-primary transition-colors h-full flex flex-col group">
                  <div className="relative h-48">
                    <Image
                      src={destination.imageUrl[0] || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {destination.featured && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center space-x-2 mb-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{destination.country}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{destination.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">{destination.description}</p>
                    
                    <div className="space-y-2 mb-6 mt-auto">
                      <h4 className="font-semibold text-primary">Key Attractions:</h4>
                      <ul className="grid grid-cols-1 gap-1 text-sm">
                        {destination.attractions.slice(0, 3).map((attraction, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-muted-foreground">
                            <Trees className="h-4 w-4 text-primary/80 flex-shrink-0" />
                            <span className="truncate">{attraction}</span>
                          </li>
                        ))}
                        {destination.attractions.length > 3 && (
                          <li className="text-primary/90 font-medium mt-1">
                            +{destination.attractions.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>

                    <Link href={`/destinations/${destination.slug}`} className="mt-auto">
                      <Button className="w-full">
                        Explore Destination
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
          
          {!isLoading && destinations?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No destinations found at the moment.</p>
            </div>
          )}
        </motion.div>
      </Section>

      {/* Photo Gallery Section */}
      <Section className="bg-secondary">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary font-serif">
            Capture the Moment
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each destination offers unique photo opportunities and unforgettable moments.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {allImages.map((imageSrc, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="relative h-48 sm:h-64 group overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={imageSrc}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </main>
  );
}
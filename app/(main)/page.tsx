"use client";

import Image from "next/image";
import { ChevronRight, MapPin, Clock, Send } from "lucide-react";
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
import { Section } from "@/components/Section";
import { toast } from "sonner";

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const featuredDestinations = useQuery(api.destinations.getFeatured);
  const allDestinations = useQuery(api.destinations.getAll);
  const featuredTours = useQuery(api.tours.getFeatured);

  const destinationsToDisplay = 
    featuredDestinations?.length > 0 
      ? featuredDestinations.slice(0, 3) 
      : allDestinations?.slice(0, 3) || [];

  const isLoadingDestinations = featuredDestinations === undefined || (featuredDestinations.length === 0 && allDestinations === undefined);
  
  const toursToDisplay = featuredTours?.slice(0, 3) || [];
  const isLoadingTours = featuredTours === undefined;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsSubscribing(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      toast.success("Thank you for subscribing!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Hero />
      
      <Section id="destinations" className="bg-gradient-to-b from-secondary to-background-light">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Popular Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the most sought-after safari destinations in Uganda, each offering unique wildlife experiences and breathtaking landscapes.
          </p>
        </div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {isLoadingDestinations ? (
            Array(3).fill(0).map((_, index) => (
              <motion.div key={`skeleton-dest-${index}`} variants={fadeIn}>
                <Card className="overflow-hidden bg-secondary border-border">
                  <Skeleton className="h-64 w-full" />
                </Card>
              </motion.div>
            ))
          ) : (
            destinationsToDisplay.map((destination, index) => (
              <motion.div key={destination._id} variants={fadeIn}>
                <Link href={`/destinations/${destination.slug}`}>
                  <Card className="overflow-hidden bg-secondary border-border hover:border-primary transition-all duration-300 group h-full">
                    <div className="relative h-64 bg-gradient-to-br from-secondary via-background to-secondary">
                      {destination.imageUrl[0] && (
                        <Image
                          src={destination.imageUrl[0]}
                          alt={destination.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 2}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          quality={75}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">{destination.name}</h3>
                        <p className="text-sm text-gray-300 line-clamp-2">{destination.description.slice(0, 100)}...</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </Section>

      <Section id="tours" className="bg-gradient-to-b from-background-light to-secondary">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Featured Tours</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular safari packages, designed to give you the ultimate African experience
          </p>
        </div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {isLoadingTours ? (
            Array(3).fill(0).map((_, index) => (
              <motion.div key={`skeleton-tour-${index}`} variants={fadeIn}>
                <Card className="overflow-hidden bg-secondary border-border p-6">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-9 w-32" />
                </Card>
              </motion.div>
            ))
          ) : (
            toursToDisplay.map((tour, index) => (
              <motion.div key={tour._id} variants={fadeIn}>
                <Card className="overflow-hidden bg-secondary border-border hover:border-primary transition-all duration-300 group h-full flex flex-col">
                  <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-secondary via-background to-secondary">
                    {tour.imageUrl[0] && (
                      <Image
                        src={tour.imageUrl[0]}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 2}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={75}
                      />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white">{tour.title}</h3>
                      <div className="flex items-center text-primary whitespace-nowrap">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{tour.duration} Days</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 flex-grow">{tour.description.slice(0, 100)}...</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg font-bold text-primary">From ${tour.price}</span>
                      <Link href={`/tours/${tour.slug}`}>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-secondary">
                          Learn More
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </Section>

      <Testimonials />

      <Section id="newsletter" className="bg-secondary">
        <div className="max-w-4xl mx-auto text-center px-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for exclusive safari deals and wildlife updates
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <label htmlFor="email-subscribe" className="sr-only">Email address</label>
            <input
              id="email-subscribe"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-3 bg-background-light border-border rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary h-12 flex-1 w-full sm:w-auto max-w-md"
              required
              aria-label="Email for newsletter"
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-secondary px-8 h-12 w-full sm:w-auto" disabled={isSubscribing}>
              {isSubscribing ? "Subscribing..." : "Subscribe"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </Section>
    </main>
  );
}
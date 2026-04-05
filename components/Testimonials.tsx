"use client";

import { motion } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";
import Image from "next/image";
import { Section } from "./Section";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Adventure Enthusiast",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote: "The gorilla trekking experience was absolutely incredible. Our guide was knowledgeable and made us feel safe throughout the journey.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Wildlife Photographer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    quote: "Happy African Safaris provided an exceptional photography tour. The wildlife sightings exceeded my expectations.",
    rating: 5
  },
  {
    name: "Emma Williams",
    role: "Family Traveler",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    quote: "A perfect family adventure! The team went above and beyond to ensure our children had an educational and fun experience.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <Section id="testimonials" className="bg-gradient-to-b from-secondary to-background-dark relative overflow-hidden">
      {/* Subtle sparkle decoration */}
      <div className="absolute top-8 left-8 opacity-20 pointer-events-none" aria-hidden="true">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
      <div className="absolute bottom-8 right-8 opacity-20 pointer-events-none" aria-hidden="true">
        <Sparkles className="h-6 w-6 text-primary animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-serif section-title shimmer-text inline-block">What Our Guests Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-6 text-sm sm:text-base">
          Read about the experiences of travelers who have explored Uganda with us
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.12 }}
          >
            <Card className="p-5 sm:p-6 bg-background-light border-border h-full flex flex-col relative overflow-hidden group hover:border-primary/40 transition-colors duration-300">
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 to-transparent rounded-inherit" />
              
              <Quote className="absolute top-5 right-5 h-7 w-7 text-primary/15" />

              <div className="flex items-center mb-4 z-10 gap-3">
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full overflow-hidden border-2 border-primary/40">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-3 z-10 gap-0.5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-primary fill-primary" />
                ))}
              </div>

              <p className="text-gray-300 italic flex-grow z-10 text-sm sm:text-base leading-relaxed">"{testimonial.quote}"</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

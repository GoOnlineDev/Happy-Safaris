"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
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
    <Section id="testimonials" className="bg-secondary">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">What Our Guests Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Read about the experiences of travelers who have explored Uganda with us
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-background-light border-border h-full flex flex-col relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
              
              <div className="flex items-center mb-6 z-10">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-primary/50">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{testimonial.name}</h3>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4 z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                ))}
              </div>

              <p className="text-gray-300 italic flex-grow z-10">"{testimonial.quote}"</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
} 
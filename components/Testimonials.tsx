"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

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
    <section className="py-20 bg-[#1a2421]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#e3b261] mb-4">What Our Guests Say</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Read about the experiences of travelers who have explored Uganda with us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-[#2a3431] rounded-lg p-6 relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-[#e3b261] opacity-20" />
              
              <div className="flex items-center mb-6">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-[#e3b261] fill-[#e3b261]" />
                ))}
              </div>

              <p className="text-gray-300 italic">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 
"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Binoculars, Leaf, Heart, Shield } from "lucide-react";
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

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
          alt="Uganda Wildlife"
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
            Wild at Heart
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Connecting adventurers with Uganda's untamed wilderness and 
            majestic wildlife through responsible safari experiences.
          </p>
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

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-b from-[#1a2421] to-[#2a3431]">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-6 text-[#e3b261]">Our Safari Story</h2>
              <p className="text-gray-300 mb-4">
                For over a decade, we've been guiding wildlife enthusiasts through 
                Uganda's most pristine national parks. Our journey began with a profound 
                respect for nature and a commitment to conservation.
              </p>
              <p className="text-gray-300">
                Today, we're proud to offer immersive safari experiences that bring you 
                face-to-face with mountain gorillas, track lions across savannah plains, 
                and witness the incredible diversity of Uganda's wildlife.
              </p>
            </motion.div>
            <motion.div 
              className="relative h-[400px]"
              variants={fadeIn}
            >
              <Image
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
                alt="Safari Experience"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#2a3431]">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-[#e3b261]"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            The Wild Advantage
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
                icon: Binoculars,
                title: "Expert Tracking",
                description: "Our experienced guides know exactly where to find Uganda's most magnificent wildlife."
              },
              {
                icon: Leaf,
                title: "Eco-Conscious",
                description: "We practice and promote sustainable tourism that protects wildlife habitats."
              },
              {
                icon: Shield,
                title: "Safe Adventures",
                description: "Your safety is our priority while getting you close to nature's wonders."
              }
            ].map((item, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="p-6 bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors">
                  <item.icon className="h-12 w-12 text-[#e3b261] mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-[#1a2421]">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-[#e3b261]"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Wildlife Conservation Values
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <motion.div variants={fadeIn}>
                <h3 className="text-xl font-semibold mb-2 text-white">Protection</h3>
                <p className="text-gray-400">
                  Supporting anti-poaching initiatives and wildlife conservation projects 
                  across Uganda's national parks.
                </p>
              </motion.div>
              <motion.div variants={fadeIn}>
                <h3 className="text-xl font-semibold mb-2 text-white">Education</h3>
                <p className="text-gray-400">
                  Raising awareness about wildlife conservation and promoting 
                  responsible tourism practices.
                </p>
              </motion.div>
            </div>
            <div className="space-y-6">
              <motion.div variants={fadeIn}>
                <h3 className="text-xl font-semibold mb-2 text-white">Community</h3>
                <p className="text-gray-400">
                  Partnering with local communities to create sustainable 
                  wildlife conservation programs.
                </p>
              </motion.div>
              <motion.div variants={fadeIn}>
                <h3 className="text-xl font-semibold mb-2 text-white">Research</h3>
                <p className="text-gray-400">
                  Supporting wildlife research initiatives to better understand and 
                  protect Uganda's diverse species.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 
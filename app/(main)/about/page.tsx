"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Binoculars, Leaf, Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
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
      staggerChildren: 0.2
    }
  }
};

const ICON_MAP: Record<string, any> = {
  Binoculars,
  Leaf,
  Shield,
  Heart,
};

export default function AboutPage() {
  const about = useQuery(api.about.getAboutContent);
  const loading = about === undefined;

  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[48vh] sm:h-[60vh] flex items-center overflow-hidden">
        {loading ? (
          <Skeleton className="absolute inset-0 w-full h-full" />
        ) : (
          about?.heroImageUrl && (
            <Image
              src={about.heroImageUrl}
              alt="Uganda Wildlife"
              fill
              className="object-cover brightness-50"
              priority
            />
          )
        )}
        <motion.div 
          className="container relative z-10 mx-auto px-2 sm:px-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6">
            {loading ? <Skeleton className="h-10 w-2/3 mx-auto" /> : about?.heroHeading || "Wild at Heart"}
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl">
            {loading ? <Skeleton className="h-6 w-1/2 mx-auto" /> : about?.heroSubheading || "Connecting adventurers with Uganda's untamed wilderness and majestic wildlife through responsible safari experiences."}
          </p>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-[#1a2421] to-[#2a3431]">
        <div className="container mx-auto px-2 sm:px-4">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12 items-center"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#e3b261]">
                {loading ? <Skeleton className="h-8 w-1/2" /> : about?.storyHeading || "Our Safari Story"}
              </h2>
              <p className="text-gray-300 mb-2 sm:mb-4">
                {loading ? <Skeleton className="h-5 w-2/3" /> : about?.storyContent?.split("\n")[0]}
              </p>
              <p className="text-gray-300">
                {loading ? <Skeleton className="h-5 w-2/3" /> : about?.storyContent?.split("\n").slice(1).join("\n")}
              </p>
            </motion.div>
            <motion.div 
              className="relative h-56 sm:h-80 md:h-[400px]"
              variants={fadeIn}
            >
              {loading ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : (
                about?.storyImageUrl && (
                  <Image
                    src={about.storyImageUrl}
                    alt="Safari Experience"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                  />
                )
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-20 bg-[#2a3431]">
        <div className="container mx-auto px-2 sm:px-4">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 text-[#e3b261]"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            The Wild Advantage
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {loading
              ? Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))
              : about?.advantages?.map((item: any, index: number) => {
                  const Icon = ICON_MAP[item.icon] || Binoculars;
                  return (
                    <motion.div key={index} variants={fadeIn}>
                      <Card className="p-4 sm:p-6 bg-[#1a2421] border-[#3a4441] hover:border-[#e3b261] transition-colors rounded-xl shadow-md">
                        <Icon className="h-12 w-12 text-[#e3b261] mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">{item.title}</h3>
                        <p className="text-gray-400">{item.description}</p>
                      </Card>
                    </motion.div>
                  );
                })}
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-12 md:py-20 bg-[#1a2421]">
        <div className="container mx-auto px-2 sm:px-4">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 text-[#e3b261]"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Wildlife Conservation Values
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {loading
              ? Array(2).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))
              : about?.values?.map((val: any, idx: number) => (
                  <div key={idx} className="space-y-6">
                    <motion.div variants={fadeIn}>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">{val.title}</h3>
                      <p className="text-gray-400">{val.description}</p>
                    </motion.div>
                  </div>
                ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
} 
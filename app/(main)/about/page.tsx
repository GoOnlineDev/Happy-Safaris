"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Binoculars, Leaf, Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/Section";

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

const ICON_MAP: Record<string, React.ElementType> = {
  Binoculars,
  Leaf,
  Shield,
  Heart,
};

export default function AboutPage() {
  const about = useQuery(api.about.getAboutContent);
  const loading = about === undefined;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center text-center overflow-hidden">
        {loading ? (
          <Skeleton className="absolute inset-0 w-full h-full" />
        ) : (
          about?.heroImageUrl && (
            <Image
              src={about.heroImageUrl}
              alt="Uganda Wildlife"
              fill
              className="object-cover brightness-50"
              sizes="100vw"
              priority
            />
          )
        )}
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 font-serif">
            {loading ? <Skeleton className="h-14 w-2/3 mx-auto" /> : about?.heroHeading || "Wild at Heart"}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            {loading ? <Skeleton className="h-7 w-1/2 mx-auto" /> : about?.heroSubheading || "Connecting adventurers with Uganda's untamed wilderness and majestic wildlife through responsible safari experiences."}
          </p>
        </motion.div>
      </div>

      {/* Our Story Section */}
      <Section className="bg-gradient-to-b from-background to-secondary">
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
        >
          <motion.div variants={fadeIn}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-primary font-serif">
              {loading ? <Skeleton className="h-10 w-1/2" /> : about?.storyHeading || "Our Safari Story"}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              {loading ? (
                <>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-full" />
                </>
              ) : (
                about?.storyContent?.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              )}
            </div>
          </motion.div>
          <motion.div 
            className="relative h-64 sm:h-80 md:h-[450px] rounded-lg overflow-hidden"
            variants={fadeIn}
          >
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              about?.storyImageUrl && (
                <Image
                  src={about.storyImageUrl}
                  alt="Safari Experience"
                  fill
                  className="object-cover shadow-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )
            )}
          </motion.div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section className="bg-secondary">
        <h2 
          className="text-3xl sm:text-4xl font-bold text-center mb-10 md:mb-16 text-primary font-serif"
        >
          The Wild Advantage
        </h2>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {loading
            ? Array(3).fill(0).map((_, i) => (
                <Card key={i} className="p-6 bg-background-light border-border">
                  <Skeleton className="h-12 w-12 mb-4 rounded-full" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </Card>
              ))
            : about?.advantages?.map((item: any, index: number) => {
                const Icon = ICON_MAP[item.icon] || Binoculars;
                return (
                  <motion.div key={index} variants={fadeIn}>
                    <Card className="p-6 bg-background-light border-border hover:border-primary transition-colors rounded-xl shadow-md h-full">
                      <Icon className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
        </motion.div>
      </Section>

      {/* Our Values Section */}
      <Section className="bg-gradient-to-b from-secondary to-background">
        <h2 
          className="text-3xl sm:text-4xl font-bold text-center mb-10 md:mb-16 text-primary font-serif"
        >
          Our Core Values
        </h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {loading
            ? Array(2).fill(0).map((_, i) => (
                <Card key={i} className="p-6 bg-background-light border-border">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </Card>
              ))
            : about?.values?.map((val: any, idx: number) => (
                <motion.div key={idx} variants={fadeIn}>
                  <Card className="p-6 bg-background-light border-border h-full">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">{val.title}</h3>
                    <p className="text-muted-foreground">{val.description}</p>
                  </Card>
                </motion.div>
              ))}
        </motion.div>
      </Section>
    </main>
  );
} 
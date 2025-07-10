"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
}

export function Section({ children, className, id, noPadding = false }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={cn(
        !noPadding && "py-16 sm:py-20 md:py-24",
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeIn}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </motion.section>
  );
} 
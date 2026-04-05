"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
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
        !noPadding && "py-14 sm:py-18 md:py-24",
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto">
        {children}
      </div>
    </motion.section>
  );
}

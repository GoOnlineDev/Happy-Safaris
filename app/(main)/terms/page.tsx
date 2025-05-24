"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Scroll, Shield, Scale, Users } from "lucide-react";

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

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
          alt="Terms and Conditions"
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
            Terms & Conditions
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Please read these terms carefully before using our services
          </p>
        </motion.div>
      </section>

      {/* Key Points Section */}
      <section className="py-20 bg-gradient-to-b from-[#1a2421] to-[#2a3431]">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Scroll,
                title: "Agreement",
                description: "By accessing our services, you agree to be bound by these terms"
              },
              {
                icon: Shield,
                title: "Privacy",
                description: "We protect your personal information according to our privacy policy"
              },
              {
                icon: Scale,
                title: "Compliance",
                description: "All activities must comply with local and international laws"
              },
              {
                icon: Users,
                title: "Community",
                description: "Respect for wildlife and local communities is paramount"
              }
            ].map((item, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="p-6 bg-[#1a2421] border-[#3a4441] h-full">
                  <item.icon className="h-8 w-8 text-[#e3b261] mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-[#1a2421]">
        <div className="container mx-auto px-4">
          <motion.div
            className="prose prose-invert max-w-none"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn} className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-[#e3b261]">1. Booking and Payment</h2>
              <div className="space-y-4 text-gray-400">
                <p>1.1. All bookings are subject to availability and confirmation by Uganda Travel.</p>
                <p>1.2. A deposit of 30% is required to secure your booking.</p>
                <p>1.3. Full payment must be received 30 days prior to the tour start date.</p>
                <p>1.4. Payments are accepted in USD through our secure payment system.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-[#e3b261]">2. Cancellation Policy</h2>
              <div className="space-y-4 text-gray-400">
                <p>2.1. Cancellations made 30+ days before the tour: 90% refund</p>
                <p>2.2. Cancellations made 15-29 days before the tour: 50% refund</p>
                <p>2.3. Cancellations made 0-14 days before the tour: No refund</p>
                <p>2.4. All cancellations must be made in writing.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-[#e3b261]">3. Tour Conduct</h2>
              <div className="space-y-4 text-gray-400">
                <p>3.1. Participants must follow guide instructions at all times.</p>
                <p>3.2. Respect for wildlife and their habitats is mandatory.</p>
                <p>3.3. Photography guidelines must be strictly followed.</p>
                <p>3.4. Interaction with wildlife is regulated by park authorities.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-[#e3b261]">4. Liability</h2>
              <div className="space-y-4 text-gray-400">
                <p>4.1. Uganda Travel is not liable for circumstances beyond our control.</p>
                <p>4.2. Travel insurance is mandatory for all participants.</p>
                <p>4.3. Participants must declare any medical conditions before the tour.</p>
                <p>4.4. We reserve the right to modify itineraries for safety reasons.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-6 text-[#e3b261]">5. Privacy & Data</h2>
              <div className="space-y-4 text-gray-400">
                <p>5.1. We collect and process data in accordance with our Privacy Policy.</p>
                <p>5.2. Your information is never shared with unauthorized third parties.</p>
                <p>5.3. We maintain secure records of all transactions.</p>
                <p>5.4. You may request access to your personal data at any time.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-[#2a3431] to-[#1a2421]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-[#e3b261]">Questions About Our Terms?</h2>
            <p className="text-gray-400 mb-8">
              If you have any questions about our terms and conditions, please don't hesitate to contact us.
            </p>
            <p className="text-gray-400">
              Email: <a href="mailto:legal@ugandatravel.com" className="text-[#e3b261] hover:underline">legal@ugandatravel.com</a>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 
"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

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

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
          alt="Contact Us"
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
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Get in touch with our safari experts to plan your perfect Uganda adventure.
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-[#1a2421] to-[#2a3431]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="p-6 bg-[#1a2421] border-[#3a4441]">
                <h2 className="text-2xl font-bold mb-6 text-[#e3b261]">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e3b261]">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 bg-transparent border border-[#3a4441] rounded-md text-white focus:border-[#e3b261] outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e3b261]">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 bg-transparent border border-[#3a4441] rounded-md text-white focus:border-[#e3b261] outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e3b261]">Message</label>
                    <textarea
                      rows={4}
                      className="w-full p-2 bg-transparent border border-[#3a4441] rounded-md text-white focus:border-[#e3b261] outline-none transition-colors"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <Button className="w-full bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.div variants={fadeIn}>
                <h2 className="text-2xl font-bold mb-6 text-[#e3b261]">Get in Touch</h2>
                <p className="text-gray-400 mb-8">
                  Our team of safari experts is here to help you plan your perfect wildlife adventure 
                  in Uganda. Feel free to reach out through any of the following channels:
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="space-y-6">
                {[
                  {
                    icon: Phone,
                    title: "Phone",
                    content: "+256 123 456 789",
                    link: "tel:+256123456789"
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    content: "safari@uganda-adventures.com",
                    link: "mailto:safari@uganda-adventures.com"
                  },
                  {
                    icon: MapPin,
                    title: "Location",
                    content: "Kampala, Uganda",
                    link: "#"
                  },
                  {
                    icon: Clock,
                    title: "Business Hours",
                    content: "Mon - Fri: 9:00 AM - 6:00 PM",
                    link: "#"
                  }
                ].map((item, index) => (
                  <a 
                    key={index}
                    href={item.link}
                    className="flex items-start space-x-4 p-4 rounded-lg border border-[#3a4441] hover:border-[#e3b261] transition-colors"
                  >
                    <item.icon className="h-6 w-6 text-[#e3b261]" />
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-gray-400">{item.content}</p>
                    </div>
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-[#1a2421]">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19036281522!2d32.5472412!3d0.3475964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc0f9d74b39b%3A0x71a41c61c8de8fc0!2sKampala%2C%20Uganda!5e0!3m2!1sen!2s!4v1647891215811!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
} 
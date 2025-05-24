"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch contact information dynamically
  const contactInfo = useQuery(api.contact.getContactInfo);
  const isLoadingContactInfo = contactInfo === undefined;

  // Mutation to save message to Convex
  const createMessage = useMutation(api.contact.createMessage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      // Save message to Convex
      await createMessage({
        name: formData.name,
        email: formData.email,
        subject: `New message from ${formData.name}`, // Use dynamic subject here too
        message: formData.message,
      });

      // Send email notification
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: formData.email, // Using email as 'from'
          subject: `New message from ${formData.name}`, // Dynamic subject
          message: formData.message,
          // name is included in the Convex mutation call, not needed here
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Your message has been sent and saved!'); // Update success message
        setFormData({ name: '', email: '', message: '' }); // Clear form on success
      } else {
        // If email sending fails, the message is still saved in Convex
        toast.warning('Message saved, but email notification failed.'); // Use warning for email failure
      }
    } catch (error: any) {
      console.error('Error submitting form or saving message:', error);
      // Provide a more general error if either Convex save or email send fails
      toast.error('Failed to send message or save it.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1a2421]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden pt-24">
        <Image
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
          alt="Contact Us"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div 
          className="container relative z-10 mx-auto px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Get in touch with our safari experts to plan your perfect Uganda adventure.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-[#1a2421] to-[#2a3431]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="p-6 bg-[#1a2421] border-[#3a4441]">
                <h2 className="text-2xl font-bold mb-6 text-[#e3b261]">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e3b261]">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 bg-transparent border border-[#3a4441] rounded-md text-white focus:border-[#e3b261] outline-none transition-colors"
                      placeholder="Your name"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e3b261]">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 bg-transparent border border-[#3a4441] rounded-md text-white focus:border-[#e3b261] outline-none transition-colors"
                      placeholder="your@email.com"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#e3b261]">Message</label>
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-2 bg-transparent border border-[#3a4441] rounded-md text-white focus:border-[#e3b261] outline-none transition-colors"
                      placeholder="How can we help you?"
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6 text-[#e3b261]">Get in Touch</h2>
                <p className="text-gray-400 mb-8">
                  Our team of safari experts is here to help you plan your perfect wildlife adventure 
                  in Uganda. Feel free to reach out through any of the following channels:
                </p>
              </div>

              <div className="space-y-6">
                {isLoadingContactInfo ? (
                  <div className="flex items-center space-x-2 text-gray-400">
                     <Loader2 className="h-4 w-4 animate-spin text-[#e3b261]" />
                     <span>Loading contact info...</span>
                  </div>
                ) : contactInfo ? (
                  <> 
                  {
                    [
                      {
                        icon: Phone,
                        title: "Phone",
                        content: contactInfo.phone,
                        link: `tel:${contactInfo.phone.replace(/\s/g, '')}` // Generate tel link
                      },
                      {
                        icon: Mail,
                        title: "Email",
                        content: contactInfo.email,
                        link: `mailto:${contactInfo.email}` // Generate mailto link
                      },
                      {
                        icon: MapPin,
                        title: "Location",
                        content: contactInfo.location,
                        link: "#" // You might want a map link here later
                      },
                      {
                        icon: Clock,
                        title: "Business Hours",
                        content: contactInfo.businessHours,
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
                    ))
                   }
                   </>
                ) : (
                   <div className="text-gray-400">Contact information not available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-[#1a2421]">
        <div className="container mx-auto px-4">
          <div
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
          </div>
        </div>
      </section>
    </main>
  );
} 
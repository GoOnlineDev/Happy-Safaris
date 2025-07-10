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
import { Section } from "@/components/Section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const contactInfo = useQuery(api.contact.getContactInfo);
  const isLoadingContactInfo = contactInfo === undefined;

  const createMessage = useMutation(api.contact.createMessage);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required.';
      case 'email':
        if (!value.trim()) return 'Email is required.';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid.';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required.';
        if (value.trim().length < 10) return 'Message must be at least 10 characters long.';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setLoading(true);

    try {
      await createMessage({
        name: formData.name,
        email: formData.email,
        subject: `New message from ${formData.name}`,
        message: formData.message,
      });

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: formData.email,
          subject: `New message from ${formData.name}`,
          message: formData.message,
        }),
      });

      if (response.ok) {
        toast.success('Your message has been sent successfully!');
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
      } else {
        toast.warning('Your message was saved, but we failed to send an email notification.');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801"
          alt="Contact Us"
          fill
          className="object-cover brightness-50"
          sizes="100vw"
          priority
        />
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 font-serif">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Get in touch with our safari experts to plan your perfect Uganda adventure.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <Section className="bg-gradient-to-b from-background to-secondary">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8 bg-secondary border-border">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary font-serif">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-primary">Name</label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.name}
                    placeholder="Your name"
                    disabled={loading}
                    required
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.email}
                    placeholder="your@email.com"
                    disabled={loading}
                    required
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-primary">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.message}
                    placeholder="Tell us about your dream safari..."
                    disabled={loading}
                    required
                  />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                </div>
                <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <Send className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary font-serif">Contact Information</h2>
            <Card className="p-6 bg-secondary border-border">
              {isLoadingContactInfo ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-2/3" />
                </div>
              ) : (
                <ul className="space-y-4 text-muted-foreground">
                  {contactInfo?.phone &&
                    <li className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-primary" />
                      <span>{contactInfo.phone}</span>
                    </li>
                  }
                  {contactInfo?.email &&
                    <li className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-primary" />
                      <span>{contactInfo.email}</span>
                    </li>
                  }
                  {contactInfo?.address &&
                    <li className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-primary mt-1" />
                      <span>{contactInfo.address}</span>
                    </li>
                  }
                </ul>
              )}
            </Card>
            <h3 className="text-xl font-bold text-primary font-serif">Business Hours</h3>
            <Card className="p-6 bg-secondary border-border">
              {isLoadingContactInfo ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ) : (
                <ul className="space-y-2 text-muted-foreground">
                  {contactInfo?.workingHours?.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-primary" />
                      <span><strong>{item.days}:</strong> {item.hours}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </Section>
    </main>
  );
} 
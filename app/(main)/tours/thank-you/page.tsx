"use client";

import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center pt-24">
      <Section>
        <div className="text-center max-w-2xl mx-auto">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 font-serif">
            Thank You for Your Booking!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your safari adventure is just around the corner. We have received your booking details and will be in touch shortly with a confirmation and further information. Please check your email inbox (and spam folder, just in case).
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline">Back to Homepage</Button>
            </Link>
            <Link href="/my-bookings">
              <Button>View My Bookings</Button>
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
} 
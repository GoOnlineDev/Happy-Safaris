"use client";

import { Section } from "@/components/Section";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-24">
      <div className="relative h-[40vh] flex items-center justify-center text-center overflow-hidden bg-secondary">
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 font-serif">
            Terms & Conditions
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Please read our terms and conditions carefully before booking a tour.
          </p>
        </div>
      </div>
      <Section>
        <div className="prose prose-invert prose-lg max-w-4xl mx-auto">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Happy Safaris. These are the terms and conditions governing your access to and use of the website happysafaris.com and its related sub-domains, sites, services and tools.
          </p>

          <h2>2. Booking and Payment</h2>
          <p>
            A deposit of 30% of the total tour price is required to secure a booking. The remaining balance is due 60 days before the tour departure date. If a booking is made within 60 days of the departure date, full payment is required.
          </p>
          
          <h2>3. Cancellations and Refunds</h2>
          <p>
            Cancellations must be made in writing. The following cancellation fees apply:
          </p>
          <ul>
            <li>60 days or more before departure: Loss of deposit.</li>
            <li>30-59 days before departure: 50% of the total tour price.</li>
            <li>Less than 30 days before departure: 100% of the total tour price.</li>
          </ul>

          <h2>4. Changes to Itinerary</h2>
          <p>
            While we endeavor to operate all tours as described, we reserve the right to change the itinerary due to unforeseen circumstances such as weather, road conditions, or political situations. We will provide a suitable alternative of similar standard.
          </p>

          <h2>5. Travel Insurance</h2>
          <p>
            Comprehensive travel insurance is mandatory for all our clients. Your insurance must provide cover against personal accident, death, medical expenses, and emergency repatriation.
          </p>
        </div>
      </Section>
    </main>
  );
} 
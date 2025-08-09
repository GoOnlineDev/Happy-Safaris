"use client";

import Navigation from "@/components/Navigation";
import { Footer } from "@/components/portal/Footer";
import type { Metadata } from 'next';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-secondary antialiased">
        {children}
      </main>
      <Footer />
    </>
  );
}
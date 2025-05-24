"use client";

import Navigation from "@/components/Navigation";
import { Footer } from "@/components/portal/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background antialiased">
        {children}
      </main>
      <Footer />
    </>
  );
}
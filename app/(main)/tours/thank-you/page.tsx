"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Smile } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-[#1a2421] px-4">
      <div className="bg-[#232c29] rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <Smile className="mx-auto mb-4 h-12 w-12 text-[#e3b261]" />
        <h1 className="text-3xl font-bold text-white mb-4">Thank You for Booking!</h1>
        <p className="text-lg text-gray-300 mb-6">
          We appreciate your booking with <span className="text-[#e3b261] font-semibold">Happy African Safaris</span>.<br />
          Our support team will reach out to you soon with more details.
        </p>
        <Button
          className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] w-full"
          onClick={() => router.push("/")}
        >
          Back to Home
        </Button>
      </div>
    </main>
  );
} 
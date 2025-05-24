"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Footer() {
  // Fetch contact information dynamically
  const contactInfo = useQuery(api.contact.getContactInfo);

  return (
    <footer className="bg-[#1a2421] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#e3b261] mb-4">Happy African Safaris</h3>
            <p className="text-gray-400">
              Your premier guide to experiencing the best of Uganda's wildlife and cultural adventures.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#e3b261] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/destinations" className="hover:text-[#e3b261]">Destinations</Link></li>
              <li><Link href="/tours" className="hover:text-[#e3b261]">Tours</Link></li>
              <li><Link href="/about" className="hover:text-[#e3b261]">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#e3b261]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#e3b261] mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              {contactInfo ? (
                <>
                  <li>{contactInfo.location}</li>
                  <li>Phone: {contactInfo.phone}</li>
                  <li>Email: {contactInfo.email}</li>
                  {/* Business hours might also be added if desired */}
                </>
              ) : (
                <>
                   <li>Loading contact info...</li>
                   {/* Optionally keep static placeholders or remove */}
                   <li>Kampala, Uganda</li>
                   <li>Phone: +256 123 456 789</li>
                   <li>Email: info@ugandatravel.com</li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#e3b261] mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/terms" className="hover:text-[#e3b261]">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-[#e3b261]">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#3a4441] text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Happy African Safaris Tours and Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 
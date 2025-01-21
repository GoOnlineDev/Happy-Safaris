import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Lora } from 'next/font/google';
import { AuthContextProvider } from "@/contexts/AuthContext";
import Navigation from '@/components/Navigation';
import { Toaster } from 'sonner';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

export const metadata: Metadata = {
  title: 'Happy Safaris - Tours and Travels in Uganda',
  description: 'Experience the magic of Uganda with Happy Safaris Tours and Travels. From gorilla trekking to wildlife safaris, we offer unforgettable African adventures.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lora.variable} font-serif`}>
        <AuthContextProvider>
          <Navigation />
          <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
            {children}
          </main>
          <footer className="bg-[#1a2421] text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#e3b261] mb-4">Happy Safaris</h3>
                  <p className="text-gray-400">
                    Your premier guide to experiencing the best of Uganda's wildlife and cultural adventures.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#e3b261] mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/destinations" className="hover:text-[#e3b261]">Destinations</a></li>
                    <li><a href="/tours" className="hover:text-[#e3b261]">Tours</a></li>
                    <li><a href="/about" className="hover:text-[#e3b261]">About Us</a></li>
                    <li><a href="/contact" className="hover:text-[#e3b261]">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#e3b261] mb-4">Contact</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li>Kampala, Uganda</li>
                    <li>Phone: +256 123 456 789</li>
                    <li>Email: info@ugandatravel.com</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#e3b261] mb-4">Legal</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/terms" className="hover:text-[#e3b261]">Terms & Conditions</a></li>
                    <li><a href="/privacy" className="hover:text-[#e3b261]">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-[#3a4441] text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Happy Safaris Tours and Travels. All rights reserved.</p>
              </div>
            </div>
          </footer>
          <Toaster />
        </AuthContextProvider>
      </body>
    </html>
  );
}
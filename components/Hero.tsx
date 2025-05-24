"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useClerkAuth";
import Link from "next/link";
import { Compass, Calendar, Users, MapPin, ChevronRight, Binoculars, Leaf, Shield } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { ConvexHttpClient } from "convex/browser";

export default function Hero() {
  const { user } = useAuth();
  const heroContent = useQuery(api.hero.getHeroContent);
  const [searchParams, setSearchParams] = useState({
    destination: "",
    checkIn: "",
    travelers: "1"
  });
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Fallbacks if not set in DB
  const backgroundImageUrl = heroContent?.backgroundImageUrl || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
  const mainHeading = heroContent?.mainHeading || "Experience the Magic of";
  const highlightedText = heroContent?.highlightedText || "African Safaris";
  const subheading = heroContent?.subheading || "Discover breathtaking landscapes, encounter majestic wildlife, and create unforgettable memories";

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);
    setSearchError(null);
    setShowResults(false);
    setSearchResults(null);
    try {
      const q = searchParams.destination.trim();
      if (!q) {
        setSearchResults([]);
        setShowResults(true);
        setSearchLoading(false);
        return;
      }
      // Initialize ConvexHttpClient in the browser only
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      // Search both tours and destinations
      const [tours, destinations] = await Promise.all([
        convex.query(api.tours.searchTours, { query: q }),
        convex.query(api.destinations.searchDestinations, { query: q })
      ]);
      // Mark type for rendering
      const results = [
        ...(tours?.map((t: any) => ({ ...t, _type: "tour" })) || []),
        ...(destinations?.map((d: any) => ({ ...d, _type: "destination" })) || [])
      ];
      setSearchResults(results);
      setShowResults(true);
    } catch (err) {
      setSearchError("Something went wrong. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto pt-28 md:pt-40 px-2"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {mainHeading} <br />
              <span className="text-[#e3b261]">{highlightedText}</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {subheading}
            </p>
          </motion.div>
          
          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSearch}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 mb-12 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e3b261]">Destination</label>
                <div className="flex items-center space-x-2 border-b-2 border-[#3a4441] pb-2">
                  <MapPin className="h-5 w-5 text-[#e3b261]" />
                  <input 
                    type="text"
                    placeholder="Where to?"
                    className="bg-transparent outline-none flex-1 text-white placeholder:text-gray-400"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e3b261]">Check In</label>
                <div className="flex items-center space-x-2 border-b-2 border-[#3a4441] pb-2">
                  <Calendar className="h-5 w-5 text-[#e3b261]" />
                  <input 
                    type="date"
                    className="bg-transparent outline-none flex-1 text-white"
                    value={searchParams.checkIn}
                    onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e3b261]">Travelers</label>
                <div className="flex items-center space-x-2 border-b-2 border-[#3a4441] pb-2">
                  <Users className="h-5 w-5 text-[#e3b261]" />
                  <select 
                    className="bg-transparent outline-none flex-1 text-white"
                    value={searchParams.travelers}
                    onChange={(e) => setSearchParams({ ...searchParams, travelers: e.target.value })}
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4+ People</option>
                  </select>
                </div>
              </div>
              <Button 
                type="submit"
                className="w-full h-12 mt-auto bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
              >
                {searchLoading ? "Searching..." : "Search Tours"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute left-0 right-0 mt-2 bg-[#1a2421] border border-[#3a4441] rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
                {searchError && (
                  <div className="p-4 text-red-500 text-center">{searchError}</div>
                )}
                {searchResults && searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <Link
                      key={item._id}
                      href={item._type === "tour" ? `/tours/${item.slug}` : `/destinations/${item.slug}`}
                      className="flex items-center gap-4 p-4 hover:bg-[#2a3431] transition-colors border-b border-[#3a4441] last:border-b-0"
                      onClick={() => setShowResults(false)}
                    >
                      <div className="w-14 h-14 relative flex-shrink-0">
                        <Image
                          src={item.imageUrl?.[0] || "https://images.unsplash.com/photo-1516426122078-c23e76319801"}
                          alt={item.title || item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-semibold">{item.title || item.name}</div>
                        <div className="text-xs text-[#e3b261]">{item._type === "tour" ? "Tour" : "Destination"}</div>
                        <div className="text-gray-400 text-xs truncate">{item.country}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-gray-400 text-center">No results found.</div>
                )}
              </div>
            )}
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {user ? (
              <Link href="/portal">
                <Button size="lg" className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] text-lg px-8">
                  Go to Portal
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] text-lg px-8">
                    Start Your Journey
                  </Button>
                </Link>
                <Link href="/tours">
                  <Button size="lg" variant="outline" className="border-[#e3b261] text-[#e3b261] hover:bg-[#e3b261]/10 text-lg px-8">
                    Explore Tours
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <Compass className="h-10 w-10 text-[#e3b261] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Expert Guides</h3>
              <p className="text-gray-300 text-sm">Professional guides with years of experience</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <Calendar className="h-10 w-10 text-[#e3b261] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Flexible Booking</h3>
              <p className="text-gray-300 text-sm">Easy booking and cancellation options</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <Users className="h-10 w-10 text-[#e3b261] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Small Groups</h3>
              <p className="text-gray-300 text-sm">Intimate experiences with limited group sizes</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <MapPin className="h-10 w-10 text-[#e3b261] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Premium Locations</h3>
              <p className="text-gray-300 text-sm">Access to exclusive safari destinations</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[#e3b261] rounded-full p-2">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="w-1.5 h-1.5 bg-[#e3b261] rounded-full mx-auto"
          />
        </div>
      </motion.div>
    </div>
  );
} 
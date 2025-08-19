"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useClerkAuth";
import Link from "next/link";
import { Compass, Calendar, Users, MapPin, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { ConvexHttpClient } from "convex/browser";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  // Content from Convex (no fallback images)
  const backgroundImageUrl = heroContent?.backgroundImageUrl;
  const mainHeading = heroContent?.mainHeading || "Experience the Magic of";
  const highlightedText = heroContent?.highlightedText || "African Safaris";
  const subheading = heroContent?.subheading || "Discover breathtaking landscapes, encounter majestic wildlife, and create unforgettable memories";
  const ctaText = heroContent?.ctaText || "Explore Tours";
  const ctaLink = heroContent?.ctaLink || "/tours";

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
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      const [tours, destinations] = await Promise.all([
        convex.query(api.tours.searchTours, { query: q }),
        convex.query(api.destinations.searchDestinations, { query: q })
      ]);
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
    <div className="relative min-h-screen md:h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
      {backgroundImageUrl && (
        <Image
          src={backgroundImageUrl}
          alt="Hero background"
          fill
          className="object-cover"
          priority
          quality={80}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto pt-24 md:pt-32 px-2 pb-8 md:pb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-serif">
              {mainHeading} <br />
              <span className="text-primary">{highlightedText}</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {subheading}
            </p>
          </motion.div>
          
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSearch}
            className="bg-white/15 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl border border-white/30 mb-8 md:mb-12 relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-primary">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  <Input 
                    type="text"
                    placeholder="Where to?"
                    className="bg-background/50 border-border text-white pl-10"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-primary">Check In</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  <Input 
                    type="date"
                    className="bg-background/50 border-border text-white pl-10"
                    value={searchParams.checkIn}
                    onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-primary">Travelers</label>
                <Select
                  onValueChange={(value) => setSearchParams({ ...searchParams, travelers: value })}
                  defaultValue={searchParams.travelers}
                >
                  <SelectTrigger className="bg-background/50 border-border text-white">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    <SelectValue placeholder="Select travelers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Person</SelectItem>
                    <SelectItem value="2">2 People</SelectItem>
                    <SelectItem value="3">3 People</SelectItem>
                    <SelectItem value="4">4+ People</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={searchLoading}
              >
                {searchLoading ? "Searching..." : "Search"}
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {showResults && (
              <div className="absolute left-0 right-0 mt-2 bg-secondary/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto">
                {searchError && (
                  <div className="p-4 text-destructive text-center">{searchError}</div>
                )}
                {searchResults && searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <Link
                      key={item._id}
                      href={item._type === "tour" ? `/tours/${item.slug}` : `/destinations/${item.slug}`}
                      className="flex items-center gap-4 p-4 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                      onClick={() => setShowResults(false)}
                    >
                      <div className="w-14 h-14 relative flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-md">
                        {item.imageUrl?.[0] && (
                          <Image
                            src={item.imageUrl[0]}
                            alt={item.title || item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-semibold">{item.title || item.name}</div>
                        <div className="text-xs text-primary">{item._type === "tour" ? "Tour" : "Destination"}</div>
                        <div className="text-muted-foreground text-xs truncate">{item.country}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-muted-foreground text-center">No results found.</div>
                )}
              </div>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link href={ctaLink}>
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {ctaText}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-secondary">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 
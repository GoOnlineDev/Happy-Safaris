"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useClerkAuth";
import Link from "next/link";
import { Calendar, Users, MapPin, ChevronRight, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { ConvexHttpClient } from "convex/browser";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function createParticles() {
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 3,
    driftX: (Math.random() - 0.5) * 80,
    driftY: -(Math.random() * 60 + 20),
    color: i % 3 === 0 ? 'hsl(42 90% 82%)' : i % 3 === 1 ? 'hsl(42 72% 63%)' : 'hsl(0 0% 100%)',
  }));
}

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
  const [particles, setParticles] = useState<ReturnType<typeof createParticles>>([]);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const sparkleIdRef = useRef(0);

  // Generate particles client-side only to avoid hydration mismatch
  useEffect(() => {
    setParticles(createParticles());
  }, []);

  const backgroundImageUrl = heroContent?.backgroundImageUrl;
  const mainHeading = heroContent?.mainHeading || "Experience the Magic of";
  const highlightedText = heroContent?.highlightedText || "African Safaris";
  const subheading = heroContent?.subheading || "Discover breathtaking landscapes, encounter majestic wildlife, and create unforgettable memories";
  const ctaText = heroContent?.ctaText || "Explore Tours";
  const ctaLink = heroContent?.ctaLink || "/tours";

  // Sparkle burst on heading hover
  const addSparkle = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const id = sparkleIdRef.current++;
    setSparkles(s => [...s, { id, x, y }]);
    setTimeout(() => setSparkles(s => s.filter(sp => sp.id !== id)), 700);
  };

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
      {/* Background image */}
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

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Floating particles — client-only to avoid hydration mismatch */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
            animate={{
              x: [0, p.driftX],
              y: [0, p.driftY],
              opacity: [0, 0.8, 0.6, 0],
              scale: [0.5, 1, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              repeatDelay: Math.random() * 2 + 1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-28 sm:pt-32 md:pt-36 pb-12 md:pb-16"
        >
          {/* Heading with sparkle interaction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 sm:mb-10 md:mb-12 text-center"
          >
            <div
              className="relative inline-block cursor-default"
              onMouseMove={addSparkle}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-serif">
                {mainHeading}
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-serif shimmer-text section-title mt-1">
                {highlightedText}
              </h1>

              {/* Sparkle bursts on hover */}
              <AnimatePresence>
                {sparkles.map(sp => (
                  <motion.span
                    key={sp.id}
                    className="absolute pointer-events-none"
                    style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
                    initial={{ opacity: 1, scale: 0 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="block w-5 h-5 text-primary drop-shadow-lg select-none">✦</span>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mt-4 sm:mt-6 max-w-3xl mx-auto leading-relaxed px-2"
            >
              {subheading}
            </motion.p>
          </motion.div>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSearch}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/20 mb-8 md:mb-10 relative mx-auto max-w-4xl glow-primary"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div className="space-y-1.5 text-left">
                <label className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wide">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/80" />
                  <Input
                    type="text"
                    placeholder="Where to?"
                    className="bg-background/40 border-white/20 text-white pl-9 placeholder:text-gray-400 focus:border-primary/70 h-11"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wide">Check In</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/80" />
                  <Input
                    type="date"
                    className="bg-background/40 border-white/20 text-white pl-9 focus:border-primary/70 h-11"
                    value={searchParams.checkIn}
                    onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wide">Travelers</label>
                <Select
                  onValueChange={(value) => setSearchParams({ ...searchParams, travelers: value })}
                  defaultValue={searchParams.travelers}
                >
                  <SelectTrigger className="bg-background/40 border-white/20 text-white focus:border-primary/70 h-11">
                    <Users className="h-4 w-4 text-primary/80 mr-2 shrink-0" />
                    <SelectValue placeholder="Travelers" />
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
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg transition-all duration-200 active:scale-95"
                disabled={searchLoading}
              >
                {searchLoading ? "Searching..." : "Search"}
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Search results dropdown */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-secondary/95 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl z-20 max-h-80 overflow-y-auto"
                >
                  {searchError && (
                    <div className="p-4 text-destructive text-center text-sm">{searchError}</div>
                  )}
                  {searchResults && searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <Link
                        key={item._id}
                        href={item._type === "tour" ? `/tours/${item.slug}` : `/destinations/${item.slug}`}
                        className="flex items-center gap-3 p-3 sm:p-4 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                        onClick={() => setShowResults(false)}
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 relative shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg overflow-hidden">
                          {item.imageUrl?.[0] && (
                            <Image
                              src={item.imageUrl[0]}
                              alt={item.title || item.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-white font-semibold text-sm truncate">{item.title || item.name}</div>
                          <div className="text-xs text-primary font-medium">{item._type === "tour" ? "Tour" : "Destination"}</div>
                          <div className="text-muted-foreground text-xs truncate">{item.country}</div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-muted-foreground text-center text-sm">No results found.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link href={ctaLink} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-lg glow-primary transition-all duration-200 active:scale-95"
              >
                {ctaText}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-white border-white/60 hover:bg-white hover:text-secondary font-semibold px-8 transition-all duration-200 active:scale-95"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

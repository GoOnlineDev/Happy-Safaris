"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Calendar, Trees, AlertTriangle, ChevronRight, ChevronLeft as CarouselLeft, ChevronRight as CarouselRight } from "lucide-react";
import { useState } from "react";

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const destination = useQuery(api.destinations.getBySlug, { slug });
  const [currentImage, setCurrentImage] = useState(0);

  if (destination === undefined) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-[#1a2421]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#e3b261] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white">Loading destination</h2>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#1a2421]">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Destination Not Found</h2>
        <Button
          onClick={() => router.push("/destinations")}
          className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Destinations
        </Button>
      </div>
    );
  }

  // Helper to render content blocks
  const renderContent = (content: any[]) => {
    return content.map((block, index) => {
      switch (block.type) {
        case "paragraph":
          return (
            <p key={index} className="text-gray-300 mb-6 leading-relaxed">
              {block.value}
            </p>
          );
        case "heading":
          return (
            <h3 key={index} className="text-2xl font-bold text-white mb-4">
              {block.value}
            </h3>
          );
        case "list":
          return (
            <ul key={index} className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              {Array.isArray(block.value) &&
                block.value.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
            </ul>
          );
        case "image":
          return (
            <div key={index} className="mb-6 rounded-lg overflow-hidden">
              <Image
                src={block.value}
                alt="Destination image"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  // Carousel navigation handlers
  const handlePrev = () => {
    setCurrentImage((prev) =>
      prev === 0 ? (destination.imageUrl?.length || 1) - 1 : prev - 1
    );
  };
  const handleNext = () => {
    setCurrentImage((prev) =>
      prev === (destination.imageUrl?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  return (
    <main className="min-h-screen bg-[#1a2421] pb-20">
      {/* Hero Section with Image Carousel */}
      <section className="relative h-[40vh] md:h-[60vh] flex items-center overflow-hidden mb-8">
        {destination.imageUrl && destination.imageUrl.length > 0 ? (
          <>
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={destination.imageUrl[currentImage]}
                alt={destination.name}
                fill
                className="object-cover brightness-75 transition-all duration-300"
                priority
              />
            </div>
            {destination.imageUrl.length > 1 && (
              <>
                {/* Carousel Controls */}
                <button
                  aria-label="Previous image"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 md:p-3 transition"
                >
                  <CarouselLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="Next image"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 md:p-3 transition"
                >
                  <CarouselRight className="h-5 w-5" />
                </button>
                {/* Dots for mobile/desktop */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {destination.imageUrl.map((img: string, idx: number) => (
                    <button
                      key={img}
                      className={`w-2.5 h-2.5 rounded-full border border-white transition bg-white/60 ${idx === currentImage ? "bg-[#e3b261] border-[#e3b261]" : ""}`}
                      onClick={() => setCurrentImage(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-[#2a3431]" />
        )}
        <div className="absolute top-4 left-4 z-30">
          <Button
            onClick={() => router.push("/destinations")}
            variant="ghost"
            className="bg-[#1a2421]/50 text-white hover:bg-[#1a2421]/70"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="container relative z-20 mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {destination.name}
            </h1>
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-[#e3b261] mr-2" />
              <span className="text-white text-xl drop-shadow-md">{destination.country}</span>
            </div>
            <p className="text-xl text-white/90 max-w-2xl drop-shadow-md">
              {destination.description}
            </p>
          </div>
        </div>
      </section>

      {/* Thumbnails for mobile/desktop below carousel if more than 1 image */}
      {destination.imageUrl && destination.imageUrl.length > 1 && (
        <div className="container mx-auto px-4 mb-8">
          <div className="flex gap-2 justify-center overflow-x-auto">
            {destination.imageUrl.map((img: string, idx: number) => (
              <button
                key={img}
                className={`relative w-16 h-12 md:w-24 md:h-16 rounded overflow-hidden border-2 transition-all ${idx === currentImage ? "border-[#e3b261]" : "border-transparent"}`}
                onClick={() => setCurrentImage(idx)}
                aria-label={`Select image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 64px, 96px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {destination.content && destination.content.length > 0 && renderContent(destination.content)}

          {/* Attractions */}
          {destination.attractions && destination.attractions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Trees className="mr-2 h-5 w-5 text-[#e3b261]" />
                Key Attractions
              </h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                {destination.attractions.map((attraction: string, idx: number) => (
                  <li key={idx}>{attraction}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Best Time to Visit */}
          {destination.bestTimeToVisit && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#e3b261]" />
                Best Time to Visit
              </h3>
              <p className="text-gray-300">{destination.bestTimeToVisit}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
} 
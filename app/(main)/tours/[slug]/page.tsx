"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, AlertTriangle, Star, CalendarDays, Users, Clock, Check, X } from "lucide-react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/booking/BookingForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function TourDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
          <Skeleton className="h-[60vh] md:h-[70vh]" />
          <div className="hidden md:grid grid-cols-2 gap-2">
            <Skeleton className="h-full" />
            <Skeleton className="h-full" />
            <Skeleton className="h-full" />
            <Skeleton className="h-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <aside>
            <Card className="p-6 bg-secondary border-border">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-40 w-full" />
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const tour = useQuery(api.tours.getBySlug, { slug });
  
  const [mainImage, setMainImage] = useState<string | null>(null);

  if (tour === undefined) {
    return <TourDetailSkeleton />;
  }

  if (!tour) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Tour Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the tour you're looking for.</p>
        <Button onClick={() => router.push("/tours")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Tours
        </Button>
      </div>
    );
  }
  
  const images = tour.imageUrl || [];
  const displayMainImage = mainImage || images[0] || "/placeholder.svg";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section noPadding className="pt-8">
        <Button
          onClick={() => router.push("/tours")}
          variant="ghost"
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          All Tours
        </Button>
        <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 font-serif">{tour.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
              {tour.averageRating && tour.averageRating > 0 && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 text-primary" />
                  <span className="font-bold text-white">{tour.averageRating.toFixed(1)}</span>
                  <span className="ml-1">({tour.reviews?.length || 0} reviews)</span>
                </div>
              )}
               <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1 text-primary/80" />
                <span>{tour.location}, {tour.country}</span>
              </div>
            </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 md:mb-12 max-h-[70vh]">
          <div className="relative h-[60vh] md:h-auto rounded-lg overflow-hidden">
            <Image
              src={displayMainImage}
              alt={tour.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2">
            {images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative cursor-pointer rounded-lg overflow-hidden" onClick={() => setMainImage(img)}>
                <Image src={img} alt={`${tour.title} thumbnail ${idx + 1}`} fill className="object-cover hover:opacity-80 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2">
             <div className="prose prose-invert prose-lg max-w-none mb-8">
                <p>{tour.description}</p>
             </div>
            <Tabs defaultValue="itinerary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="inclusions">What's Included</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="itinerary" className="mt-6">
                <div className="space-y-6">
                  {tour.itinerary.map((day: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">{day.day}</div>
                        <div className="w-px h-full bg-border mt-2"></div>
                      </div>
                      <div className="pb-6">
                        <h4 className="font-semibold text-white text-lg">{day.title}</h4>
                        <p className="text-muted-foreground">{day.description}</p>
                         <div className="text-sm text-muted-foreground mt-2">
                          <p><strong>Accommodation:</strong> {day.accommodation}</p>
                          <p><strong>Meals:</strong> {day.meals}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="inclusions" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2 flex items-center"><Check className="h-5 w-5 mr-2 text-green-500"/>Included</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        {tour.included.map((item: string, i: number) => <li key={i} className="text-muted-foreground">{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2 flex items-center"><X className="h-5 w-5 mr-2 text-destructive"/>Not Included</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        {tour.excluded.map((item: string, i: number) => <li key={i} className="text-muted-foreground">{item}</li>)}
                      </ul>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                 <p className="text-muted-foreground">Reviews coming soon!</p>
              </TabsContent>
            </Tabs>
          </div>
          <aside className="lg:sticky top-24 h-fit">
            <BookingForm tour={tour} />
          </aside>
        </div>
      </Section>
    </main>
  );
} 
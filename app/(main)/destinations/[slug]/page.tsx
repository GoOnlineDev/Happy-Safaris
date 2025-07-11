"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Sun, Trees, AlertTriangle, Package, CalendarDays, CheckCircle } from "lucide-react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function renderContent(content: any[]) {
  if (!content) return null;
  return content.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-6 leading-relaxed text-muted-foreground">
            {block.value}
          </p>
        );
      case "heading":
        return (
          <h3 key={index} className="text-2xl font-bold text-white mb-4 mt-8 font-serif">
            {block.value}
          </h3>
        );
      case "list":
        return (
          <ul key={index} className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
            {Array.isArray(block.value) &&
              block.value.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
          </ul>
        );
      case "image":
        return (
          <div key={index} className="mb-6 rounded-lg overflow-hidden relative aspect-video">
            <Image
              src={block.value}
              alt="Destination image"
              fill
              className="w-full object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        );
      default:
        return null;
    }
  });
};

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const destination = useQuery(api.destinations.getBySlug, { slug });
  const relatedTours = useQuery(
    api.tours.getByDestinationId,
    destination ? { destinationId: destination._id } : "skip"
  );
  
  const [mainImage, setMainImage] = useState<string | null>(null);

  const images = destination?.imageUrl || [];
  const displayMainImage = mainImage || images[0] || "/placeholder.svg";

  if (destination === undefined) {
    return <DestinationDetailSkeleton />;
  }

  if (!destination) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Destination Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the destination you're looking for.</p>
        <Button onClick={() => router.push("/destinations")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Destinations
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-30">
        <Button
          onClick={() => router.push("/destinations")}
          variant="secondary"
          className="bg-background/50 text-white hover:bg-background/70 backdrop-blur-sm"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          All Destinations
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative h-[60vh] md:h-auto">
          <Image
            src={displayMainImage}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="hidden md:grid grid-cols-2 gap-2">
          {images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="relative cursor-pointer" onClick={() => setMainImage(img)}>
              <Image src={img} alt={`${destination.name} thumbnail ${idx + 1}`} fill className="object-cover hover:opacity-80 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Section className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              {destination.featured && <Badge className="mb-2">Featured</Badge>}
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 font-serif">{destination.name}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2 text-primary/80" />
                <span>{destination.country}</span>
              </div>
            </div>
            <div className="prose prose-invert prose-lg max-w-none">
              {renderContent(destination.content)}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:sticky top-24 h-fit">
            <Card className="p-6 bg-secondary border-border">
              <h3 className="text-2xl font-bold text-primary mb-4 font-serif">Destination Info</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Sun className="h-6 w-6 mr-3 text-primary/80 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Best Time to Visit</h4>
                    <p className="text-muted-foreground">{destination.bestTimeToVisit}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Trees className="h-6 w-6 mr-3 text-primary/80 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Key Attractions</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {destination.attractions.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </li>
              </ul>
            </Card>

            {relatedTours && relatedTours.length > 0 && (
              <Card className="p-6 bg-secondary border-border mt-6">
                <h3 className="text-2xl font-bold text-primary mb-4 font-serif">Related Tours</h3>
                <ul className="space-y-4">
                  {relatedTours.map(tour => (
                    <li key={tour._id}>
                      <Link href={`/tours/${tour.slug}`} className="block p-4 rounded-lg hover:bg-background-light transition-colors">
                        <h4 className="font-semibold text-white">{tour.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CalendarDays className="h-4 w-4 mr-2" />
                          <span>{tour.duration} Days</span>
                          <span className="mx-2">|</span>
                          <span>From ${tour.price}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </aside>
        </div>
      </Section>
    </main>
  );
}

function DestinationDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Skeleton className="h-[60vh] md:h-auto" />
        <div className="hidden md:grid grid-cols-2 gap-2">
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
        </div>
      </div>
      <Section className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-8 w-1/3 mt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <aside className="space-y-6">
            <Card className="p-6 bg-secondary border-border">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full" />
            </Card>
            <Card className="p-6 bg-secondary border-border">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full" />
            </Card>
          </aside>
        </div>
      </Section>
    </main>
  );
} 
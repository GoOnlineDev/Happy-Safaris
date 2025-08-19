"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Sun, Trees, AlertTriangle, CalendarDays } from "lucide-react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const destination = useQuery(api.destinations.getBySlug, { slug });
  const relatedTours = useQuery(
    api.tours.getByDestinationId,
    destination ? { destinationId: destination._id } : "skip"
  );
  
  const [mainImage, setMainImage] = useState<string | null>(null);

  // Loading state
  if (destination === undefined) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-20 md:pt-24">
        <Section className="py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </Section>
      </main>
    );
  }

  // Not found state
  if (!destination) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-20 md:pt-24">
        <Section className="py-8">
          <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Destination Not Found</h2>
            <p className="text-muted-foreground mb-6 text-center">
              We couldn't find the destination you're looking for. It may have been moved or deleted.
            </p>
            <Button onClick={() => router.push("/destinations")} size="lg">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to All Destinations
            </Button>
          </div>
        </Section>
      </main>
    );
  }

  const images = destination.imageUrl || [];
  const displayMainImage = mainImage || images[0];

  return (
    <main className="min-h-screen bg-background text-foreground pt-20 md:pt-24">
      <Section className="py-8">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/destinations")}
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          All Destinations
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {destination.featured && (
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif">
            {destination.name}
          </h1>
          <div className="flex items-center text-muted-foreground mb-4">
            <MapPin className="h-5 w-5 mr-2 text-primary/80" />
            <span className="text-lg">{destination.country}</span>
          </div>
        </div>

        {/* Main Image */}
        {displayMainImage && (
          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
            <Image
              src={displayMainImage}
              alt={destination.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        {/* Image Gallery */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {images.slice(1, 5).map((img, idx) => (
              <div 
                key={idx} 
                className="relative h-24 md:h-32 cursor-pointer rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                onClick={() => setMainImage(img)}
              >
                <Image 
                  src={img} 
                  alt={`${destination.name} ${idx + 1}`} 
                  fill 
                  className="object-cover" 
                />
              </div>
            ))}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            {destination.description && (
              <Card className="p-6 bg-secondary/50 border-border mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 font-serif">About {destination.name}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {destination.description}
                </p>
              </Card>
            )}

            {/* Detailed Content */}
            {destination.content && destination.content.length > 0 && (
              <Card className="p-6 bg-secondary/50 border-border">
                <h2 className="text-2xl font-bold text-primary mb-6 font-serif">Explore More</h2>
                <div className="space-y-6">
                  {destination.content.map((block: any, index: number) => {
                    if (!block || !block.type) return null;
                    
                    switch (block.type) {
                      case "paragraph":
                        return (
                          <div 
                            key={index} 
                            className="prose prose-invert prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: block.value || '' }}
                          />
                        );
                      case "heading":
                        return (
                          <h3 key={index} className="text-xl font-bold text-white mb-3 mt-6">
                            {block.value}
                          </h3>
                        );
                      case "list":
                        const listItems = typeof block.value === 'string' 
                          ? block.value.split('\n').filter((item: string) => item.trim())
                          : Array.isArray(block.value) ? block.value : [];
                        
                        return (
                          <ul key={index} className="list-disc pl-6 space-y-2 text-muted-foreground">
                            {listItems.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        );
                      case "image":
                        return block.value ? (
                          <div key={index} className="relative h-64 rounded-lg overflow-hidden my-6">
                            <Image
                              src={block.value}
                              alt="Destination content image"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : null;
                      default:
                        return null;
                    }
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Destination Info */}
            <Card className="p-6 bg-secondary border-border">
              <h3 className="text-xl font-bold text-primary mb-4 font-serif">Destination Info</h3>
              
              {destination.bestTimeToVisit && (
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <Sun className="h-5 w-5 text-primary/80 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Best Time to Visit</h4>
                      <p className="text-muted-foreground">{destination.bestTimeToVisit}</p>
                    </div>
                  </div>
                </div>
              )}

              {destination.attractions && destination.attractions.length > 0 && (
                <div>
                  <div className="flex items-start gap-3">
                    <Trees className="h-5 w-5 text-primary/80 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white mb-2">Key Attractions</h4>
                      <ul className="space-y-1">
                        {destination.attractions.map((attraction: string, i: number) => (
                          <li key={i} className="text-muted-foreground text-sm">
                            • {attraction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Related Tours */}
            {relatedTours && relatedTours.length > 0 && (
              <Card className="p-6 bg-secondary border-border">
                <h3 className="text-xl font-bold text-primary mb-4 font-serif">Tours Available</h3>
                <div className="space-y-4">
                  {relatedTours.map((tour: any) => (
                    <Link 
                      key={tour._id} 
                      href={`/tours/${tour.slug}`}
                      className="block p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors border border-border"
                    >
                      <h4 className="font-semibold text-white mb-2">{tour.title}</h4>
                      <div className="flex items-center text-sm text-muted-foreground gap-4">
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          <span>{tour.duration} Days</span>
                        </div>
                        <div className="font-semibold text-primary">
                          From ${tour.price}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </Section>
    </main>
  );
}
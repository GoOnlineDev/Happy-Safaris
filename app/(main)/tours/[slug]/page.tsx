"use client";

import { use, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  MapPin, 
  AlertTriangle, 
  Star, 
  CalendarDays, 
  Users, 
  Clock, 
  Check, 
  X,
  DollarSign 
} from "lucide-react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/booking/BookingForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const tour = useQuery(api.tours.getBySlug, { slug });
  
  const [mainImage, setMainImage] = useState<string | null>(null);

  // Loading state
  if (tour === undefined) {
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
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </Section>
      </main>
    );
  }

  // Not found state
  if (!tour) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-20 md:pt-24">
        <Section className="py-8">
          <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Tour Not Found</h2>
            <p className="text-muted-foreground mb-6 text-center">
              We couldn't find the tour you're looking for. It may have been moved or deleted.
            </p>
            <Button onClick={() => router.push("/tours")} size="lg">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to All Tours
            </Button>
          </div>
        </Section>
      </main>
    );
  }
  
  const images = tour.imageUrl || [];
  const displayMainImage = mainImage || images[0];

  return (
    <main className="min-h-screen bg-background text-foreground pt-20 md:pt-24">
      <Section className="py-8">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/tours")}
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          All Tours
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif">
            {tour.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary/80" />
              <span>{tour.location}, {tour.country}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary/80" />
              <span>{tour.duration} Days</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary/80" />
              <span>Max {tour.maxGroupSize} People</span>
            </div>
            {tour.averageRating && tour.averageRating > 0 && (
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-1 text-primary fill-current" />
                <span className="font-semibold text-white">{tour.averageRating.toFixed(1)}</span>
                <span className="ml-1">({tour.reviews?.length || 0} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Image */}
        {displayMainImage && (
          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
            <Image
              src={displayMainImage}
              alt={tour.title}
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
                  alt={`${tour.title} ${idx + 1}`} 
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
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {tour.description && (
              <Card className="p-6 bg-secondary/50 border-border">
                <h2 className="text-2xl font-bold text-primary mb-4 font-serif">Tour Overview</h2>
                <div 
                  className="prose prose-invert prose-lg max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: tour.description }}
                />
              </Card>
            )}

            {/* Tabs for detailed content */}
            <Tabs defaultValue="itinerary" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-secondary border-border">
                <TabsTrigger value="itinerary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Itinerary
                </TabsTrigger>
                <TabsTrigger value="inclusions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  What's Included
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Itinerary Tab */}
              <TabsContent value="itinerary" className="mt-6">
                <Card className="p-6 bg-secondary/50 border-border">
                  <h3 className="text-xl font-bold text-primary mb-6 font-serif">Day by Day Itinerary</h3>
                  {tour.itinerary && tour.itinerary.length > 0 ? (
                    <div className="space-y-6">
                      {tour.itinerary.map((day: any, index: number) => (
                        <div key={index} className="flex gap-4 pb-6 border-b border-border last:border-b-0">
                          <div className="flex-shrink-0">
                            <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center font-bold">
                              {day.day}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-lg mb-2">{day.title}</h4>
                            <div 
                              className="prose prose-invert prose-sm max-w-none text-muted-foreground mb-3"
                              dangerouslySetInnerHTML={{ __html: day.description || '' }}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <span className="font-semibold text-white mr-2">Accommodation:</span>
                                {day.accommodation}
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <span className="font-semibold text-white mr-2">Meals:</span>
                                {day.meals}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No itinerary available for this tour.
                    </p>
                  )}
                </Card>
              </TabsContent>

              {/* Inclusions Tab */}
              <TabsContent value="inclusions" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Included */}
                  <Card className="p-6 bg-secondary/50 border-border">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      What's Included
                    </h4>
                    {tour.included && tour.included.length > 0 ? (
                      <ul className="space-y-2">
                        {tour.included.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No inclusions specified.</p>
                    )}
                  </Card>

                  {/* Not Included */}
                  <Card className="p-6 bg-secondary/50 border-border">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <X className="h-5 w-5 mr-2 text-destructive" />
                      Not Included
                    </h4>
                    {tour.excluded && tour.excluded.length > 0 ? (
                      <ul className="space-y-2">
                        {tour.excluded.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No exclusions specified.</p>
                    )}
                  </Card>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <Card className="p-6 bg-secondary/50 border-border">
                  <h3 className="text-xl font-bold text-primary mb-4 font-serif">Customer Reviews</h3>
                  {tour.reviews && tour.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {tour.reviews.map((review: any) => (
                        <div key={review._id} className="border-b border-border pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-primary fill-current' : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No reviews yet. Be the first to review this tour!
                    </p>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <aside className="lg:sticky lg:top-32">
            <Card className="p-6 bg-secondary border-border">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-primary font-serif">Book This Tour</h3>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {tour.difficulty}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold text-white">{tour.duration} Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Group Size:</span>
                    <span className="font-semibold text-white">Max {tour.maxGroupSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <div className="text-right">
                      {tour.discountPrice ? (
                        <div>
                          <span className="text-sm text-muted-foreground line-through">${tour.price}</span>
                          <span className="font-bold text-primary text-xl ml-2">${tour.discountPrice}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-primary text-xl">${tour.price}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Start Dates */}
                {tour.startDates && tour.startDates.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-white mb-3">Available Dates</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {tour.startDates.slice(0, 3).map((date: number, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-background/50 rounded">
                          <span className="text-sm text-muted-foreground">
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      ))}
                      {tour.startDates.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{tour.startDates.length - 3} more dates available
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Form */}
              <BookingForm tour={tour} />
            </Card>
          </aside>
        </div>
      </Section>
    </main>
  );
}
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, MapPin, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";

interface TourCardProps {
  tour: {
    _id: Id<"tours">;
    title: string;
    slug: string;
    location: string;
    country: string;
    description: string;
    duration: number;
    maxGroupSize: number;
    price: number;
    averageRating?: number;
    discountPrice?: number;
    imageUrl: string[];
    featured?: boolean;
    startDates?: number[];
  };
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group block h-full">
      <Card className="overflow-hidden bg-secondary border-border group-hover:border-primary transition-colors h-full flex flex-col">
        <div className="relative h-56">
          <Image
            src={tour.imageUrl[0] || "/placeholder.svg"}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-0 left-0 w-full p-2 flex justify-between">
            {tour.featured && <Badge>Featured</Badge>}
            {tour.averageRating && tour.averageRating > 0 ? (
               <Badge variant="secondary" className="flex items-center gap-1 ml-auto">
                <Star className="h-3 w-3 text-primary fill-primary" />
                <span>{tour.averageRating.toFixed(1)}</span>
              </Badge>
            ) : null }
          </div>
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <div className="flex items-center space-x-2 mb-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{tour.location}, {tour.country}</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white flex-grow">{tour.title}</h3>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{tour.duration} Days</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Max {tour.maxGroupSize} People</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto">
            <div>
              <span className="text-xl font-bold text-primary">
                ${tour.discountPrice || tour.price}
              </span>
              {tour.discountPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  ${tour.price}
                </span>
              )}
              <span className="text-sm text-muted-foreground">/person</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-primary font-semibold">
              Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 
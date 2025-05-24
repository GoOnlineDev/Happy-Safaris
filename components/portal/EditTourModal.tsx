"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Loader2, CalendarIcon } from "lucide-react";
import { generateSlug } from "@/lib/utils"; // Keep for consistency, though slug isn't updated on edit mutation
import { UploadButton } from "@/components/uploadthing";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

interface EditTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  tourId: Id<"tours"> | null; // ID of the tour to edit
}

const DEFAULT_FORM_STATE = {
  title: "",
  description: "",
  duration: 7,
  price: 1000,
  discountPrice: undefined as number | undefined,
  location: "",
  country: "",
  maxGroupSize: 12,
  difficulty: "moderate",
  featured: false,
  itinerary: [
    { 
      day: 1, 
      title: "Day 1", 
      description: "", 
      accommodation: "", 
      meals: "" 
    }
  ],
  startDates: [] as number[], // Store timestamps
  included: [""], // Default included
  excluded: [""], // Default excluded
  images: [] as string[],
};

export default function EditTourModal({
  isOpen,
  onClose,
  onSave,
  tourId,
}: EditTourModalProps) {
  const tour = useQuery(api.tours.getById, tourId ? { id: tourId } : "skip");
  const updateTour = useMutation(api.tours.update);

  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [newStartDate, setNewStartDate] = useState<Date | undefined>(undefined);

  // Populate form when tour data is loaded or reset when modal closes
  useEffect(() => {
    if (tour) {
      setForm({
        title: tour.title,
        description: tour.description,
        duration: tour.duration,
        price: tour.price,
        discountPrice: tour.discountPrice,
        location: tour.location,
        country: tour.country,
        maxGroupSize: tour.maxGroupSize,
        difficulty: tour.difficulty,
        featured: tour.featured,
        itinerary: tour.itinerary || DEFAULT_FORM_STATE.itinerary,
        startDates: tour.startDates || [],
        included: tour.included?.length > 0 ? tour.included : [""],
        excluded: tour.excluded?.length > 0 ? tour.excluded : [""],
        images: tour.imageUrl || [],
      });
    } else if (!tourId && !isOpen) {
      // Reset form when modal is closed and no tourId is provided
      setForm(DEFAULT_FORM_STATE);
    }
  }, [tour, tourId, isOpen]);

  if (!isOpen) return null; // Don't render if not open
  if (tourId && !tour) return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a2421] border-[#3a4441] p-6 shadow-lg text-center text-white">
        <Loader2 className="h-8 w-8 text-[#e3b261] animate-spin mx-auto mb-4" />
        <p>Loading tour data...</p>
      </Card>
    </div>
  );

  // Handlers
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

   const handleItineraryChange = (index: number, field: string, value: string) => {
    const updatedItinerary = [...form.itinerary];
    updatedItinerary[index] = {
      ...updatedItinerary[index],
      [field]: value,
    };
    setForm((prev) => ({ ...prev, itinerary: updatedItinerary }));
  };

  const addItineraryDay = () => {
    const nextDay = form.itinerary.length + 1;
    setForm((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: nextDay,
          title: `Day ${nextDay}`,
          description: "",
          accommodation: "",
          meals: "",
        },
      ],
    }));
  };

  const removeItineraryDay = (index: number) => {
    const updatedItinerary = form.itinerary
      .filter((_, i) => i !== index)
      .map((day, i) => ({ ...day, day: i + 1, title: `Day ${i + 1}` }));
    setForm((prev) => ({ ...prev, itinerary: updatedItinerary }));
  };

  const handleAddStartDate = () => {
    if (newStartDate) {
      setForm((prev) => ({ ...prev, startDates: [...prev.startDates, newStartDate.getTime()] }));
      setNewStartDate(undefined);
    }
  };

  const handleRemoveStartDate = (index: number) => {
    setForm((prev) => ({ ...prev, startDates: prev.startDates.filter((_, i) => i !== index) }));
  };

  const handleIncludedChange = (index: number, value: string) => {
    const updatedIncluded = [...form.included];
    updatedIncluded[index] = value;
    setForm((prev) => ({ ...prev, included: updatedIncluded }));
  };

  const addIncludedItem = () => {
    setForm((prev) => ({ ...prev, included: [...prev.included, ""] }));
  };

  const removeIncludedItem = (index: number) => {
    setForm((prev) => ({ ...prev, included: prev.included.filter((_, i) => i !== index) }));
  };

  const handleExcludedChange = (index: number, value: string) => {
    const updatedExcluded = [...form.excluded];
    updatedExcluded[index] = value;
    setForm((prev) => ({ ...prev, excluded: updatedExcluded }));
  };

  const addExcludedItem = () => {
    setForm((prev) => ({ ...prev, excluded: [...prev.excluded, ""] }));
  };

  const removeExcludedItem = (index: number) => {
    setForm((prev) => ({ ...prev, excluded: prev.excluded.filter((_, i) => i !== index) }));
  };

  const handleImageUploadComplete = (res: any) => {
    const urls = res.map((r: any) => r.url);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    setUploading(false);
    toast.success("Images uploaded successfully!");
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tourId) {
        setError("Error: Tour ID is missing.");
        toast.error("Error: Tour ID is missing.");
        return;
    }

    if (!form.title || !form.location || !form.country || form.images.length === 0) {
      setError("Please fill in all required fields (Title, Location, Country) and upload at least one image.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const filteredIncluded = form.included.filter(item => item.trim() !== "");
      const filteredExcluded = form.excluded.filter(item => item.trim() !== "");

      await updateTour({
        id: tourId,
        title: form.title,
        description: form.description,
        duration: form.duration,
        price: form.price,
        discountPrice: form.discountPrice,
        location: form.location,
        country: form.country,
        maxGroupSize: form.maxGroupSize,
        difficulty: form.difficulty,
        featured: form.featured,
        itinerary: form.itinerary,
        startDates: form.startDates,
        included: filteredIncluded,
        excluded: filteredExcluded,
        imageUrl: form.images,
      });

      toast.success("Tour updated successfully!");
      // No form reset here, it will reset when modal closes
      onSave(); // Notify parent to refresh list
      onClose(); // Close modal
    } catch (err: any) {
      setError(err.message || "Failed to update tour.");
      toast.error(err.message || "Failed to update tour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a2421] border-[#3a4441] p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#e3b261]">Edit Tour</h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting || uploading}>
            <X className="h-6 w-6 text-gray-400 hover:text-white" />
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Tour Title *</Label>
                <Input id="title" value={form.title} onChange={e => handleChange("title", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">Location *</Label>
                <Input id="location" value={form.location} onChange={e => handleChange("location", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-white">Country *</Label>
                <Input id="country" value={form.country} onChange={e => handleChange("country", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="duration" className="text-white">Duration (days)</Label>
                <Input id="duration" type="number" value={form.duration} onChange={e => handleChange("duration", parseInt(e.target.value))} className="bg-[#2a3431] border-[#3a4441] text-white" min="1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">Price ($)</Label>
                <Input id="price" type="number" value={form.price} onChange={e => handleChange("price", parseFloat(e.target.value))} className="bg-[#2a3431] border-[#3a4441] text-white" min="0" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="discountPrice" className="text-white">Discount Price ($)</Label>
                <Input id="discountPrice" type="number" value={form.discountPrice || ""} onChange={e => handleChange("discountPrice", parseFloat(e.target.value) || undefined)} className="bg-[#2a3431] border-[#3a4441] text-white" min="0" placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGroupSize" className="text-white">Max Group Size</Label>
                <Input id="maxGroupSize" type="number" value={form.maxGroupSize} onChange={e => handleChange("maxGroupSize", parseInt(e.target.value))} className="bg-[#2a3431] border-[#3a4441] text-white" min="1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-white">Difficulty</Label>
                 <select
                  id="difficulty"
                  value={form.difficulty}
                  onChange={(e) => handleChange("difficulty", e.target.value)}
                  className="w-full bg-[#2a3431] border-[#3a4441] text-white rounded-md p-2"
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>
               <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-white">Short Description</Label>
                <Textarea id="description" value={form.description} onChange={e => handleChange("description", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white h-20" />
              </div>
              <div className="flex items-center space-x-2 pt-2 md:col-span-2">
                <Switch id="featured" checked={form.featured} onCheckedChange={value => handleChange("featured", value)} />
                <Label htmlFor="featured" className="text-white">Featured Tour</Label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Tour Images *</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-3">
              {form.images.map((image, index) => (
                <div key={index} className="relative group">
                  <Image src={image} alt={`Tour ${index + 1}`} width={200} height={120} className="w-full h-32 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              <div className="w-full h-32 border-2 border-dashed border-[#3a4441] rounded-md flex flex-col items-center justify-center p-2 hover:border-[#e3b261] transition-colors">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-6 w-6 text-[#e3b261] animate-spin mb-1" />
                    <p className="text-sm text-gray-400">Uploading...</p>
                  </div>
                ) : (
                  <UploadButton<"tourImages">
                    endpoint="tourImages"
                    onUploadBegin={() => setUploading(true)}
                    onClientUploadComplete={handleImageUploadComplete}
                    onUploadError={(error: Error) => { toast.error(error.message); setUploading(false); }}
                    className="ut-button:bg-[#e3b261] ut-button:text-[#1a2421] ut-button:hover:bg-[#c49a51] ut-label:text-gray-400 ut-allowed-content:text-gray-400"
                  />
                )}
              </div>
            </div>
            {form.images.length === 0 && <p className="text-sm text-red-300">At least one image is required.</p>}
          </div>

          {/* Itinerary */}
          <div>
             <h3 className="text-xl font-semibold text-white mb-3">Itinerary</h3>
             <div className="space-y-4">
               {form.itinerary.map((day, index) => (
                 <div key={index} className="space-y-2 bg-[#232c29] rounded-md p-4">
                   <div className="flex justify-between items-center mb-2">
                       <h4 className="font-semibold text-gray-300">Day {day.day}</h4>
                        <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => removeItineraryDay(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                   </div>
                   <div className="space-y-2">
                       <Label htmlFor={`day-title-${index}`} className="text-gray-300">Title</Label>
                       <Input id={`day-title-${index}`} value={day.title} onChange={e => handleItineraryChange(index, "title", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white" />
                   </div>
                    <div className="space-y-2">
                       <Label htmlFor={`day-description-${index}`} className="text-gray-300">Description</Label>
                       <Textarea id={`day-description-${index}`} value={day.description} onChange={e => handleItineraryChange(index, "description", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white h-16" />
                   </div>
                    <div className="space-y-2">
                       <Label htmlFor={`day-accommodation-${index}`} className="text-gray-300">Accommodation</Label>
                       <Input id={`day-accommodation-${index}`} value={day.accommodation} onChange={e => handleItineraryChange(index, "accommodation", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white" />
                   </div>
                    <div className="space-y-2">
                       <Label htmlFor={`day-meals-${index}`} className="text-gray-300">Meals</Label>
                       <Input id={`day-meals-${index}`} value={day.meals} onChange={e => handleItineraryChange(index, "meals", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white" />
                   </div>
                 </div>
               ))}
               <Button type="button" variant="outline" className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431] hover:text-[#e3b261]" onClick={addItineraryDay}>
                 <Plus className="h-4 w-4 mr-2" /> Add Day
               </Button>
             </div>
          </div>

          {/* Start Dates */}
          <div>
              <h3 className="text-xl font-semibold text-white mb-3">Start Dates</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="border-[#3a4441] text-left font-normal w-[240px] justify-start bg-[#2a3431] text-white hover:bg-[#3a4441]"
                       >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newStartDate ? format(new Date(newStartDate), "PPP") : <span className="text-gray-400">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#2a3431] border-[#3a4441] text-white">
                       <Calendar
                          mode="single"
                          selected={newStartDate}
                          onSelect={setNewStartDate}
                          initialFocus
                          className="react-calendar"
                       />
                    </PopoverContent>
                  </Popover>
                   <Button type="button" variant="outline" className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431] hover:text-[#e3b261]" onClick={handleAddStartDate} disabled={!newStartDate}>
                      <Plus className="h-4 w-4 mr-2" /> Add Date
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {form.startDates.map((timestamp, index) => (
                        <Badge key={index} variant="secondary" className="bg-[#e3b261] text-[#1a2421] flex items-center">
                           {format(new Date(timestamp), "PPP")}
                            <button type="button" onClick={() => handleRemoveStartDate(index)} className="ml-1 text-red-800 hover:text-red-900">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
              </div>
          </div>

           {/* Included */}
           <div>
            <h3 className="text-xl font-semibold text-white mb-3">Included</h3>
            <div className="space-y-3">
              {form.included.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={item} onChange={e => handleIncludedChange(index, e.target.value)} placeholder={`Item ${index + 1}`} className="bg-[#2a3431] border-[#3a4441] text-white" />
                  <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => removeIncludedItem(index)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431] hover:text-[#e3b261]" onClick={addIncludedItem}>
                <Plus className="h-4 w-4 mr-2" /> Add Included Item
              </Button>
            </div>
          </div>

           {/* Excluded */}
           <div>
            <h3 className="text-xl font-semibold text-white mb-3">Excluded</h3>
            <div className="space-y-3">
              {form.excluded.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={item} onChange={e => handleExcludedChange(index, e.target.value)} placeholder={`Item ${index + 1}`} className="bg-[#2a3431] border-[#3a4441] text-white" />
                  <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => removeExcludedItem(index)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431] hover:text-[#e3b261]" onClick={addExcludedItem}>
                <Plus className="h-4 w-4 mr-2" /> Add Excluded Item
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]" disabled={isSubmitting || uploading}>
              {isSubmitting ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Save Changes </>) : ("Save Changes")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 
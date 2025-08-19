"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Loader2, CalendarIcon } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import { UploadButton } from "@/components/uploadthing";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TipTapEditorWrapper from "@/components/TipTapEditorWrapper";

interface CreateTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const DEFAULT_FORM_STATE = {
  title: "",
  description: "",
  duration: 7, // Default duration
  price: 1000, // Default price
  discountPrice: undefined as number | undefined,
  location: "",
  country: "",
  maxGroupSize: 12, // Default max group size
  difficulty: "moderate", // Default difficulty
  featured: false,
  itinerary: [
    { 
      day: 1, 
      title: "Day 1", 
      description: "", 
      accommodation: "Hotel", 
      meals: "Breakfast, Lunch, Dinner" 
    }
  ], // Default itinerary
  startDates: [] as number[], // Store timestamps
  included: [""], // Default included
  excluded: [""], // Default excluded
  images: [] as string[],
  destinationId: null as Id<"destinations"> | null,
};

export default function CreateTourModal({
  isOpen,
  onClose,
  onSave,
}: CreateTourModalProps) {
  const createTour = useMutation(api.tours.create);
  const destinations = useQuery(api.destinations.getAll);
  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [newStartDate, setNewStartDate] = useState<Date | undefined>(undefined);
  const { user } = useUser();

  if (!isOpen) return null; // Don't render if not open

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

    if (!form.title || !form.location || !form.country || form.images.length === 0 || !form.destinationId) {
      setError("Please fill in all required fields (Title, Location, Country, Destination) and upload at least one image.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const slug = generateSlug(form.title);
      const filteredIncluded = form.included.filter(item => item.trim() !== "");
      const filteredExcluded = form.excluded.filter(item => item.trim() !== "");

      if (!user || !user.clerkId) {
        setError("User not authenticated. Please log in.");
        toast.error("User not authenticated.");
        setIsSubmitting(false);
        return;
      }

      await createTour({
        clerkId: user.clerkId,
        title: form.title,
        slug,
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
        destinationId: form.destinationId,
      });

      toast.success("Tour created successfully!");
      setForm(DEFAULT_FORM_STATE); // Reset form
      onSave(); // Notify parent to refresh list
      onClose(); // Close modal
    } catch (err: any) {
      setError(err.message || "Failed to create tour.");
      toast.error(err.message || "Failed to create tour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a2421] border-[#3a4441] p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#e3b261]">Create New Tour</h2>
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
                <Label htmlFor="destination" className="text-white">Destination *</Label>
                <Select
                  onValueChange={(value) => handleChange("destinationId", value as Id<"destinations">)}
                  value={form.destinationId ?? undefined}
                >
                  <SelectTrigger id="destination" className="bg-[#2a3431] border-[#3a4441] text-white">
                    <SelectValue placeholder="Select a destination" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a3431] border-[#3a4441] text-white">
                    {destinations?.map((dest) => (
                      <SelectItem key={dest._id} value={dest._id}>
                        {dest.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <TipTapEditorWrapper 
                  content={form.description} 
                  onChange={(content) => handleChange("description", content)}
                  placeholder="Enter tour description..."
                  className="bg-[#2a3431] border-[#3a4441] rounded-md"
                />
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
                       <TipTapEditorWrapper 
                         content={day.description} 
                         onChange={(content) => handleItineraryChange(index, "description", content)}
                         placeholder="Enter day description..."
                         className="bg-[#2a3431] border-[#3a4441] rounded-md"
                       />
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
                        {newStartDate ? format(newStartDate, "PPP") : <span className="text-gray-400">Pick a date</span>}
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
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating... </>) : ("Create Tour")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 
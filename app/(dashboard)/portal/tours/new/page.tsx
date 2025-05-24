"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { 
  Upload, 
  X, 
  Plus, 
  Image as ImageIcon, 
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Star,
  Check,
  Coffee
} from "lucide-react";
import { generateSlug, formatCurrency } from "@/lib/utils";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import { UploadButton } from "@/utils/uploadthing";
import Link from "next/link";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export default function NewTourPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [uploading, setUploading] = useState(false);
  
  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  
  // Form state - Basic info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<number>(7);
  const [price, setPrice] = useState<number>(1000);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>();
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState<number>(12);
  const [difficulty, setDifficulty] = useState("moderate");
  const [featured, setFeatured] = useState(false);
  
  // Itinerary
  const [itinerary, setItinerary] = useState([
    { 
      day: 1, 
      title: "Day 1", 
      description: "", 
      accommodation: "Hotel", 
      meals: "Breakfast, Lunch, Dinner" 
    }
  ]);
  
  // Start dates
  const [startDates, setStartDates] = useState<number[]>([]);
  const [newStartDate, setNewStartDate] = useState<Date | undefined>(undefined);
  
  // Included/Excluded items
  const [included, setIncluded] = useState<string[]>([""]);
  const [excluded, setExcluded] = useState<string[]>([""]);
  
  // Images
  const [images, setImages] = useState<string[]>([]);
  
  // Create Tour mutation
  const createTour = useMutation(api.tours.create);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Handle image uploads
  const handleImageUploadComplete = (res: any) => {
    const urls = res.map((r: any) => r.url);
    setImages((prev) => [...prev, ...urls]);
    setUploading(false);
  };
  
  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Add itinerary day
  const addItineraryDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary((prev) => [
      ...prev, 
      { 
        day: nextDay, 
        title: `Day ${nextDay}`, 
        description: "", 
        accommodation: "Hotel", 
        meals: "Breakfast, Lunch, Dinner" 
      }
    ]);
  };
  
  // Update itinerary day
  const updateItineraryDay = (index: number, field: string, value: string) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[index] = {
      ...updatedItinerary[index],
      [field]: value
    };
    setItinerary(updatedItinerary);
  };
  
  // Remove itinerary day
  const removeItineraryDay = (index: number) => {
    // Remove the day and reorder the remaining days
    const updatedItinerary = itinerary
      .filter((_, i) => i !== index)
      .map((day, i) => ({
        ...day,
        day: i + 1,
        title: `Day ${i + 1}`
      }));
    
    setItinerary(updatedItinerary);
  };
  
  // Add start date
  const addStartDate = () => {
    if (newStartDate) {
      setStartDates((prev) => [...prev, newStartDate.getTime()]);
      setNewStartDate(undefined);
    }
  };
  
  // Remove start date
  const removeStartDate = (index: number) => {
    setStartDates((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Add included item
  const addIncludedItem = () => {
    setIncluded((prev) => [...prev, ""]);
  };
  
  // Update included item
  const updateIncludedItem = (index: number, value: string) => {
    const updatedItems = [...included];
    updatedItems[index] = value;
    setIncluded(updatedItems);
  };
  
  // Remove included item
  const removeIncludedItem = (index: number) => {
    setIncluded((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Add excluded item
  const addExcludedItem = () => {
    setExcluded((prev) => [...prev, ""]);
  };
  
  // Update excluded item
  const updateExcludedItem = (index: number, value: string) => {
    const updatedItems = [...excluded];
    updatedItems[index] = value;
    setExcluded(updatedItems);
  };
  
  // Remove excluded item
  const removeExcludedItem = (index: number) => {
    setExcluded((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location || !country) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }
    
    if (itinerary.length === 0) {
      setError("Please add at least one day to the itinerary");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError("");
      
      // Filter out empty items
      const filteredIncluded = included.filter(item => item.trim() !== "");
      const filteredExcluded = excluded.filter(item => item.trim() !== "");
      
      // Generate a slug from the title
      const slug = generateSlug(title);
      
      // Create the tour
      await createTour({
        title,
        slug,
        description,
        duration,
        price,
        discountPrice,
        location,
        country,
        imageUrl: images,
        featured,
        maxGroupSize,
        difficulty,
        startDates,
        itinerary,
        included: filteredIncluded,
        excluded: filteredExcluded,
        clerkId: user?.clerkId || "",
      });
      
      // Redirect to tours page
      router.push("/portal/tours");
      
    } catch (error: any) {
      setError(error.message || "Failed to create tour");
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a2421]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#e3b261]"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a2421] p-4">
        <h1 className="text-2xl font-bold text-[#e3b261] mb-4">Access Denied</h1>
        <p className="text-white mb-6">You don't have permission to access this page.</p>
        <Link href="/portal">
          <Button className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]">
            Back to Portal
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ProtectedPortal>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/portal/tours">
            <Button variant="ghost" className="text-gray-400 hover:text-[#e3b261]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tours
            </Button>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#e3b261] mb-2">Create New Tour</h1>
          <p className="text-gray-400">Add a new tour to Happy Safaris</p>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-md">
              {error}
            </div>
          )}
          
          {/* Basic Information */}
          <Card className="bg-[#1a2421] border-[#3a4441] p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">Tour Title*</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#2a3431] border-[#3a4441] text-white"
                    placeholder="e.g. Serengeti Safari Adventure"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-300">Country*</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="bg-[#2a3431] border-[#3a4441] text-white"
                    placeholder="e.g. Tanzania"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">Location*</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-[#2a3431] border-[#3a4441] text-white"
                  placeholder="e.g. Serengeti National Park, Arusha"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description*</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[#2a3431] border-[#3a4441] text-white min-h-32"
                  placeholder="Describe the tour experience, highlights, and unique selling points..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-300">Duration (days)*</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="bg-[#2a3431] border-[#3a4441] text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">Price (USD)*</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    className="bg-[#2a3431] border-[#3a4441] text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountPrice" className="text-gray-300">Discount Price (optional)</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    min={0}
                    value={discountPrice || ""}
                    onChange={(e) => setDiscountPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="bg-[#2a3431] border-[#3a4441] text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxGroupSize" className="text-gray-300">Max Group Size*</Label>
                  <Input
                    id="maxGroupSize"
                    type="number"
                    min={1}
                    value={maxGroupSize}
                    onChange={(e) => setMaxGroupSize(parseInt(e.target.value))}
                    className="bg-[#2a3431] border-[#3a4441] text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-gray-300">Difficulty Level*</Label>
                  <Select 
                    value={difficulty} 
                    onValueChange={(value) => setDifficulty(value)}
                  >
                    <SelectTrigger className="bg-[#2a3431] border-[#3a4441] text-white">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a3431] border-[#3a4441] text-white">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="challenging">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 flex items-center">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={featured}
                      onCheckedChange={setFeatured}
                    />
                    <Label htmlFor="featured" className="text-gray-300">Featured Tour</Label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Tour Images */}
          <Card className="bg-[#1a2421] border-[#3a4441] p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Tour Images</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative h-32 bg-[#2a3431] rounded-md overflow-hidden group">
                    <img src={image} alt={`Tour ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {/* Upload button */}
                <div className="h-32 bg-[#2a3431] border-2 border-dashed border-[#3a4441] rounded-md flex flex-col items-center justify-center p-4 hover:border-[#e3b261] transition-colors">
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Loader2 className="h-8 w-8 text-[#e3b261] animate-spin" />
                      <p className="text-sm text-gray-400">Uploading...</p>
                    </div>
                  ) : (
                    <UploadButton<OurFileRouter, "tourImages">
                      endpoint="tourImages"
                      onUploadBegin={() => setUploading(true)}
                      onClientUploadComplete={handleImageUploadComplete}
                      onUploadError={(error: Error) => {
                        setUploading(false);
                        setError(error.message);
                      }}
                      className="ut-button:bg-[#e3b261] ut-button:text-[#1a2421] ut-button:ut-readying:bg-[#c49a51] ut-button:ut-uploading:bg-[#c49a51]"
                    />
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                Upload high-quality images of the tour. The first image will be used as the cover image.
              </p>
            </div>
          </Card>
          
          {/* Tour Dates */}
          <Card className="bg-[#1a2421] border-[#3a4441] p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Tour Dates</h2>
            <div className="space-y-4">
              <div className="flex items-end space-x-4">
                <div className="space-y-2 flex-1">
                  <Label className="text-gray-300">Add Start Date</Label>
                  <DatePicker
                    date={newStartDate}
                    setDate={setNewStartDate}
                    className="bg-[#2a3431] border-[#3a4441] text-white"
                  />
                </div>
                <Button
                  type="button"
                  onClick={addStartDate}
                  className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
                  disabled={!newStartDate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Date
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Tour Start Dates</Label>
                {startDates.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {startDates.map((date, index) => (
                      <Badge 
                        key={index}
                        className="bg-[#2a3431] text-white hover:bg-[#3a4441] flex items-center gap-1"
                      >
                        <Calendar className="h-3 w-3" />
                        {new Date(date).toLocaleDateString()}
                        <button
                          type="button"
                          onClick={() => removeStartDate(index)}
                          className="ml-1 text-gray-400 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No dates added yet. Add at least one start date.</p>
                )}
              </div>
            </div>
          </Card>
          
          {/* Itinerary */}
          <Card className="bg-[#1a2421] border-[#3a4441] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Itinerary</h2>
              <Button
                type="button"
                onClick={addItineraryDay}
                className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Day
              </Button>
            </div>
            
            <div className="space-y-6">
              {itinerary.map((day, index) => (
                <div key={index} className="bg-[#2a3431] p-4 rounded-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-[#e3b261]" />
                      Day {day.day}
                    </h3>
                    {itinerary.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeItineraryDay(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`day-${index}-title`} className="text-gray-300">Day Title*</Label>
                      <Input
                        id={`day-${index}-title`}
                        value={day.title}
                        onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
                        className="bg-[#1a2421] border-[#3a4441] text-white"
                        placeholder="e.g. Arrival and Welcome Dinner"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`day-${index}-description`} className="text-gray-300">Day Description*</Label>
                      <Textarea
                        id={`day-${index}-description`}
                        value={day.description}
                        onChange={(e) => updateItineraryDay(index, "description", e.target.value)}
                        className="bg-[#1a2421] border-[#3a4441] text-white min-h-24"
                        placeholder="Describe the activities, sights, and experiences planned for this day..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`day-${index}-accommodation`} className="text-gray-300">Accommodation</Label>
                        <Input
                          id={`day-${index}-accommodation`}
                          value={day.accommodation}
                          onChange={(e) => updateItineraryDay(index, "accommodation", e.target.value)}
                          className="bg-[#1a2421] border-[#3a4441] text-white"
                          placeholder="e.g. Serengeti Luxury Camp"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`day-${index}-meals`} className="text-gray-300">Meals</Label>
                        <Input
                          id={`day-${index}-meals`}
                          value={day.meals}
                          onChange={(e) => updateItineraryDay(index, "meals", e.target.value)}
                          className="bg-[#1a2421] border-[#3a4441] text-white"
                          placeholder="e.g. Breakfast, Lunch, Dinner"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Included & Excluded */}
          <Card className="bg-[#1a2421] border-[#3a4441] p-6">
            <h2 className="text-xl font-semibold text-white mb-4">What's Included & Excluded</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Included */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Included
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addIncludedItem}
                    className="text-[#e3b261] border-[#3a4441] hover:bg-[#2a3431]"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                {included.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => updateIncludedItem(index, e.target.value)}
                      className="bg-[#2a3431] border-[#3a4441] text-white"
                      placeholder="e.g. Airport transfers"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIncludedItem(index)}
                      className="text-gray-400 hover:text-red-400"
                      disabled={included.length === 1 && index === 0}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Excluded */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <X className="h-4 w-4 mr-2 text-red-500" />
                    Excluded
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addExcludedItem}
                    className="text-[#e3b261] border-[#3a4441] hover:bg-[#2a3431]"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                {excluded.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => updateExcludedItem(index, e.target.value)}
                      className="bg-[#2a3431] border-[#3a4441] text-white"
                      placeholder="e.g. International flights"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExcludedItem(index)}
                      className="text-gray-400 hover:text-red-400"
                      disabled={excluded.length === 1 && index === 0}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] px-8 py-6 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Tour...
                </>
              ) : (
                "Create Tour"
              )}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedPortal>
  );
} 
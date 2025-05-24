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
import { Plus, X, Loader2 } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import { UploadButton } from "@/components/uploadthing";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";

interface EditDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  destinationId: Id<"destinations"> | null; // ID of the destination to edit
}

const DEFAULT_FORM_STATE = {
  name: "",
  country: "",
  description: "",
  bestTimeToVisit: "",
  featured: false,
  contentBlocks: [{ type: "paragraph", value: "" }],
  attractions: [""],
  images: [],
};

export default function EditDestinationModal({
  isOpen,
  onClose,
  onSave,
  destinationId,
}: EditDestinationModalProps) {
  const destination = useQuery(api.destinations.getById, destinationId ? { id: destinationId } : "skip");
  const updateDestination = useMutation(api.destinations.update);

  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when destination data is loaded
  useEffect(() => {
    if (destination) {
      setForm({
        name: destination.name,
        country: destination.country,
        description: destination.description,
        bestTimeToVisit: destination.bestTimeToVisit || "",
        featured: destination.featured,
        contentBlocks: destination.content || [{ type: "paragraph", value: "" }],
        attractions: destination.attractions || [""],
        images: destination.imageUrl || [],
      });
    } else if (!destinationId && !isOpen) {
        // Reset form when modal is closed and no destinationId is provided
        setForm(DEFAULT_FORM_STATE);
    }
  }, [destination, destinationId, isOpen]);

  if (!isOpen) return null; // Don't render if not open
  if (destinationId && !destination) return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a2421] border-[#3a4441] p-6 shadow-lg text-center text-white">
             <Loader2 className="h-8 w-8 text-[#e3b261] animate-spin mx-auto mb-4" />
             <p>Loading destination data...</p>
        </Card>
    </div>
  );

  // Handlers (similar to Create modal, but operating on 'form' state)
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentBlockChange = (index: number, value: any) => {
    const updatedBlocks = [...form.contentBlocks];
    updatedBlocks[index].value = value;
    setForm((prev) => ({ ...prev, contentBlocks: updatedBlocks }));
  };

  const addContentBlock = (type: string) => {
    setForm((prev) => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, { type, value: "" }],
    }));
  };

  const removeContentBlock = (index: number) => {
    setForm((prev) => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter((_, i) => i !== index),
    }));
  };

  const handleAttractionChange = (index: number, value: string) => {
    const updatedAttractions = [...form.attractions];
    updatedAttractions[index] = value;
    setForm((prev) => ({ ...prev, attractions: updatedAttractions }));
  };

  const addAttraction = () => {
    setForm((prev) => ({
      ...prev,
      attractions: [...prev.attractions, ""],
    }));
  };

  const removeAttraction = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attractions: prev.attractions.filter((_, i) => i !== index),
    }));
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

    if (!destinationId) {
        setError("Error: Destination ID is missing.");
        toast.error("Error: Destination ID is missing.");
        return;
    }

    if (!form.name || !form.country || !form.description || form.images.length === 0) {
      setError("Please fill in all required fields and upload at least one image.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Note: Slug is not updated on edit according to Convex mutation
      const filteredAttractions = form.attractions.filter(att => att.trim() !== "");

      await updateDestination({
        id: destinationId,
        name: form.name,
        country: form.country,
        description: form.description,
        content: form.contentBlocks,
        imageUrl: form.images,
        featured: form.featured,
        attractions: filteredAttractions,
        bestTimeToVisit: form.bestTimeToVisit,
      });

      toast.success("Destination updated successfully!");
      // No form reset here, it will reset when modal closes
      onSave(); // Notify parent to refresh list
      onClose(); // Close modal
    } catch (err: any) {
      setError(err.message || "Failed to update destination.");
      toast.error(err.message || "Failed to update destination.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a2421] border-[#3a4441] p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#e3b261]">Edit Destination</h2>
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
                <Label htmlFor="name" className="text-white">Destination Name *</Label>
                <Input id="name" value={form.name} onChange={e => handleChange("name", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-white">Country *</Label>
                <Input id="country" value={form.country} onChange={e => handleChange("country", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-white">Short Description *</Label>
                <Textarea id="description" value={form.description} onChange={e => handleChange("description", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white h-20" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bestTimeToVisit" className="text-white">Best Time to Visit</Label>
                <Input id="bestTimeToVisit" value={form.bestTimeToVisit} onChange={e => handleChange("bestTimeToVisit", e.target.value)} className="bg-[#2a3431] border-[#3a4441] text-white" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="featured" checked={form.featured} onCheckedChange={value => handleChange("featured", value)} />
                <Label htmlFor="featured" className="text-white">Featured Destination</Label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Destination Images *</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-3">
              {form.images.map((image, index) => (
                <div key={index} className="relative group">
                  <Image src={image} alt={`Destination ${index + 1}`} width={200} height={120} className="w-full h-32 object-cover rounded-md" />
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
                  <UploadButton<"destinationImages">
                    endpoint="destinationImages"
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

          {/* Attractions */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Attractions</h3>
            <div className="space-y-3">
              {form.attractions.map((attraction, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={attraction} onChange={e => handleAttractionChange(index, e.target.value)} placeholder={`Attraction ${index + 1}`} className="bg-[#2a3431] border-[#3a4441] text-white" />
                  <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => removeAttraction(index)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431] hover:text-[#e3b261]" onClick={addAttraction}>
                <Plus className="h-4 w-4 mr-2" /> Add Attraction
              </Button>
            </div>
          </div>

          {/* Content Blocks */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Detailed Content</h3>
            <div className="space-y-4">
              {form.contentBlocks.map((block, index) => (
                <div key={index} className="space-y-2 bg-[#232c29] rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white capitalize">{block.type}</Label>
                    <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => removeContentBlock(index)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {block.type === "paragraph" && (
                    <Textarea value={block.value} onChange={e => handleContentBlockChange(index, e.target.value)} placeholder="Enter paragraph text" className="bg-[#2a3431] border-[#3a4441] text-white h-20" />
                  )}
                  {block.type === "heading" && (
                    <Input value={block.value} onChange={e => handleContentBlockChange(index, e.target.value)} placeholder="Enter heading text" className="bg-[#2a3431] border-[#3a4441] text-white font-bold" />
                  )}
                  {block.type === "list" && (
                    <Textarea value={block.value} onChange={e => handleContentBlockChange(index, e.target.value)} placeholder="Enter list items separated by new lines" className="bg-[#2a3431] border-[#3a4441] text-white h-20" />
                  )}
                </div>
              ))}
              <div className="flex space-x-2">
                <Button type="button" variant="outline" className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431] hover:text-[#e3b261]" onClick={() => addContentBlock("paragraph")}>
                  <Plus className="h-4 w-4 mr-2" /> Paragraph
                </Button>
                <Button type="button" variant="outline" className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431] hover:text-[#e3b261]" onClick={() => addContentBlock("heading")}>
                  <Plus className="h-4 w-4 mr-2" /> Heading
                </Button>
                <Button type="button" variant="outline" className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431] hover:text-[#e3b261]" onClick={() => addContentBlock("list")}>
                  <Plus className="h-4 w-4 mr-2" /> List
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]" disabled={isSubmitting || uploading}>
              {isSubmitting ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating... </>)
              : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { UploadDropzone } from "@/components/uploadthing";
import TipTapEditorWrapper from "@/components/TipTapEditorWrapper";

const ICON_OPTIONS = [
  { value: "Binoculars", label: "Binoculars" },
  { value: "Leaf", label: "Leaf" },
  { value: "Shield", label: "Shield" },
  { value: "Heart", label: "Heart" },
];

const DEFAULT_ABOUT = {
  heroImageUrl: "",
  heroHeading: "",
  heroSubheading: "",
  storyImageUrl: "",
  storyHeading: "",
  storyContent: "",
  advantages: [],
  values: [],
};

export default function AboutAdminPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const about = useQuery(api.about.getAboutContent);
  const updateAbout = useMutation(api.about.updateAboutContent);
  const createAbout = useMutation(api.about.createAboutContent);
  const [form, setForm] = useState(DEFAULT_ABOUT);
  const [saving, setSaving] = useState(false);

  // Prefill form if about doc loads
  useEffect(() => {
    if (about) setForm(about);
  }, [about]);

  // Only allow admin/super_admin
  if (!isLoading && (!user || (user.role !== "admin" && user.role !== "super_admin"))) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">Access denied. Admins only.</div>
    );
  }

  // Handlers
  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAdvantageChange = (idx: number, key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      advantages: prev.advantages.map((a: any, i: number) => i === idx ? { ...a, [key]: value } : a),
    }));
  };

  const handleValueChange = (idx: number, key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      values: prev.values.map((v: any, i: number) => i === idx ? { ...v, [key]: value } : v),
    }));
  };

  const addAdvantage = () => {
    setForm((prev: any) => ({
      ...prev,
      advantages: [...prev.advantages, { icon: "Binoculars", title: "", description: "" }],
    }));
  };
  const removeAdvantage = (idx: number) => {
    setForm((prev: any) => ({
      ...prev,
      advantages: prev.advantages.filter((_: any, i: number) => i !== idx),
    }));
  };
  const addValue = () => {
    setForm((prev: any) => ({
      ...prev,
      values: [...prev.values, { title: "", description: "" }],
    }));
  };
  const removeValue = (idx: number) => {
    setForm((prev: any) => ({
      ...prev,
      values: prev.values.filter((_: any, i: number) => i !== idx),
    }));
  };

  const handleImageUpload = (field: string, url: string) => {
    setForm((prev: any) => ({ ...prev, [field]: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (about) {
        await updateAbout({
          heroImageUrl: form.heroImageUrl,
          heroHeading: form.heroHeading,
          heroSubheading: form.heroSubheading,
          storyImageUrl: form.storyImageUrl,
          storyHeading: form.storyHeading,
          storyContent: form.storyContent,
          advantages: form.advantages,
          values: form.values,
        });
        toast.success("About page updated!");
      } else {
        await createAbout({
          heroImageUrl: form.heroImageUrl,
          heroHeading: form.heroHeading,
          heroSubheading: form.heroSubheading,
          storyImageUrl: form.storyImageUrl,
          storyHeading: form.storyHeading,
          storyContent: form.storyContent,
          advantages: form.advantages,
          values: form.values,
        });
        toast.success("About page created!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save About page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Edit About Page</h1>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Hero Section */}
        <Card className="p-6 space-y-4 bg-secondary border-accent">
          <h2 className="text-xl font-semibold mb-2">Hero Section</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2">
              <label className="block text-gray-300 mb-1">Hero Image</label>
              {form.heroImageUrl && (
                <Image src={form.heroImageUrl} alt="Hero" width={400} height={200} className="rounded-lg mb-2 object-cover w-full h-40" />
              )}
              <UploadDropzone
                endpoint="aboutImage"
                onClientUploadComplete={(res) => {
                  if (res && res[0]?.url) handleImageUpload("heroImageUrl", res[0].url);
                }}
                onUploadError={(err) => { toast.error(err.message); }}
                className="ut-upload-dropzone ut-label:text-white ut-button:bg-primary ut-button:text-secondary ut-button:hover:bg-primary/90 ut-allowed-content:text-gray-400 ut-upload-icon:text-primary"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <label className="block text-gray-300">Heading</label>
              <Input value={form.heroHeading} onChange={e => handleChange("heroHeading", e.target.value)} className="bg-background-light border-accent" />
              <label className="block text-gray-300">Subheading</label>
              <Textarea value={form.heroSubheading} onChange={e => handleChange("heroSubheading", e.target.value)} className="bg-background-light border-accent" />
            </div>
          </div>
        </Card>

        {/* Story Section */}
        <Card className="p-6 space-y-4 bg-secondary border-accent">
          <h2 className="text-xl font-semibold mb-2">Our Story</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2">
              <label className="block text-gray-300 mb-1">Story Image</label>
              {form.storyImageUrl && (
                <Image src={form.storyImageUrl} alt="Story" width={400} height={200} className="rounded-lg mb-2 object-cover w-full h-40" />
              )}
              <UploadDropzone
                endpoint="aboutImage"
                onClientUploadComplete={(res) => {
                  if (res && res[0]?.url) handleImageUpload("storyImageUrl", res[0].url);
                }}
                onUploadError={(err) => { toast.error(err.message); }}
                className="ut-upload-dropzone ut-label:text-white ut-button:bg-primary ut-button:text-secondary ut-button:hover:bg-primary/90 ut-allowed-content:text-gray-400 ut-upload-icon:text-primary"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <label className="block text-gray-300">Story Heading</label>
              <Input value={form.storyHeading} onChange={e => handleChange("storyHeading", e.target.value)} className="bg-background-light border-accent" />
              <label className="block text-gray-300">Story Content</label>
              <TipTapEditorWrapper 
                content={form.storyContent} 
                onChange={(content) => handleChange("storyContent", content)}
                placeholder="Write your story content here..."
                className="bg-background-light border-accent rounded-md"
              />
            </div>
          </div>
        </Card>

        {/* Advantages Section */}
        <Card className="p-6 space-y-4 bg-secondary border-accent">
          <h2 className="text-xl font-semibold mb-2">Advantages</h2>
          {form.advantages.map((adv: any, idx: number) => (
            <div key={idx} className="flex flex-col md:flex-row gap-4 items-center mb-4 bg-background-light rounded-lg p-4">
              <div className="w-full md:w-1/4">
                <label className="block text-gray-300">Icon</label>
                <select
                  className="w-full bg-secondary border border-accent text-white rounded-md p-2"
                  value={adv.icon}
                  onChange={e => handleAdvantageChange(idx, "icon", e.target.value)}
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-gray-300">Title</label>
                <Input value={adv.title} onChange={e => handleAdvantageChange(idx, "title", e.target.value)} className="bg-secondary border-accent" />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-gray-300">Description</label>
                <TipTapEditorWrapper 
                  content={adv.description} 
                  onChange={(content) => handleAdvantageChange(idx, "description", content)}
                  placeholder="Describe this advantage..."
                  className="bg-secondary border-accent rounded-md"
                />
              </div>
              <Button type="button" variant="destructive" className="mt-2 md:mt-6" onClick={() => removeAdvantage(idx)}>Remove</Button>
            </div>
          ))}
          <Button type="button" onClick={addAdvantage} className="mt-2">Add Advantage</Button>
        </Card>

        {/* Values Section */}
        <Card className="p-6 space-y-4 bg-secondary border-accent">
          <h2 className="text-xl font-semibold mb-2">Values</h2>
          {form.values.map((val: any, idx: number) => (
            <div key={idx} className="flex flex-col md:flex-row gap-4 items-center mb-4 bg-background-light rounded-lg p-4">
              <div className="w-full md:w-1/3">
                <label className="block text-gray-300">Title</label>
                <Input value={val.title} onChange={e => handleValueChange(idx, "title", e.target.value)} className="bg-secondary border-accent" />
              </div>
              <div className="w-full md:w-2/3">
                <label className="block text-gray-300">Description</label>
                <TipTapEditorWrapper 
                  content={val.description} 
                  onChange={(content) => handleValueChange(idx, "description", content)}
                  placeholder="Describe this value..."
                  className="bg-secondary border-accent rounded-md"
                />
              </div>
              <Button type="button" variant="destructive" className="mt-2 md:mt-6" onClick={() => removeValue(idx)}>Remove</Button>
            </div>
          ))}
          <Button type="button" onClick={addValue} className="mt-2">Add Value</Button>
        </Card>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-secondary text-lg py-4" disabled={saving}>
          {saving ? "Saving..." : about ? "Save Changes" : "Create About Page"}
        </Button>
      </form>
    </div>
  );
}

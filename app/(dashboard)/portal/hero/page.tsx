"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/uploadthing";

export default function AdminHeroPage() {
  const { user } = useUser();
  const router = useRouter();
  const hero = useQuery(api.hero.getHeroContent);
  const updateHero = useMutation(api.hero.updateHeroContent);

  const [form, setForm] = useState({
    backgroundImageUrl: "",
    mainHeading: "",
    highlightedText: "",
    subheading: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hero) {
      setForm({
        backgroundImageUrl: hero.backgroundImageUrl || "",
        mainHeading: hero.mainHeading || "",
        highlightedText: hero.highlightedText || "",
        subheading: hero.subheading || "",
      });
    }
  }, [hero]);

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "super_admin") {
      router.replace("/portal");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await updateHero({
        backgroundImageUrl: form.backgroundImageUrl,
        mainHeading: form.mainHeading,
        highlightedText: form.highlightedText,
        subheading: form.subheading,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to update hero section.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    return <div className="p-8 text-center">Unauthorized</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Home Page Hero Section</h1>

      {/* Live Preview */}
      <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-[#3a4441] relative min-h-[320px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${form.backgroundImageUrl || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[320px] px-6 py-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {form.mainHeading || <span className="opacity-50">Main Heading</span>}<br />
            <span className="text-[#e3b261]">{form.highlightedText || <span className="opacity-50">Highlighted Text</span>}</span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-200 mb-4 max-w-2xl mx-auto">
            {form.subheading || <span className="opacity-50">Subheading/Description</span>}
          </p>
        </div>
      </div>

      {/* Upload Hero Image */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Background Image</label>
        <UploadDropzone
          endpoint="heroImage"
          onClientUploadComplete={(res) => {
            if (res && res[0]?.url) {
              setForm((prev) => ({ ...prev, backgroundImageUrl: res[0].url }));
            }
          }}
          onUploadError={(error) => setError(error.message || "Image upload failed")}
          className="ut-upload-dropzone ut-label:text-white ut-button:bg-[#e3b261] ut-button:text-[#1a2421] ut-button:hover:bg-[#c49a51] ut-allowed-content:text-gray-400 ut-upload-icon:text-[#e3b261]"
        />
        {form.backgroundImageUrl && (
          <div className="mt-2 text-xs text-gray-400 truncate">{form.backgroundImageUrl}</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Main Heading</label>
          <Input
            name="mainHeading"
            value={form.mainHeading}
            onChange={handleChange}
            placeholder="Main heading text"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Highlighted Text (optional)</label>
          <Input
            name="highlightedText"
            value={form.highlightedText}
            onChange={handleChange}
            placeholder="Text to highlight in gold"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Subheading</label>
          <Textarea
            name="subheading"
            value={form.subheading}
            onChange={handleChange}
            placeholder="Subheading/description"
            required
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">Hero section updated!</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useClerkAuth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUploadThing } from "@/utils/uploadthing";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload, User, X } from "lucide-react";
import { countries, Country } from "@/lib/countries";
import { currencies, Currency } from "@/lib/currencies";
import { Label } from "@/components/ui/label";
import { SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { UploadButton } from "@/utils/uploadthing";

// Interface for Convex user data
interface ConvexUser {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phone?: string;
  country?: string;
  address?: string;
  preferredCurrency?: string;
  preferredLanguage?: string;
  bio?: string;
  role: string;
  createdAt: number;
  updatedAt: number;
}

// Form schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  preferredCurrency: z.string().optional(),
  preferredLanguage: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | undefined>(user?.imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  
  // Get user data from Convex
  const convexUser = useQuery(api.users.getCurrentUser);
  
  // Mutations
  const updateProfile = useMutation(api.users.updateProfile);
  
  // UploadThing integration
  const { startUpload, isUploading: isUploadingFile } = useUploadThing("profileImage");

  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: "",
      country: "",
      address: "",
      preferredCurrency: "",
      preferredLanguage: "English",
      bio: "",
    },
  });

  // Update form values when user data is available
  useEffect(() => {
    if (user && convexUser) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: convexUser?.phone || "",
        country: convexUser?.country || "",
        address: convexUser?.address || "",
        preferredCurrency: convexUser?.preferredCurrency || "",
        preferredLanguage: convexUser?.preferredLanguage || "English",
        bio: convexUser?.bio || "",
      });
      setImageUrl(user.imageUrl);
      setIsLoading(false);
    }
  }, [user, convexUser, form]);

  // Handle profile update
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const uploadResult = await startUpload([file]);
      if (uploadResult && uploadResult[0]?.url) {
        const newImageUrl = uploadResult[0].url;
        setImageUrl(newImageUrl);
        
        // Update user profile with new image URL in Convex
        await updateProfile({ imageUrl: newImageUrl });
        
        toast.success("Profile picture updated");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove profile picture
  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      // Update Convex database to remove the image URL
      await updateProfile({ imageUrl: "" });
      setImageUrl("");
      toast.success("Profile picture removed");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-8">My Profile</h1>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Profile Picture and Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-1 space-y-6"
        >
          <Card className="bg-secondary border-accent p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <img
                src={user?.imageUrl}
                alt="Profile"
                fill
                className="rounded-full object-cover border-4 border-primary"
              />
              <UploadButton
                endpoint="profilePicture"
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  toast.success("Profile picture updated!");
                }}
                onUploadError={(error: Error) => {
                  toast.error(`ERROR! ${error.message}`);
                }}
                className="absolute bottom-0 right-0 ut-button:bg-primary ut-button:text-secondary ut-button:w-8 ut-button:h-8 ut-button:rounded-full ut-button:shadow-lg ut-button:hover:bg-primary/90 ut-upload-icon:h-4 ut-upload-icon:w-4"
              />
            </div>
            <h2 className="text-xl font-semibold text-white">{user?.fullName}</h2>
            <p className="text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
          </Card>
          <Card className="bg-secondary border-accent p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full border-accent text-primary hover:bg-background-light">Change Password</Button>
              <Button variant="outline" className="w-full border-accent text-primary hover:bg-background-light">Manage 2FA</Button>
              <SignOutButton>
                <Button variant="destructive" className="w-full">Sign Out</Button>
              </SignOutButton>
            </div>
          </Card>
        </motion.div>

        {/* Right Side: User Details Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2"
        >
          <Card className="bg-secondary border-accent p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input id="firstName" defaultValue={user?.firstName || ''} className="bg-background-light border-accent text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input id="lastName" defaultValue={user?.lastName || ''} className="bg-background-light border-accent text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.primaryEmailAddress?.emailAddress || ''} disabled className="bg-background-light border-accent text-white disabled:opacity-50" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button className="bg-primary hover:bg-primary/90 text-secondary">Save Changes</Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 
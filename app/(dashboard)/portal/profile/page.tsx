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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a2421] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#e3b261] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2421] text-gray-300 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#e3b261] mb-8">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Card */}
          <Card className="col-span-1 bg-[#2a3431] border-[#3a4441] shadow-xl">
            <CardHeader>
              <CardTitle className="text-[#e3b261]">Profile Picture</CardTitle>
              <CardDescription className="text-gray-400">
                Upload a new profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <div className="relative h-40 w-40 mb-4">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover border-2 border-[#3a4441]"
                    />
                  ) : (
                    <div className="h-40 w-40 rounded-full bg-[#3a4441] flex items-center justify-center">
                      <User className="h-20 w-20 text-[#e3b261]" />
                    </div>
                  )}
                  
                  {isUploading && (
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-10 w-10 text-white animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-[#3a4441] border-[#4a5451] hover:bg-[#4a5451] hover:border-[#5a6451] text-white relative"
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </Button>
                  
                  {imageUrl && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleRemoveImage}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Details Form */}
          <Card className="col-span-1 lg:col-span-2 bg-[#2a3431] border-[#3a4441] shadow-xl">
            <CardHeader>
              <CardTitle className="text-[#e3b261]">Personal Information</CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-[#3a4441] border-[#4a5451] text-white focus:border-[#e3b261]"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-[#3a4441] border-[#4a5451] text-white focus:border-[#e3b261]"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-[#3a4441] border-[#4a5451] text-white focus:border-[#e3b261]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#3a4441] border-[#4a5451] text-white focus:border-[#e3b261]">
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#2a3431] border-[#3a4441] text-white">
                            {countries.map((country: Country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Address</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-[#3a4441] border-[#4a5451] text-white focus:border-[#e3b261]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferredCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Preferred Currency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#3a4441] border-[#4a5451] text-white focus:border-[#e3b261]">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#2a3431] border-[#3a4441] text-white">
                              {currencies.map((currency: Currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.code} - {currency.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Preferred Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#3a4441] border-[#4a5451] text-white focus:border-[#e3b261]">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#2a3431] border-[#3a4441] text-white">
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="French">French</SelectItem>
                              <SelectItem value="German">German</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                              <SelectItem value="Chinese">Chinese</SelectItem>
                              <SelectItem value="Japanese">Japanese</SelectItem>
                              <SelectItem value="Arabic">Arabic</SelectItem>
                              <SelectItem value="Swahili">Swahili</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-[#3a4441] border-[#4a5451] text-white focus:border-[#e3b261]"
                            placeholder="Tell us about yourself"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] font-semibold"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useClerkAuth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { UploadDropzone } from "@/utils/uploadthing";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UploadButton } from "@/utils/uploadthing";

// Form schema for validation
const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, isLoaded } = useAuth();
  const updateProfile = useMutation(api.users.updateProfile);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    toast.promise(updateProfile(data), {
      loading: "Saving changes...",
      success: "Profile updated successfully!",
      error: "Failed to update profile.",
    });
  };

  const handleImageUpload = (res: { url: string }[]) => {
    if (res?.[0]?.url) {
      toast.promise(updateProfile({ imageUrl: res[0].url }), {
        loading: "Updating profile picture...",
        success: "Profile picture updated!",
        error: "Failed to update picture.",
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-3xl font-bold text-primary"
      >
        My Profile
      </motion.h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6 md:col-span-1"
        >
          <Card className="border-accent bg-secondary p-6 text-center">
            <div className="relative mx-auto mb-4 h-32 w-32">
              <Image
                src={user?.imageUrl ?? "/assets/placeholder-user.png"}
                alt="Profile"
                fill
                className="rounded-full border-4 border-primary object-cover"
              />
              <UploadButton
                endpoint="profileImage"
                onClientUploadComplete={handleImageUpload}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
                className="absolute -bottom-2 -right-2 ut-button:h-10 ut-button:w-10 ut-button:rounded-full ut-button:bg-primary ut-button:shadow-lg hover:ut-button:bg-primary/90"
                content={{
                  button({ ready }) {
                    if (ready) return <User className="h-5 w-5" />;
                    return <Loader2 className="h-5 w-5 animate-spin" />;
                  },
                  allowedContent: () => null,
                }}
              />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {user?.fullName}
            </h2>
            <p className="text-gray-400">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </Card>
          <Card className="border-accent bg-secondary p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Account Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full border-accent text-primary hover:bg-background-light"
                disabled
              >
                Change Password
              </Button>
              <SignOutButton>
                <Button variant="destructive" className="w-full">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2"
        >
          <Card className="border-accent bg-secondary p-6">
            <h3 className="mb-6 text-lg font-semibold text-white">
              Personal Information
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-gray-300">First Name</Label>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-accent bg-background-light text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-gray-300">Last Name</Label>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-accent bg-background-light text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Email Address</Label>
                  <Input
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress ?? ""}
                    disabled
                    className="mt-2 border-accent bg-background-light text-white disabled:opacity-50"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-primary text-secondary hover:bg-primary/90"
                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                  >
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 
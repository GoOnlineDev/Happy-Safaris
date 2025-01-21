"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import { User, Mail, Phone, Camera } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export default function ProfilePage() {
  const { userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRef = doc(db, 'users', userProfile!.uid);
      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        // email is managed by Firebase Auth, not Firestore
      });
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPortal>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#e3b261] mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account information</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Card */}
          <Card className="p-6 bg-[#1a2421] border-[#3a4441]">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-[#3a4441] flex items-center justify-center">
                  <User className="h-16 w-16 text-[#e3b261]" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-[#e3b261] rounded-full text-[#1a2421] hover:bg-[#c49a51] transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">{userProfile?.name || "User"}</h3>
                <p className="text-sm text-gray-400">{userProfile?.role}</p>
              </div>
            </div>
          </Card>

          {/* Profile Information Card */}
          <Card className="p-6 bg-[#1a2421] border-[#3a4441] lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#e3b261]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 bg-transparent border-[#3a4441] text-white focus:border-[#e3b261]"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#e3b261]">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      name="email"
                      value={formData.email}
                      disabled={true}
                      className="pl-10 bg-transparent border-[#3a4441] text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#e3b261]">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 bg-transparent border-[#3a4441] text-white focus:border-[#e3b261]"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-[#3a4441] text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </ProtectedPortal>
  );
} 
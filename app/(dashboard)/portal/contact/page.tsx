"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Assuming you might use Textarea for some fields
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel"; // Import Doc type

export default function ContactAdminPage() {
  const { user, isLoading: isLoadingUser } = useUser();
  const router = useRouter();

  // Fetch contact messages (assuming api.contact.getMessages exists)
  const contactMessages = useQuery(api.contact.getMessages) || [];
  const isLoadingMessages = contactMessages === undefined;

  // Fetch editable contact information (assuming api.contact.getContactInfo exists)
  const contactInfo = useQuery(api.contact.getContactInfo);
  const isLoadingContactInfo = contactInfo === undefined;

  const updateContactInfo = useMutation(api.contact.updateContactInfo); // Assuming api.contact.updateContactInfo exists

  const [form, setForm] = useState({
    phone: '',
    email: '',
    location: '',
    businessHours: '',
  });
  const [saving, setSaving] = useState(false);

  // Prefill form if contactInfo loads
  useEffect(() => {
    if (contactInfo) {
      setForm({
        phone: contactInfo.phone,
        email: contactInfo.email,
        location: contactInfo.location,
        businessHours: contactInfo.businessHours,
      });
    }
  }, [contactInfo]);

  // Only allow admin/super_admin, and handle loading states
  if (isLoadingUser || isLoadingMessages || isLoadingContactInfo) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-2">Loading admin page...</p>
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">Access denied. Admins only.</div>
    );
  }

  // Handlers
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContactInfo({
        phone: form.phone,
        email: form.email,
        location: form.location,
        businessHours: form.businessHours,
      });
      toast.success("Contact information updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save contact information");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Contact Admin</h1>

      {/* Edit Contact Information */}
      <Card className="p-6 space-y-6 mb-10 bg-secondary border-accent">
        <h2 className="text-xl font-semibold mb-2 text-white">Edit Contact Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-gray-300">Phone</label>
            <Input value={form.phone} onChange={e => handleChange("phone", e.target.value)} disabled={saving} className="bg-background-light border-accent" />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-300">Email</label>
            <Input value={form.email} onChange={e => handleChange("email", e.target.value)} disabled={saving} className="bg-background-light border-accent" />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-300">Location</label>
            <Input value={form.location} onChange={e => handleChange("location", e.target.value)} disabled={saving} className="bg-background-light border-accent" />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-300">Business Hours</label>
            <Input value={form.businessHours} onChange={e => handleChange("businessHours", e.target.value)} disabled={saving} className="bg-background-light border-accent" />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-secondary" disabled={saving}>
            {saving ? "Saving..." : "Save Contact Info"}
          </Button>
        </form>
      </Card>

      {/* View Contact Messages */}
      <Card className="p-6 space-y-6 bg-secondary border-accent">
        <h2 className="text-xl font-semibold mb-2 text-white">Contact Messages</h2>
        {isLoadingMessages ? (
           <div className="flex items-center space-x-2 text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Loading messages...</span>
           </div>
        ) : contactMessages.length === 0 ? (
          <div className="text-gray-400">No contact messages received yet.</div>
        ) : (
          <div className="space-y-4">
            {contactMessages.map((message) => (
              <div key={message._id} className="p-4 border border-accent rounded-lg bg-background-light">
                <p className="text-gray-300"><strong className="text-primary">From:</strong> {message.name} ({message.email})</p>
                <p className="text-gray-300"><strong className="text-primary">Subject:</strong> {message.subject}</p>
                <p className="text-gray-400 mt-2">{message.message}</p>
                {/* You might want to display timestamp here as well */}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

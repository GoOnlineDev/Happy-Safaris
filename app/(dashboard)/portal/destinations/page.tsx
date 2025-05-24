"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Loader2, Edit, Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import CreateDestinationModal from "@/components/portal/CreateDestinationModal";
import EditDestinationModal from "@/components/portal/EditDestinationModal";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminDestinationsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const destinations = useQuery(api.destinations.getAll);
  const analytics = useQuery(api.destinations.getAnalytics);
  const deleteDestination = useMutation(api.destinations.deleteDestination);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDestinationId, setEditingDestinationId] = useState<Id<"destinations"> | null>(null);

  // Only allow admin/super_admin
  if (!isLoading && (!user || (user.role !== "admin" && user.role !== "super_admin"))) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">Access denied. Admins only.</div>
    );
  }

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this destination?")) {
      try {
        await deleteDestination({ id });
        toast.success("Destination deleted successfully!");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete destination.");
      } finally {
          // Manually refetch data after deletion
          // This is a workaround if Convex optimistic updates aren't sufficient or immediate
          // router.refresh(); // Next.js router refresh might be needed depending on setup
          // Or refetch the Convex query if available/appropriate
      }
    }
  };

  const handleEditClick = (destinationId: Id<"destinations">) => {
      setEditingDestinationId(destinationId);
      setIsEditModalOpen(true);
  };

  const handleModalSave = () => {
      // Logic to refresh the list after saving/creating
      // For Convex queries, you might not need explicit refresh if they are reactive
      // but if needed, you could trigger a state change here that the query depends on,
      // or if using actions, handle revalidation.
  }

  if (isLoading || destinations === undefined || analytics === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a2421]">
        <Loader2 className="h-8 w-8 text-[#e3b261] animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
     // This case is already handled above, but good for type safety or direct access
     return (
      <div className="p-8 text-center text-red-500 font-bold">Access denied. Admins only.</div>
    );
  }

  const totalClicks = analytics?.reduce((sum, dest) => sum + dest.clicks, 0) || 0;

  return (
    <ProtectedPortal>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#e3b261]">Destinations Admin</h1>
          <Button 
            className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
            onClick={() => setIsCreateModalOpen(true)}
          >
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Destination
          </Button>
        </div>

        {/* Analytics */} {/* This section can be further expanded */}
        <Card className="bg-[#1a2421] border-[#3a4441] p-4 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>Total Destinations: <span className="font-bold text-white">{destinations.length}</span></div>
            <div>Total Clicks (Across all destinations): <span className="font-bold text-white">{totalClicks}</span></div>
            {/* Add more stats here as needed */}
          </div>
        </Card>

        {/* Destinations List */}
        <Card className="bg-[#1a2421] border-[#3a4441] p-6">
          <h2 className="text-xl font-semibold text-white mb-4">All Destinations</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#2a3431] text-gray-300">
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((dest) => (
                  <TableRow key={dest._id} className="border-b border-[#3a4441] text-white hover:bg-[#232c29]">
                    <TableCell className="font-medium">{dest.name}</TableCell>
                    <TableCell>{dest.country}</TableCell>
                    <TableCell>{dest.featured ? "Yes" : "No"}</TableCell>
                    <TableCell>{analytics?.find(a => a.id === dest._id)?.clicks || 0}</TableCell>
                    <TableCell className="text-right flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-[#3a4441] text-[#e3b261] hover:bg-[#2a3431] hover:text-[#e3b261]"
                        onClick={() => handleEditClick(dest._id)}
                      >
                          <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(dest._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {destinations.length === 0 && (
            <p className="text-center text-gray-400 mt-4">No destinations found.</p>
          )}
        </Card>
      </div>

      {/* Modals */}
      <CreateDestinationModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleModalSave}
      />

      <EditDestinationModal 
        isOpen={isEditModalOpen}
        onClose={() => {
            setIsEditModalOpen(false);
            setEditingDestinationId(null); // Clear editing state on close
        }}
        onSave={handleModalSave}
        destinationId={editingDestinationId}
      />
    </ProtectedPortal>
  );
}

"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Search, 
  ExternalLink, 
  BarChart3, 
  Loader2, 
  Map,
  Clock,
  Users,
  Calendar,
  DollarSign,
  Trash
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import { useUser } from "@/hooks/useUser";
import { Id } from "@/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import CreateTourModal from "@/components/portal/CreateTourModal";
import EditTourModal from "@/components/portal/EditTourModal";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ToursPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [tourToDelete, setTourToDelete] = useState<Id<"tours"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTourId, setEditingTourId] = useState<Id<"tours"> | null>(null);
  
  // Fetch all tours
  const tours = useQuery(api.tours.getAll) || [];
  const analytics = useQuery(api.tours.getAnalytics);
  
  // Delete tour mutation
  const deleteTour = useMutation(api.tours.deleteTour);
  
  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  
  // Handle delete
  const handleDelete = async () => {
    if (!tourToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteTour({ id: tourToDelete });
      toast.success("Tour deleted successfully");
      setTourToDelete(null);
    } catch (error: any) {
      toast.error(`Failed to delete tour: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format start dates
  const formatStartDates = (dates: number[]) => {
    if (!dates || dates.length === 0) return "No dates available";
    
    return dates
      .slice(0, 2)
      .map(date => new Date(date).toLocaleDateString())
      .join(", ") + (dates.length > 2 ? ` +${dates.length - 2} more` : "");
  };
  
  // Filter tours based on search term
  const filteredTours = tours.filter(tour => 
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (tourId: Id<"tours">) => {
    setEditingTourId(tourId);
    setIsEditModalOpen(true);
  };

  const handleModalSave = () => {
    // For Convex queries, the list should react automatically
    // No explicit refresh needed unless you have specific caching issues
  };

  if (isLoading || tours === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
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
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Tours Admin</h1>
          <Button 
            className="bg-primary hover:bg-primary/90 text-secondary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Tour
          </Button>
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <Card className="bg-[#1a2421] border-[#3a4441] p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-[#e3b261]" />
              Tour Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#2a3431] rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Tours</p>
                <p className="text-2xl font-bold text-white">{tours.length}</p>
              </div>
              <div className="bg-[#2a3431] rounded-lg p-4">
                <p className="text-gray-400 text-sm">Most Popular</p>
                <p className="text-2xl font-bold text-white">
                  {analytics && analytics.length > 0 
                    ? analytics.sort((a, b) => b.views - a.views)[0]?.title || "None" 
                    : "None"}
                </p>
              </div>
              <div className="bg-[#2a3431] rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {analytics ? analytics.reduce((sum, item) => sum + item.views, 0) : 0}
                </p>
              </div>
              <div className="bg-[#2a3431] rounded-lg p-4">
                <p className="text-gray-400 text-sm">Average Price</p>
                <p className="text-2xl font-bold text-white">
                  {analytics && analytics.length > 0
                    ? formatCurrency(
                        analytics.reduce((sum, item) => sum + item.price, 0) / analytics.length
                      )
                    : "$0"}
                </p>
              </div>
            </div>
            
            {/* Detailed Analytics */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-3">Tour Analytics</h3>
              <div className="bg-[#2a3431] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#3a4441]">
                        <th className="p-3 text-gray-300">Tour</th>
                        <th className="p-3 text-gray-300">Country</th>
                        <th className="p-3 text-gray-300">Duration</th>
                        <th className="p-3 text-gray-300">Price</th>
                        <th className="p-3 text-gray-300">Views</th>
                        <th className="p-3 text-gray-300">Featured</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tours
                        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                        .map(tour => (
                          <tr key={tour._id} className="border-b border-[#3a4441] hover:bg-[#3a4441]/50">
                            <td className="p-3 text-white">{tour.title}</td>
                            <td className="p-3 text-gray-400">{tour.country}</td>
                            <td className="p-3 text-white">{tour.duration} days</td>
                            <td className="p-3 text-white">{formatCurrency(tour.price)}</td>
                            <td className="p-3 text-white">
                              <span className="flex items-center">
                                <ExternalLink className="h-3 w-3 mr-1 text-[#e3b261]" /> 
                                {tour.viewCount || 0}
                              </span>
                            </td>
                            <td className="p-3 text-white">
                              {tour.featured ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#e3b261]/20 text-[#e3b261]">
                                  Featured
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700/20 text-gray-400">
                                  Standard
                                </span>
                              )}
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Actions and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Button 
            className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Tour
          </Button>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tours..."
              className="pl-10 bg-[#2a3431] border-[#3a4441] text-white w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tours List */}
        <Card className="bg-secondary border-accent p-6">
          <h2 className="text-xl font-semibold text-white mb-4">All Tours</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-background-light text-gray-300">
                  <TableHead>Name</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTours.map((tour) => (
                  <TableRow key={tour._id} className="border-b border-accent text-white hover:bg-background-light">
                    <TableCell className="font-medium">{tour.title}</TableCell>
                    <TableCell>{tour.location}</TableCell>
                    <TableCell>{tour.country}</TableCell>
                    <TableCell>{tour.featured ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-accent text-primary hover:bg-background-light hover:text-primary"
                        onClick={() => handleEditClick(tour._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setTourToDelete(tour._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredTours.length === 0 && (
            <p className="text-center text-gray-400 mt-4">No tours found.</p>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!tourToDelete} onOpenChange={(open) => !open && setTourToDelete(null)}>
        <AlertDialogContent className="bg-[#2a3431] border-[#3a4441] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Delete Tour</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this tour? This action cannot be undone.
              All data related to this tour will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#1a2421] border-[#3a4441] text-gray-300 hover:bg-[#2a3431] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modals */}
      <CreateTourModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleModalSave}
      />

      <EditTourModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTourId(null);
        }}
        onSave={handleModalSave}
        tourId={editingTourId}
      />
    </ProtectedPortal>
  );
} 
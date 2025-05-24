"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, UserCog, Trash2, Shield, Calendar, Mail, Phone } from "lucide-react";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import { useUser } from "@/hooks/useUser";
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
import { formatDate } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

export default function UsersPage() {
  const { user, isLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [userToChangeRole, setUserToChangeRole] = useState<any>(null);
  const [newRole, setNewRole] = useState("");
  
  // Fetch all users
  const users = useQuery(api.users.listUsers) || [];
  
  // Fetch the current user's Convex user object
  const currentUser = useQuery(api.users.getCurrentUser);
  
  // Mutations
  const updateUserRole = useMutation(api.users.updateUserRole);
  const deleteUser = useMutation(api.users.deleteUser);
  
  // Check if user is admin or super admin
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isSuperAdmin = user?.role === "super_admin";
  
  // Define user type based on the schema
  type UserType = {
    _id: Id<"users">;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
    imageUrl?: string;
    createdAt: number;
    phone?: string;
  };
  
  // Filter users based on search term and role filter
  const filteredUsers = users.filter((u: UserType) => {
    const matchesSearch = 
      (u.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (u.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Handle role change
  const handleRoleChange = async () => {
    if (!userToChangeRole || !newRole) return;
    if (userToChangeRole._id === currentUser?._id) {
      toast.error("You cannot change your own role.");
      return;
    }
    try {
      await updateUserRole({
        userId: userToChangeRole._id,
        role: newRole as "admin" | "tourist"
      });
      toast.success(`Role updated for ${userToChangeRole.firstName} ${userToChangeRole.lastName}`);
      setUserToChangeRole(null);
      setNewRole("");
    } catch (error: any) {
      toast.error(`Failed to update role: ${error.message}`);
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    
    try {
      await deleteUser({
        userId: deleteUserId as unknown as Id<"users">
      });
      
      toast.success("User deleted successfully");
      setDeleteUserId(null);
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.message}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a2421]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#e3b261]"></div>
      </div>
    );
  }

  // Access control - only admins can access
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
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#e3b261] mb-2">User Management</h1>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </motion.div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-10 bg-[#2a3431] border-[#3a4441] text-white w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-[#2a3431] border-[#3a4441] text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a3431] border-[#3a4441] text-white">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="tourist">Tourist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users Table */}
        <Card className="bg-[#1a2421] border-[#3a4441] p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#3a4441]">
                  <th className="text-left p-4 text-[#e3b261]">User</th>
                  <th className="text-left p-4 text-[#e3b261]">Email</th>
                  <th className="text-left p-4 text-[#e3b261]">Role</th>
                  <th className="text-left p-4 text-[#e3b261]">Joined</th>
                  <th className="text-left p-4 text-[#e3b261]">Contact</th>
                  <th className="text-left p-4 text-[#e3b261]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: UserType) => (
                  <tr key={user._id} className="border-b border-[#3a4441] hover:bg-[#2a3431]">
                    <td className="p-4 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-[#3a4441] flex items-center justify-center overflow-hidden">
                          {user.imageUrl ? (
                            <img src={user.imageUrl} alt={user.firstName} className="h-10 w-10 object-cover" />
                          ) : (
                            <span className="text-[#e3b261] font-semibold">
                              {user.firstName?.[0] || user.lastName?.[0] || "U"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-400">ID: {user._id.substr(-5)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white">{user.email}</td>
                    <td className="p-4">
                      <Badge className={`
                        ${user.role === 'super_admin' ? 'bg-purple-500' : 
                          user.role === 'admin' ? 'bg-blue-500' : 
                          'bg-green-500'} 
                        text-white
                      `}>
                        {user.role === 'super_admin' ? 'Super Admin' : 
                         user.role === 'admin' ? 'Admin' : 
                         'Tourist'}
                      </Badge>
                    </td>
                    <td className="p-4 text-white text-sm">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4 text-white text-sm">
                      <div className="space-y-1">
                        {user.phone && (
                          <div className="flex items-center text-gray-400">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-400">
                          <Mail className="h-3 w-3 mr-1" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {/* Only super admins can modify admins, and self-modification is not allowed */}
                        {(isSuperAdmin || user.role !== 'admin') && user._id !== currentUser?._id && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-[#3a4441] text-blue-400 hover:text-blue-300"
                            onClick={() => {
                              setUserToChangeRole(user);
                              setNewRole(user.role);
                            }}
                          >
                            <UserCog className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Change Role</span>
                          </Button>
                        )}
                        
                        {/* Don't allow deleting oneself or super admins (unless you're a super admin) */}
                        {user._id !== currentUser?._id && (isSuperAdmin || user.role !== 'super_admin') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-[#3a4441] text-red-400 hover:text-red-300"
                            onClick={() => setDeleteUserId(user._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-400">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      {/* Role Change Dialog */}
      <AlertDialog open={!!userToChangeRole} onOpenChange={(open) => !open && setUserToChangeRole(null)}>
        <AlertDialogContent className="bg-[#2a3431] border-[#3a4441] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#e3b261]">Change User Role</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              You are changing the role for {userToChangeRole?.firstName} {userToChangeRole?.lastName}.
              This will modify their permissions on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="w-full bg-[#1a2421] border-[#3a4441] text-white">
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2421] border-[#3a4441] text-white">
                {/* Only super_admins can create other super_admins */}
                {isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="tourist">Tourist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#1a2421] border-[#3a4441] text-gray-300 hover:bg-[#2a3431] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421]"
              onClick={handleRoleChange}
            >
              Change Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete User Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent className="bg-[#2a3431] border-[#3a4441] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone and will
              remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#1a2421] border-[#3a4441] text-gray-300 hover:bg-[#2a3431] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteUser}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedPortal>
  );
} 
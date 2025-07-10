"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Search, 
  Filter,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

// Mock data - replace with actual data from your backend
const payments = [
  {
    id: "PAY-001",
    tourName: "Gorilla Trekking Adventure",
    amount: 1400,
    date: "2024-03-15",
    status: "completed",
    paymentMethod: "Credit Card",
    reference: "REF123456",
  },
  {
    id: "PAY-002",
    tourName: "Queen Elizabeth Safari",
    amount: 2000,
    date: "2024-03-01",
    status: "pending",
    paymentMethod: "Bank Transfer",
    reference: "REF789012",
  },
  // Add more payments as needed
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => 
    payment.status === "completed" ? sum + payment.amount : sum, 0
  );

  const pendingAmount = filteredPayments.reduce((sum, payment) => 
    payment.status === "pending" ? sum + payment.amount : sum, 0
  );

  return (
    <ProtectedPortal>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-primary mb-2">Payments</h1>
          <p className="text-gray-400">Manage your payments and transactions</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-secondary border-accent hover:border-primary transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Paid</p>
                <h3 className="text-2xl font-bold text-white">${totalAmount}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-secondary border-accent hover:border-primary transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending Payments</p>
                <h3 className="text-2xl font-bold text-white">${pendingAmount}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-secondary border-accent hover:border-primary transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Payment Methods</p>
                <h3 className="text-2xl font-bold text-white">2</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background-light border-accent text-white focus:border-primary"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="pl-10 bg-background-light border-accent text-white focus:border-primary">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="border-accent text-gray-400 hover:text-white hover:border-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Payments Table */}
        <Card className="bg-secondary border-accent">
          <Table>
            <TableHeader>
              <TableRow className="border-accent hover:bg-background-light">
                <TableHead className="text-primary">Reference</TableHead>
                <TableHead className="text-primary">Tour</TableHead>
                <TableHead className="text-primary">Amount</TableHead>
                <TableHead className="text-primary">Date</TableHead>
                <TableHead className="text-primary">Method</TableHead>
                <TableHead className="text-primary">Status</TableHead>
                <TableHead className="text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="border-accent hover:bg-background-light">
                  <TableCell className="text-gray-400">{payment.reference}</TableCell>
                  <TableCell className="text-white">{payment.tourName}</TableCell>
                  <TableCell className="text-white">${payment.amount}</TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-400">{payment.paymentMethod}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      <span className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/90"
                      onClick={() => window.print()} // Replace with actual receipt download
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No payments found matching your criteria.</p>
            </div>
          )}
        </Card>
      </div>
    </ProtectedPortal>
  );
} 
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as RechartsBarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Download,
  RefreshCw,
  PieChart as PieChartIcon,
  TrendingDown,
  Percent,
  Globe,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import ProtectedPortal from "@/components/portal/ProtectedPortal";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

// Mock data for analytics 
// In a real application, this would come from your Convex database
const mockBookingData = [
  { month: "Jan", bookings: 12, revenue: 2400 },
  { month: "Feb", bookings: 19, revenue: 3800 },
  { month: "Mar", bookings: 25, revenue: 5000 },
  { month: "Apr", bookings: 32, revenue: 6400 },
  { month: "May", bookings: 45, revenue: 9000 },
  { month: "Jun", bookings: 50, revenue: 10000 },
  { month: "Jul", bookings: 62, revenue: 12400 },
  { month: "Aug", bookings: 58, revenue: 11600 },
  { month: "Sep", bookings: 48, revenue: 9600 },
  { month: "Oct", bookings: 38, revenue: 7600 },
  { month: "Nov", bookings: 27, revenue: 5400 },
  { month: "Dec", bookings: 22, revenue: 4400 },
];

const mockDestinationData = [
  { name: "Lake Victoria", views: 1200, bookings: 48 },
  { name: "Mount Kilimanjaro", views: 980, bookings: 35 },
  { name: "Serengeti National Park", views: 1500, bookings: 62 },
  { name: "Bwindi Impenetrable Forest", views: 850, bookings: 28 },
  { name: "Queen Elizabeth National Park", views: 760, bookings: 24 },
  { name: "Murchison Falls", views: 920, bookings: 30 },
];

const mockDemographicsData = [
  { name: "North America", value: 35 },
  { name: "Europe", value: 25 },
  { name: "Asia", value: 20 },
  { name: "Africa", value: 10 },
  { name: "South America", value: 5 },
  { name: "Australia", value: 5 },
];

const COLORS = ["#e3b261", "#2a9d8f", "#e76f51", "#264653", "#f4a261", "#2596be"];

// Define types for data structures
type DestinationAnalytics = {
  id: Id<"destinations">;
  name: string;
  clicks: number;
  // Add other properties as needed
};

type UserType = {
  _id: Id<"users">;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  imageUrl?: string;
  createdAt: number;
};

type BookingType = {
  _id: Id<"bookings">;
  bookingStatus: string;
  // Add other properties as needed
};

type BarChartDataItem = {
  label: string;
  value: number;
};

type TrendType = {
  type: 'up' | 'down';
  value: number;
};

// Bar chart component using simple divs
const BarChart = ({ 
  data, 
  maxValue, 
  title, 
  className = "" 
}: { 
  data: BarChartDataItem[]; 
  maxValue: number; 
  title: string; 
  className?: string 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
            <div className="h-2 bg-background-light rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${(item.value / maxValue) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stat card component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "text-primary" 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ElementType; 
  trend?: TrendType; 
  color?: string 
}) => {
  return (
    <Card className="bg-secondary border-accent p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.type === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend.type === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span>{trend.value}%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('00', '00/20')}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </Card>
  );
};

export default function AnalyticsPage() {
  const { user, isLoading } = useUser();
  const [timeframe, setTimeframe] = useState("month");
  
  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  
  // Fetch analytics data
  const destinationAnalyticsData = useQuery(api.destinations.getAnalytics);
  // Use proper type assertion with the correct structure
  const destinationAnalytics = destinationAnalyticsData 
    ? destinationAnalyticsData as { id: Id<"destinations">; name: string; clicks: number; }[]
    : [];
  const users = useQuery(api.users.listUsers) as UserType[] || [];
  const bookings = [] as BookingType[]; // Mock bookings until API is available
  
  // Calculate some stats for demonstration
  const totalDestinations = destinationAnalytics.length;
  const totalDestinationViews = destinationAnalytics.reduce((sum, item) => sum + item.clicks, 0);
  
  const totalUsers = users.length;
  const admins = users.filter((u: UserType) => u.role === "admin" || u.role === "super_admin").length;
  const tourists = users.filter((u: UserType) => u.role === "tourist").length;
  
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b: BookingType) => b.bookingStatus === "confirmed").length;
  const pendingBookings = bookings.filter((b: BookingType) => b.bookingStatus === "pending").length;
  
  // Generate top destinations
  const topDestinations = [...destinationAnalytics]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
    .map(d => ({ label: d.name, value: d.clicks }));
  
  const maxDestinationViews = Math.max(...topDestinations.map(d => d.value), 1);
  
  // Generate some mock data for recent activity
  const recentActivity = [
    { type: 'booking', userName: 'John Doe', action: 'made a booking', time: '2 hours ago', details: 'Safari Adventure Tour' },
    { type: 'user', userName: 'Emma Johnson', action: 'registered', time: '3 hours ago', details: '' },
    { type: 'destination', userName: 'Admin User', action: 'updated destination', time: '5 hours ago', details: 'Lake Victoria' },
    { type: 'booking', userName: 'Michael Smith', action: 'cancelled booking', time: '1 day ago', details: 'Mountain Trek Tour' },
    { type: 'user', userName: 'Sarah Williams', action: 'changed role to Admin', time: '2 days ago', details: '' },
  ];
  
  // Generate mock data for country stats
  const userCountries = [
    { label: 'United States', value: 124 },
    { label: 'United Kingdom', value: 98 },
    { label: 'Germany', value: 75 },
    { label: 'Canada', value: 64 },
    { label: 'Australia', value: 51 },
  ];
  
  const maxUserCountry = Math.max(...userCountries.map(c => c.value));

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Access control - only admins can access
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Access Denied</h1>
        <p className="text-white mb-6">You don't have permission to access this page.</p>
        <Link href="/portal">
          <Button className="bg-primary hover:bg-primary/90 text-secondary">
            Back to Portal
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ProtectedPortal>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-primary mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Monitor website performance and user engagement</p>
          </motion.div>
          
          <div className="flex items-center">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px] bg-background-light border-accent text-white">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-background-light border-accent text-white">
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Destinations" 
            value={totalDestinations} 
            icon={MapPin}
            trend={{ type: 'up' as const, value: 12 }}
          />
          <StatCard 
            title="Total Users" 
            value={totalUsers} 
            icon={Users}
            color="text-blue-500"
            trend={{ type: 'up' as const, value: 18 }}
          />
          <StatCard 
            title="Total Bookings" 
            value={totalBookings} 
            icon={Calendar}
            color="text-green-500"
            trend={{ type: 'up' as const, value: 5 }}
          />
          <StatCard 
            title="Total Page Views" 
            value={totalDestinationViews} 
            icon={BarChart3}
            color="text-purple-500"
            trend={{ type: 'up' as const, value: 24 }}
          />
        </div>

        {/* Tabs for different analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background-light border-accent">
            <TabsTrigger className="data-[state=active]:bg-primary data-[state=active]:text-secondary" value="overview">Overview</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-primary data-[state=active]:text-secondary" value="destinations">Destinations</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-primary data-[state=active]:text-secondary" value="users">Users</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-primary data-[state=active]:text-secondary" value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Destinations */}
              <Card className="bg-secondary border-accent p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Top Destinations</h2>
                  <Link href="/portal/destinations" className="text-primary text-sm hover:underline flex items-center">
                    View All <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                <BarChart 
                  data={topDestinations} 
                  maxValue={maxDestinationViews}
                  title=""
                />
              </Card>
              
              {/* Recent Activity */}
              <Card className="bg-secondary border-accent p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-3 border-b border-accent">
                      <div className={`p-2 rounded-full flex-shrink-0 ${
                        activity.type === 'booking' ? 'bg-green-500/20' : 
                        activity.type === 'user' ? 'bg-blue-500/20' : 
                        'bg-purple-500/20'
                      }`}>
                        {activity.type === 'booking' ? <Calendar className="h-4 w-4 text-green-500" /> : 
                         activity.type === 'user' ? <Users className="h-4 w-4 text-blue-500" /> : 
                         <MapPin className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div>
                        <p className="text-white text-sm">
                          <span className="font-medium">{activity.userName}</span> {activity.action}
                          {activity.details && <span className="text-gray-400"> - {activity.details}</span>}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            {/* Bottom Row - User Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card className="bg-secondary border-accent p-6">
                <h2 className="text-xl font-semibold text-white mb-6">User Demographics</h2>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                      <span className="text-gray-400">Tourists</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{tourists}</p>
                    <p className="text-gray-400 text-sm mt-1">{Math.round((tourists / totalUsers) * 100)}% of users</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-400">Admins</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{admins}</p>
                    <p className="text-gray-400 text-sm mt-1">{Math.round((admins / totalUsers) * 100)}% of users</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-secondary border-accent p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Top User Countries</h2>
                  <div className="p-2 rounded-full bg-background-light">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <BarChart 
                  data={userCountries} 
                  maxValue={maxUserCountry}
                  title=""
                />
              </Card>
            </div>
          </TabsContent>
          
          {/* Destinations Tab */}
          <TabsContent value="destinations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-secondary border-accent p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Destination Analytics</h2>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="bg-background-light rounded-lg p-4 flex-1">
                      <p className="text-gray-400 text-sm">Total Destinations</p>
                      <p className="text-2xl font-bold text-white">{totalDestinations}</p>
                    </div>
                    <div className="bg-background-light rounded-lg p-4 flex-1">
                      <p className="text-gray-400 text-sm">Total Views</p>
                      <p className="text-2xl font-bold text-white">{totalDestinationViews}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Destination Engagement</h3>
                    <div className="bg-background-light rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Average Views per Destination</span>
                        <span className="text-white font-medium">
                          {totalDestinations > 0 ? Math.round(totalDestinationViews / totalDestinations) : 0}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${Math.min(100, (totalDestinationViews / (totalDestinations * 100)) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-secondary border-accent p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Top Destinations</h2>
                <div className="space-y-4">
                  {topDestinations.length > 0 ? (
                    topDestinations.map((destination, index) => (
                      <div key={index} className="flex items-center justify-between pb-2 border-b border-accent">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-background-light text-primary font-bold">
                            {index + 1}
                          </div>
                          <span className="text-white">{destination.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">{destination.value} views</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 py-4 text-center">No destination data available</p>
                  )}
                </div>
                <div className="mt-4">
                  <Link href="/portal/destinations">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-secondary">
                      Manage Destinations
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-secondary border-accent p-6">
                <h2 className="text-xl font-semibold text-white mb-4">User Statistics</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background-light rounded-lg p-4">
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-white">{totalUsers}</p>
                    </div>
                    <div className="bg-background-light rounded-lg p-4">
                      <p className="text-gray-400 text-sm">New Users (30d)</p>
                      <p className="text-2xl font-bold text-white">{Math.floor(totalUsers * 0.15)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">User Types</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Tourists</span>
                          <span className="text-white font-medium">{tourists}</span>
                        </div>
                        <div className="h-2 bg-background-light rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${(tourists / totalUsers) * 100}%` }} 
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Admins</span>
                          <span className="text-white font-medium">{admins}</span>
                        </div>
                        <div className="h-2 bg-background-light rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${(admins / totalUsers) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-accent">
                    <h3 className="text-lg font-medium text-white mb-3">Top User Countries</h3>
                    <BarChart 
                      data={userCountries.slice(0, 3)} 
                      maxValue={maxUserCountry}
                      title=""
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="bg-secondary border-accent p-6">
                <h2 className="text-xl font-semibold text-white mb-4">User Management</h2>
                
                <div className="space-y-4">
                  <div className="bg-background-light rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">User Accounts</h3>
                        <p className="text-gray-400 text-sm mt-1">
                          Manage user details, permissions, and more
                        </p>
                      </div>
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="mt-4">
                      <Link href="/portal/users">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-secondary">
                          Manage Users
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-background-light rounded-lg p-4">
                    <h3 className="text-white font-medium">Recent Users</h3>
                    <p className="text-gray-400 text-sm mt-1 mb-4">
                      Recently joined users on the platform
                    </p>
                    
                    <div className="space-y-3 mt-2">
                      {users.slice(0, 3).map((user: UserType, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                              {user.imageUrl ? (
                                <img 
                                  src={user.imageUrl} 
                                  alt={user.firstName} 
                                  className="h-8 w-8 object-cover" 
                                />
                              ) : (
                                <span className="text-primary">
                                  {user.firstName?.[0] || user.lastName?.[0] || "U"}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-white">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatDate(user.createdAt)}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.role === 'admin' || user.role === 'super_admin' 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-secondary border-accent p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Booking Statistics</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background-light rounded-lg p-4">
                      <p className="text-gray-400 text-sm">Total Bookings</p>
                      <p className="text-2xl font-bold text-white">{totalBookings}</p>
                    </div>
                    <div className="bg-background-light rounded-lg p-4">
                      <p className="text-gray-400 text-sm">Conversion Rate</p>
                      <p className="text-2xl font-bold text-white">
                        {totalUsers > 0 ? `${Math.round((totalBookings / totalUsers) * 100)}%` : '0%'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Booking Status</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Confirmed</span>
                          <span className="text-white font-medium">{confirmedBookings}</span>
                        </div>
                        <div className="h-2 bg-background-light rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0}%` }} 
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Pending</span>
                          <span className="text-white font-medium">{pendingBookings}</span>
                        </div>
                        <div className="h-2 bg-background-light rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full" 
                            style={{ width: `${totalBookings > 0 ? (pendingBookings / totalBookings) * 100 : 0}%` }} 
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Other</span>
                          <span className="text-white font-medium">
                            {totalBookings - confirmedBookings - pendingBookings}
                          </span>
                        </div>
                        <div className="h-2 bg-background-light rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${totalBookings > 0 ? ((totalBookings - confirmedBookings - pendingBookings) / totalBookings) * 100 : 0}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-secondary border-accent p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Financial Overview</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background-light rounded-lg p-4">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-gray-400 text-sm">Total Revenue</p>
                      </div>
                      <p className="text-2xl font-bold text-white mt-1">$12,450</p>
                    </div>
                    <div className="bg-background-light rounded-lg p-4">
                      <div className="flex items-center">
                        <Percent className="h-5 w-5 text-purple-500 mr-2" />
                        <p className="text-gray-400 text-sm">Growth</p>
                      </div>
                      <p className="text-2xl font-bold text-white mt-1">+15.2%</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-accent">
                    <h3 className="text-lg font-medium text-white mb-3">Booking Trends</h3>
                    <div className="flex space-x-2 overflow-x-auto py-2">
                      {[
                        { month: 'Jan', value: 5 },
                        { month: 'Feb', value: 8 },
                        { month: 'Mar', value: 12 },
                        { month: 'Apr', value: 10 },
                        { month: 'May', value: 15 },
                        { month: 'Jun', value: 20 },
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                          <div 
                            className="w-8 bg-primary rounded-t-sm" 
                            style={{ height: `${item.value * 4}px` }}
                          />
                          <span className="text-xs text-gray-400">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link href="/portal/bookings">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-secondary">
                        View All Bookings
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedPortal>
  );
} 
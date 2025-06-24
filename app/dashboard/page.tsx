"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Hotel,
  Bed,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Utensils,
  Waves,
  LogOut,
  Download,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { logout } from "@/app/actions/auth"
import {
  getRooms,
  getBookings,
  getGuests,
  getMenuItems,
  getFacilities,
  getOnboardingData,
  formatCurrency,
  exportAllData,
  importData,
} from "@/lib/storage"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalGuests: 0,
    checkedInGuests: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    menuItems: 0,
    facilities: 0,
  })

  const [hotelInfo, setHotelInfo] = useState({
    name: "Your Hotel",
    type: "Hotel",
    location: "Nigeria",
  })

  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Load hotel info from onboarding
    const onboardingData = getOnboardingData()
    if (onboardingData) {
      setHotelInfo({
        name: onboardingData.hotelName || "Your Hotel",
        type: onboardingData.hotelType || "Hotel",
        location: `${onboardingData.city || ""}, ${onboardingData.state || "Nigeria"}`.trim(),
      })
    }

    // Calculate stats from localStorage data
    const rooms = getRooms()
    const bookings = getBookings()
    const guests = getGuests()
    const menuItems = getMenuItems()
    const facilities = getFacilities()

    const availableRooms = rooms.filter((room: any) => room.status === "available").length
    const occupiedRooms = rooms.filter((room: any) => room.status === "occupied").length
    const checkedInGuests = guests.filter((guest: any) => guest.status === "checked-in").length
    const confirmedBookings = bookings.filter((booking: any) => booking.status === "confirmed").length
    const totalRevenue = bookings.reduce((sum: number, booking: any) => sum + (booking.totalAmount || 0), 0)

    setStats({
      totalRooms: rooms.length,
      availableRooms,
      occupiedRooms,
      totalGuests: guests.length,
      checkedInGuests,
      totalBookings: bookings.length,
      confirmedBookings,
      totalRevenue,
      menuItems: menuItems.length,
      facilities: facilities.length,
    })

    // Generate recent activity
    const activity = [
      ...bookings.slice(-3).map((booking: any) => ({
        type: "booking",
        message: `New booking from ${booking.guestName}`,
        time: "2 hours ago",
        amount: booking.totalAmount,
      })),
      ...guests.slice(-2).map((guest: any) => ({
        type: "guest",
        message: `${guest.firstName} ${guest.lastName} checked in`,
        time: "4 hours ago",
      })),
    ]
    setRecentActivity(activity.slice(0, 5))
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  const handleExportData = () => {
    exportAllData()
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const success = await importData(file)
      if (success) {
        alert("Data imported successfully!")
        window.location.reload()
      } else {
        alert("Failed to import data. Please check the file format.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hotel className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">{hotelInfo.name}</h1>
                <p className="text-sm text-gray-500">
                  {hotelInfo.type} • {hotelInfo.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-data" />
              <Button variant="outline" size="sm" onClick={() => document.getElementById("import-data")?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRooms}</div>
              <p className="text-xs text-muted-foreground">
                {stats.availableRooms} available, {stats.occupiedRooms} occupied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGuests}</div>
              <p className="text-xs text-muted-foreground">{stats.checkedInGuests} currently checked in</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">{stats.confirmedBookings} confirmed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Total from bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/rooms">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Bed className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Room Management</CardTitle>
                <CardDescription>Manage rooms, pricing, and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge variant="secondary">{stats.totalRooms} rooms</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/bookings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Bookings</CardTitle>
                <CardDescription>Handle reservations and check-ins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge variant="secondary">{stats.totalBookings} bookings</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/guests">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Guest Management</CardTitle>
                <CardDescription>Manage guest profiles and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge variant="secondary">{stats.totalGuests} guests</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/menu">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Utensils className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Menu Management</CardTitle>
                <CardDescription>Manage restaurant menu and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge variant="secondary">{stats.menuItems} items</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/dashboard/facilities">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-blue-600" />
                  Facilities Management
                </CardTitle>
                <CardDescription>Manage hotel facilities and services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stats.facilities} facilities available</span>
                  <Badge variant="outline">Manage</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/settings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Settings & Reports
                </CardTitle>
                <CardDescription>Configure settings and view analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">System configuration</span>
                  <Badge variant="outline">Configure</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your hotel operations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    {activity.amount && <Badge variant="secondary">{formatCurrency(activity.amount)}</Badge>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-500">Activity will appear here as you use the system</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

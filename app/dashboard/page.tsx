import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Hotel,
  Bed,
  Utensils,
  Waves,
  DollarSign,
  TrendingUp,
  Plus,
  Calendar,
  User,
  Settings,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

// Add logout import at the top
import { logout } from "@/app/actions/auth"

// This would normally come from your database/session
const mockUserData = {
  hotelName: "Grand Hotel & Resort",
  hotelType: "resort",
  totalRooms: 24,
  hasRestaurant: true,
  hasPool: true,
  hasGym: true,
  hasSpa: true,
  averageRoomRate: 299,
  currency: "USD",
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Hotel className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold">{mockUserData.hotelName}</h1>
                <p className="text-sm text-gray-500 capitalize">{mockUserData.hotelType} • Dashboard Overview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Setup Complete
              </Badge>
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome to HotelManager Pro! 🎉</h2>
          <p className="text-blue-100 mb-4">
            Your hotel setup is complete. You can now start managing your {mockUserData.totalRooms} rooms,
            {mockUserData.hasRestaurant ? " restaurant," : ""}
            {mockUserData.hasPool ? " pool," : ""}
            {mockUserData.hasGym ? " fitness center," : ""}
            {mockUserData.hasSpa ? " spa," : ""} and more!
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/rooms">
              <Button variant="secondary" size="sm">
                Add Your First Room
              </Button>
            </Link>
            {mockUserData.hasRestaurant && (
              <Link href="/dashboard/menu">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  Setup Menu
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUserData.totalRooms}</div>
              <p className="text-xs text-muted-foreground">Ready to configure</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockUserData.currency === "USD" ? "$" : "€"}
                {mockUserData.averageRoomRate}
              </div>
              <p className="text-xs text-muted-foreground">Per night</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facilities</CardTitle>
              <Waves className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  [mockUserData.hasRestaurant, mockUserData.hasPool, mockUserData.hasGym, mockUserData.hasSpa].filter(
                    Boolean,
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Active facilities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Start accepting bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/rooms">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-blue-600" />
                  Room Management
                </CardTitle>
                <CardDescription>Add and configure your {mockUserData.totalRooms} rooms</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Setup Rooms
                </Button>
              </CardContent>
            </Link>
          </Card>

          {mockUserData.hasRestaurant && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/dashboard/menu">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-green-600" />
                    Restaurant Menu
                  </CardTitle>
                  <CardDescription>Create your restaurant menu and pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Menu
                  </Button>
                </CardContent>
              </Link>
            </Card>
          )}

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/facilities">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-purple-600" />
                  Facilities
                </CardTitle>
                <CardDescription>Configure your hotel facilities and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Setup Facilities
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/bookings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Booking System
                </CardTitle>
                <CardDescription>Start accepting room and facility bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Enable Bookings
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/guests">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Guest Management
                </CardTitle>
                <CardDescription>Manage guest profiles and check-ins</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guests
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Settings
                </CardTitle>
                <CardDescription>Fine-tune your hotel configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Getting Started Guide
            </CardTitle>
            <CardDescription>Complete these steps to get your hotel fully operational</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Add Your Rooms</p>
                  <p className="text-sm text-gray-500">
                    Configure your {mockUserData.totalRooms} rooms with details, pricing, and amenities
                  </p>
                </div>
                <Link href="/dashboard/rooms">
                  <Button size="sm">Start</Button>
                </Link>
              </div>

              {mockUserData.hasRestaurant && (
                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Create Restaurant Menu</p>
                    <p className="text-sm text-gray-500">Add food and beverage items with categories and pricing</p>
                  </div>
                  <Link href="/dashboard/menu">
                    <Button size="sm">Start</Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Configure Facilities</p>
                  <p className="text-sm text-gray-500">Set up pricing and booking rules for your facilities</p>
                </div>
                <Link href="/dashboard/facilities">
                  <Button size="sm">Start</Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Test Booking System</p>
                  <p className="text-sm text-gray-500">Create a test booking to ensure everything works correctly</p>
                </div>
                <Link href="/dashboard/bookings">
                  <Button size="sm">Start</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus, Edit, Trash2, ArrowLeft, Bed, Waves, Loader2 } from "lucide-react"
import Link from "next/link"

interface Booking {
  id: string
  type: "room" | "facility"
  guestName: string
  guestEmail: string
  guestPhone: string
  itemName: string
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  specialRequests?: string
  createdAt: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      type: "room",
      guestName: "John Smith",
      guestEmail: "john@example.com",
      guestPhone: "+1 (555) 123-4567",
      itemName: "Ocean View Suite #101",
      checkIn: "2024-01-15",
      checkOut: "2024-01-18",
      guests: 2,
      totalAmount: 897,
      status: "confirmed",
      specialRequests: "Late check-in requested",
      createdAt: "2024-01-10",
    },
    {
      id: "2",
      type: "facility",
      guestName: "Sarah Johnson",
      guestEmail: "sarah@example.com",
      guestPhone: "+1 (555) 987-6543",
      itemName: "Golf Course",
      checkIn: "2024-01-16",
      checkOut: "2024-01-16",
      guests: 4,
      totalAmount: 300,
      status: "pending",
      createdAt: "2024-01-12",
    },
  ])

  const [isAddingBooking, setIsAddingBooking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [newBooking, setNewBooking] = useState({
    type: "room" as "room" | "facility",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    itemName: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: "",
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null)

  const handleEditBooking = (booking: Booking) => {
    setBookingToEdit(booking)
    setEditDialogOpen(true)
  }

  const saveEditBooking = async () => {
    if (bookingToEdit) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setBookings(bookings.map((booking) => (booking.id === bookingToEdit.id ? bookingToEdit : booking)))
      setEditDialogOpen(false)
      setBookingToEdit(null)
      setIsLoading(false)
    }
  }

  const handleDeleteBooking = (bookingId: string) => {
    setBookingToDelete(bookingId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteBooking = () => {
    if (bookingToDelete) {
      setBookings(bookings.filter((booking) => booking.id !== bookingToDelete))
      setDeleteDialogOpen(false)
      setBookingToDelete(null)
    }
  }

  const handleAddBooking = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const booking: Booking = {
      id: Date.now().toString(),
      type: newBooking.type,
      guestName: newBooking.guestName,
      guestEmail: newBooking.guestEmail,
      guestPhone: newBooking.guestPhone,
      itemName: newBooking.itemName,
      checkIn: newBooking.checkIn,
      checkOut: newBooking.checkOut,
      guests: newBooking.guests,
      totalAmount: Math.floor(Math.random() * 1000) + 100,
      status: "pending",
      specialRequests: newBooking.specialRequests,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setBookings([...bookings, booking])
    setNewBooking({
      type: "room",
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      itemName: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      specialRequests: "",
    })
    setIsAddingBooking(false)
    setIsLoading(false)
  }

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true
    if (activeTab === "rooms") return booking.type === "room"
    if (activeTab === "facilities") return booking.type === "facility"
    return booking.status === activeTab
  })

  const availableRooms = [
    "Ocean View Suite #101",
    "Standard Double #102",
    "Deluxe Suite #201",
    "Presidential Suite #301",
  ]
  const availableFacilities = ["Swimming Pool", "Fitness Center", "Golf Course", "Spa & Wellness"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Booking Management
                </h1>
                <p className="text-sm text-gray-500">Manage room and facility bookings</p>
              </div>
            </div>
            <Dialog open={isAddingBooking} onOpenChange={setIsAddingBooking}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  New Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Booking</DialogTitle>
                  <DialogDescription>Add a new room or facility booking</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bookingType">Booking Type</Label>
                      <Select
                        value={newBooking.type}
                        onValueChange={(value: "room" | "facility") => setNewBooking({ ...newBooking, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="room">Room</SelectItem>
                          <SelectItem value="facility">Facility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemName">{newBooking.type === "room" ? "Room" : "Facility"}</Label>
                      <Select
                        value={newBooking.itemName}
                        onValueChange={(value) => setNewBooking({ ...newBooking, itemName: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${newBooking.type}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {(newBooking.type === "room" ? availableRooms : availableFacilities).map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guestName">Guest Name</Label>
                      <Input
                        id="guestName"
                        value={newBooking.guestName}
                        onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guestEmail">Email</Label>
                      <Input
                        id="guestEmail"
                        type="email"
                        value={newBooking.guestEmail}
                        onChange={(e) => setNewBooking({ ...newBooking, guestEmail: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guestPhone">Phone</Label>
                      <Input
                        id="guestPhone"
                        type="tel"
                        value={newBooking.guestPhone}
                        onChange={(e) => setNewBooking({ ...newBooking, guestPhone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        value={newBooking.guests}
                        onChange={(e) => setNewBooking({ ...newBooking, guests: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">Check-in Date</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={newBooking.checkIn}
                        onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">Check-out Date</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={newBooking.checkOut}
                        onChange={(e) => setNewBooking({ ...newBooking, checkOut: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      value={newBooking.specialRequests}
                      onChange={(e) => setNewBooking({ ...newBooking, specialRequests: e.target.value })}
                      placeholder="Any special requests or notes..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleAddBooking} disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Booking...
                        </>
                      ) : (
                        "Create Booking"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingBooking(false)} disabled={isLoading}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter((b) => b.status === "confirmed").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>Manage your hotel bookings and reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.guestName}</div>
                              <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {booking.type === "room" ? (
                                <Bed className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Waves className="h-4 w-4 text-purple-600" />
                              )}
                              <span className="capitalize">{booking.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{booking.itemName}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{booking.checkIn}</div>
                              <div className="text-gray-500">to {booking.checkOut}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.guests}</TableCell>
                          <TableCell>${booking.totalAmount}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditBooking(booking)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteBooking(booking.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone and may affect revenue.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Keep Booking
              </Button>
              <Button variant="destructive" onClick={confirmDeleteBooking}>
                Cancel Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Edit Booking Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
              <DialogDescription>Update booking information and details</DialogDescription>
            </DialogHeader>
            {bookingToEdit && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editBookingType">Booking Type</Label>
                    <Select
                      value={bookingToEdit.type}
                      onValueChange={(value: "room" | "facility") =>
                        setBookingToEdit({ ...bookingToEdit, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room">Room</SelectItem>
                        <SelectItem value="facility">Facility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editItemName">{bookingToEdit.type === "room" ? "Room" : "Facility"}</Label>
                    <Select
                      value={bookingToEdit.itemName}
                      onValueChange={(value) => setBookingToEdit({ ...bookingToEdit, itemName: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(bookingToEdit.type === "room" ? availableRooms : availableFacilities).map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editGuestName">Guest Name</Label>
                    <Input
                      id="editGuestName"
                      value={bookingToEdit.guestName}
                      onChange={(e) => setBookingToEdit({ ...bookingToEdit, guestName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editGuestEmail">Email</Label>
                    <Input
                      id="editGuestEmail"
                      type="email"
                      value={bookingToEdit.guestEmail}
                      onChange={(e) => setBookingToEdit({ ...bookingToEdit, guestEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editGuestPhone">Phone</Label>
                    <Input
                      id="editGuestPhone"
                      type="tel"
                      value={bookingToEdit.guestPhone}
                      onChange={(e) => setBookingToEdit({ ...bookingToEdit, guestPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editGuests">Number of Guests</Label>
                    <Input
                      id="editGuests"
                      type="number"
                      min="1"
                      value={bookingToEdit.guests}
                      onChange={(e) => setBookingToEdit({ ...bookingToEdit, guests: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editCheckIn">Check-in Date</Label>
                    <Input
                      id="editCheckIn"
                      type="date"
                      value={bookingToEdit.checkIn}
                      onChange={(e) => setBookingToEdit({ ...bookingToEdit, checkIn: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCheckOut">Check-out Date</Label>
                    <Input
                      id="editCheckOut"
                      type="date"
                      value={bookingToEdit.checkOut}
                      onChange={(e) => setBookingToEdit({ ...bookingToEdit, checkOut: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editStatus">Status</Label>
                    <Select
                      value={bookingToEdit.status}
                      onValueChange={(value: Booking["status"]) =>
                        setBookingToEdit({ ...bookingToEdit, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editTotalAmount">Total Amount ($)</Label>
                    <Input
                      id="editTotalAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={bookingToEdit.totalAmount}
                      onChange={(e) =>
                        setBookingToEdit({ ...bookingToEdit, totalAmount: Number.parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editSpecialRequests">Special Requests</Label>
                  <Textarea
                    id="editSpecialRequests"
                    value={bookingToEdit.specialRequests || ""}
                    onChange={(e) => setBookingToEdit({ ...bookingToEdit, specialRequests: e.target.value })}
                    placeholder="Any special requests or notes..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={saveEditBooking} disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

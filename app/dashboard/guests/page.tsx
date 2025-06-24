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
import { User, Plus, Edit, Trash2, ArrowLeft, Phone, Mail, MapPin, Calendar, Loader2, Search } from "lucide-react"
import Link from "next/link"

interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  dateOfBirth: string
  idType: string
  idNumber: string
  status: "checked-in" | "checked-out" | "upcoming" | "cancelled"
  totalBookings: number
  totalSpent: number
  lastVisit: string
  preferences: string[]
  notes: string
  createdAt: string
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St",
      city: "New York",
      country: "USA",
      dateOfBirth: "1985-06-15",
      idType: "Passport",
      idNumber: "A12345678",
      status: "checked-in",
      totalBookings: 5,
      totalSpent: 2450,
      lastVisit: "2024-01-15",
      preferences: ["Ocean View", "Late Checkout", "Extra Towels"],
      notes: "VIP guest, prefers room service",
      createdAt: "2023-08-10",
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave",
      city: "Los Angeles",
      country: "USA",
      dateOfBirth: "1990-03-22",
      idType: "Driver's License",
      idNumber: "DL987654321",
      status: "upcoming",
      totalBookings: 2,
      totalSpent: 890,
      lastVisit: "2023-12-20",
      preferences: ["Gym Access", "Healthy Menu"],
      notes: "Fitness enthusiast, early riser",
      createdAt: "2023-11-15",
    },
  ])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null)

  const handleDeleteGuest = (guestId: string) => {
    setGuestToDelete(guestId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteGuest = () => {
    if (guestToDelete) {
      setGuests(guests.filter((guest) => guest.id !== guestToDelete))
      setDeleteDialogOpen(false)
      setGuestToDelete(null)
    }
  }

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [guestToEdit, setGuestToEdit] = useState<Guest | null>(null)

  const handleEditGuest = (guest: Guest) => {
    setGuestToEdit(guest)
    setEditDialogOpen(true)
  }

  const saveEditGuest = async () => {
    if (guestToEdit) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setGuests(guests.map((guest) => (guest.id === guestToEdit.id ? guestToEdit : guest)))
      setEditDialogOpen(false)
      setGuestToEdit(null)
      setIsLoading(false)
    }
  }

  const [isAddingGuest, setIsAddingGuest] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [newGuest, setNewGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    dateOfBirth: "",
    idType: "",
    idNumber: "",
    preferences: "",
    notes: "",
  })

  const handleAddGuest = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const guest: Guest = {
      id: Date.now().toString(),
      firstName: newGuest.firstName,
      lastName: newGuest.lastName,
      email: newGuest.email,
      phone: newGuest.phone,
      address: newGuest.address,
      city: newGuest.city,
      country: newGuest.country,
      dateOfBirth: newGuest.dateOfBirth,
      idType: newGuest.idType,
      idNumber: newGuest.idNumber,
      status: "upcoming",
      totalBookings: 0,
      totalSpent: 0,
      lastVisit: "",
      preferences: newGuest.preferences
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),
      notes: newGuest.notes,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setGuests([...guests, guest])
    setNewGuest({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      dateOfBirth: "",
      idType: "",
      idNumber: "",
      preferences: "",
      notes: "",
    })
    setIsAddingGuest(false)
    setIsLoading(false)
  }

  const getStatusColor = (status: Guest["status"]) => {
    switch (status) {
      case "checked-in":
        return "bg-green-100 text-green-800"
      case "checked-out":
        return "bg-blue-100 text-blue-800"
      case "upcoming":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      searchTerm === "" ||
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === "all" || guest.status === activeTab

    return matchesSearch && matchesTab
  })

  const idTypes = ["Passport", "Driver's License", "National ID", "Other"]

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
                  <User className="h-6 w-6 text-blue-600" />
                  Guest Management
                </h1>
                <p className="text-sm text-gray-500">Manage guest profiles and information</p>
              </div>
            </div>
            <Dialog open={isAddingGuest} onOpenChange={setIsAddingGuest}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guest
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Guest</DialogTitle>
                  <DialogDescription>Create a new guest profile</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newGuest.firstName}
                        onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newGuest.lastName}
                        onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={newGuest.phone}
                        onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newGuest.address}
                      onChange={(e) => setNewGuest({ ...newGuest, address: e.target.value })}
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newGuest.city}
                        onChange={(e) => setNewGuest({ ...newGuest, city: e.target.value })}
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={newGuest.country}
                        onChange={(e) => setNewGuest({ ...newGuest, country: e.target.value })}
                        placeholder="USA"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={newGuest.dateOfBirth}
                        onChange={(e) => setNewGuest({ ...newGuest, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Type</Label>
                      <Select
                        value={newGuest.idType}
                        onValueChange={(value) => setNewGuest({ ...newGuest, idType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          {idTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input
                      id="idNumber"
                      value={newGuest.idNumber}
                      onChange={(e) => setNewGuest({ ...newGuest, idNumber: e.target.value })}
                      placeholder="A12345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences">Preferences (comma separated)</Label>
                    <Input
                      id="preferences"
                      value={newGuest.preferences}
                      onChange={(e) => setNewGuest({ ...newGuest, preferences: e.target.value })}
                      placeholder="Ocean View, Late Checkout, Extra Towels"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newGuest.notes}
                      onChange={(e) => setNewGuest({ ...newGuest, notes: e.target.value })}
                      placeholder="Any special notes about the guest..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleAddGuest} disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding Guest...
                        </>
                      ) : (
                        "Add Guest"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingGuest(false)} disabled={isLoading}>
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
              <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{guests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {guests.filter((g) => g.status === "checked-in").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {guests.filter((g) => g.status === "upcoming").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${guests.reduce((sum, g) => sum + g.totalSpent, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search guests by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guests Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Guests</CardTitle>
            <CardDescription>Manage your hotel guest profiles and information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="checked-in">Checked In</TabsTrigger>
                <TabsTrigger value="checked-out">Checked Out</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGuests.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {guest.firstName} {guest.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {guest.idType}: {guest.idNumber}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-gray-400" />
                                {guest.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                {guest.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              {guest.city}, {guest.country}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(guest.status)}>{guest.status.replace("-", " ")}</Badge>
                          </TableCell>
                          <TableCell>{guest.totalBookings}</TableCell>
                          <TableCell>${guest.totalSpent.toLocaleString()}</TableCell>
                          <TableCell>
                            {guest.lastVisit ? (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {guest.lastVisit}
                              </div>
                            ) : (
                              <span className="text-gray-400">Never</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditGuest(guest)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteGuest(guest.id)}>
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
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Guest</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this guest profile? This will also remove their booking history and cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteGuest}>
              Delete Guest
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit Guest Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Guest</DialogTitle>
            <DialogDescription>Update guest profile information</DialogDescription>
          </DialogHeader>
          {guestToEdit && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    value={guestToEdit.firstName}
                    onChange={(e) => setGuestToEdit({ ...guestToEdit, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={guestToEdit.lastName}
                    onChange={(e) => setGuestToEdit({ ...guestToEdit, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={guestToEdit.email}
                    onChange={(e) => setGuestToEdit({ ...guestToEdit, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    id="editPhone"
                    type="tel"
                    value={guestToEdit.phone}
                    onChange={(e) => setGuestToEdit({ ...guestToEdit, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editAddress">Address</Label>
                <Input
                  id="editAddress"
                  value={guestToEdit.address}
                  onChange={(e) => setGuestToEdit({ ...guestToEdit, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editCity">City</Label>
                  <Input
                    id="editCity"
                    value={guestToEdit.city}
                    onChange={(e) => setGuestToEdit({ ...guestToEdit, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCountry">Country</Label>
                  <Input
                    id="editCountry"
                    value={guestToEdit.country}
                    onChange={(e) => setGuestToEdit({ ...guestToEdit, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editDateOfBirth">Date of Birth</Label>
                  <Input
                    id="editDateOfBirth"
                    type="date"
                    value={guestToEdit.dateOfBirth}
                    onChange={(e) => setGuestToEdit({ ...guestToEdit, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editIdType">ID Type</Label>
                  <Select
                    value={guestToEdit.idType}
                    onValueChange={(value) => setGuestToEdit({ ...guestToEdit, idType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {idTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editIdNumber">ID Number</Label>
                <Input
                  id="editIdNumber"
                  value={guestToEdit.idNumber}
                  onChange={(e) => setGuestToEdit({ ...guestToEdit, idNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={guestToEdit.status}
                  onValueChange={(value: Guest["status"]) => setGuestToEdit({ ...guestToEdit, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="checked-in">Checked In</SelectItem>
                    <SelectItem value="checked-out">Checked Out</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editPreferences">Preferences (comma separated)</Label>
                <Input
                  id="editPreferences"
                  value={guestToEdit.preferences.join(", ")}
                  onChange={(e) =>
                    setGuestToEdit({
                      ...guestToEdit,
                      preferences: e.target.value
                        .split(",")
                        .map((p) => p.trim())
                        .filter((p) => p),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editNotes">Notes</Label>
                <Textarea
                  id="editNotes"
                  value={guestToEdit.notes}
                  onChange={(e) => setGuestToEdit({ ...guestToEdit, notes: e.target.value })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={saveEditGuest} disabled={isLoading} className="flex-1">
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
  )
}

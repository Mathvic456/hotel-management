"use client"

import { useState, useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Waves, Plus, Edit, Trash2, ArrowLeft, Dumbbell, Wifi, Coffee, Loader2, LogOut } from "lucide-react"
import Link from "next/link"
import { getFacilities, saveFacilities, formatCurrency } from "@/lib/storage"
import { logout } from "@/app/actions/auth"

interface Facility {
  id: string
  name: string
  description: string
  type: string
  hourlyRate?: number
  dailyRate?: number
  capacity?: number
  available: boolean
  operatingHours: {
    open: string
    close: string
  }
  amenities: string[]
  bookingRequired: boolean
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [isAddingFacility, setIsAddingFacility] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [facilityToDelete, setFacilityToDelete] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [facilityToEdit, setFacilityToEdit] = useState<Facility | null>(null)

  const [newFacility, setNewFacility] = useState({
    name: "",
    description: "",
    type: "",
    hourlyRate: 0,
    dailyRate: 0,
    capacity: 0,
    openTime: "09:00",
    closeTime: "18:00",
    amenities: "",
    bookingRequired: false,
  })

  // Generate default facilities
  const generateDefaultFacilities = (): Facility[] => [
    {
      id: "facility-1",
      name: "Swimming Pool",
      description: "Olympic-sized outdoor swimming pool with poolside service",
      type: "Recreation",
      hourlyRate: 2500,
      dailyRate: 15000,
      capacity: 50,
      available: true,
      operatingHours: { open: "06:00", close: "22:00" },
      amenities: ["Poolside Bar", "Towel Service", "Lifeguard"],
      bookingRequired: false,
    },
    {
      id: "facility-2",
      name: "Fitness Center",
      description: "Fully equipped gym with modern equipment and personal trainers",
      type: "Fitness",
      hourlyRate: 1500,
      dailyRate: 5000,
      capacity: 30,
      available: true,
      operatingHours: { open: "05:00", close: "23:00" },
      amenities: ["Personal Trainer", "Locker Room", "Towel Service"],
      bookingRequired: false,
    },
    {
      id: "facility-3",
      name: "Conference Hall",
      description: "Modern conference facility for business meetings and events",
      type: "Business",
      hourlyRate: 7500,
      dailyRate: 50000,
      capacity: 100,
      available: true,
      operatingHours: { open: "08:00", close: "20:00" },
      amenities: ["Projector", "Sound System", "WiFi", "Catering"],
      bookingRequired: true,
    },
  ]

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedFacilities = getFacilities()
    if (storedFacilities.length > 0) {
      setFacilities(storedFacilities)
    } else {
      const defaultFacilities = generateDefaultFacilities()
      setFacilities(defaultFacilities)
      saveFacilities(defaultFacilities)
    }
  }, [])

  // Update localStorage whenever facilities change
  const updateFacilities = (newFacilities: Facility[]) => {
    setFacilities(newFacilities)
    saveFacilities(newFacilities)
  }

  const handleEditFacility = (facility: Facility) => {
    setFacilityToEdit({ ...facility })
    setEditDialogOpen(true)
  }

  const saveEditFacility = async () => {
    if (facilityToEdit) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedFacilities = facilities.map((facility) =>
        facility.id === facilityToEdit.id ? facilityToEdit : facility,
      )
      updateFacilities(updatedFacilities)
      setEditDialogOpen(false)
      setFacilityToEdit(null)
      setIsLoading(false)
    }
  }

  const handleDeleteFacility = (facilityId: string) => {
    setFacilityToDelete(facilityId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteFacility = () => {
    if (facilityToDelete) {
      const updatedFacilities = facilities.filter((facility) => facility.id !== facilityToDelete)
      updateFacilities(updatedFacilities)
      setDeleteDialogOpen(false)
      setFacilityToDelete(null)
    }
  }

  const handleAddFacility = async () => {
    if (!newFacility.name || !newFacility.type) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const facility: Facility = {
      id: `facility-${Date.now()}`,
      name: newFacility.name,
      description: newFacility.description,
      type: newFacility.type,
      hourlyRate: newFacility.hourlyRate || undefined,
      dailyRate: newFacility.dailyRate || undefined,
      capacity: newFacility.capacity || undefined,
      available: true,
      operatingHours: {
        open: newFacility.openTime,
        close: newFacility.closeTime,
      },
      amenities: newFacility.amenities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a),
      bookingRequired: newFacility.bookingRequired,
    }

    const updatedFacilities = [...facilities, facility]
    updateFacilities(updatedFacilities)

    setNewFacility({
      name: "",
      description: "",
      type: "",
      hourlyRate: 0,
      dailyRate: 0,
      capacity: 0,
      openTime: "09:00",
      closeTime: "18:00",
      amenities: "",
      bookingRequired: false,
    })
    setIsAddingFacility(false)
    setIsLoading(false)
  }

  const getFacilityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "recreation":
        return <Waves className="h-5 w-5 text-blue-600" />
      case "fitness":
        return <Dumbbell className="h-5 w-5 text-red-600" />
      case "business":
        return <Coffee className="h-5 w-5 text-green-600" />
      default:
        return <Wifi className="h-5 w-5 text-gray-600" />
    }
  }

  const facilityTypes = ["Recreation", "Fitness", "Wellness", "Business", "Dining", "Entertainment"]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  <Waves className="h-6 w-6 text-purple-600" />
                  Facilities Management
                </h1>
                <p className="text-sm text-gray-500">Manage your hotel facilities and charges</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isAddingFacility} onOpenChange={setIsAddingFacility}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Facility
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Facility</DialogTitle>
                    <DialogDescription>Create a new facility for your hotel</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="facilityName">Facility Name *</Label>
                        <Input
                          id="facilityName"
                          value={newFacility.name}
                          onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                          placeholder="Conference Hall"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facilityType">Type *</Label>
                        <Select
                          value={newFacility.type}
                          onValueChange={(value) => setNewFacility({ ...newFacility, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {facilityTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facilityDescription">Description</Label>
                      <Textarea
                        id="facilityDescription"
                        value={newFacility.description}
                        onChange={(e) => setNewFacility({ ...newFacility, description: e.target.value })}
                        placeholder="Describe the facility and its features"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate (₦)</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          min="0"
                          step="500"
                          value={newFacility.hourlyRate}
                          onChange={(e) =>
                            setNewFacility({ ...newFacility, hourlyRate: Number.parseFloat(e.target.value) || 0 })
                          }
                          placeholder="2500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dailyRate">Daily Rate (₦)</Label>
                        <Input
                          id="dailyRate"
                          type="number"
                          min="0"
                          step="1000"
                          value={newFacility.dailyRate}
                          onChange={(e) =>
                            setNewFacility({ ...newFacility, dailyRate: Number.parseFloat(e.target.value) || 0 })
                          }
                          placeholder="15000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          min="1"
                          value={newFacility.capacity}
                          onChange={(e) =>
                            setNewFacility({ ...newFacility, capacity: Number.parseInt(e.target.value) || 0 })
                          }
                          placeholder="50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="openTime">Opening Time</Label>
                        <Input
                          id="openTime"
                          type="time"
                          value={newFacility.openTime}
                          onChange={(e) => setNewFacility({ ...newFacility, openTime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="closeTime">Closing Time</Label>
                        <Input
                          id="closeTime"
                          type="time"
                          value={newFacility.closeTime}
                          onChange={(e) => setNewFacility({ ...newFacility, closeTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amenities">Amenities (comma separated)</Label>
                      <Input
                        id="amenities"
                        value={newFacility.amenities}
                        onChange={(e) => setNewFacility({ ...newFacility, amenities: e.target.value })}
                        placeholder="WiFi, Sound System, Projector"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="bookingRequired"
                        checked={newFacility.bookingRequired}
                        onCheckedChange={(checked) => setNewFacility({ ...newFacility, bookingRequired: checked })}
                      />
                      <Label htmlFor="bookingRequired">Booking Required</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddFacility} disabled={isLoading} className="flex-1">
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Facility"
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingFacility(false)} disabled={isLoading}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{facilities.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{facilities.filter((f) => f.available).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Hourly Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {facilities.filter((f) => f.hourlyRate).length > 0
                  ? formatCurrency(
                      Math.round(
                        facilities.filter((f) => f.hourlyRate).reduce((sum, f) => sum + (f.hourlyRate || 0), 0) /
                          facilities.filter((f) => f.hourlyRate).length,
                      ),
                    )
                  : "₦0"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Booking Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {facilities.filter((f) => f.bookingRequired).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Facilities Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Facilities ({facilities.length})</CardTitle>
            <CardDescription>Complete overview of your hotel facilities</CardDescription>
          </CardHeader>
          <CardContent>
            {facilities.length === 0 ? (
              <div className="text-center py-8">
                <Waves className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first facility</p>
                <Button onClick={() => setIsAddingFacility(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Facility
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Hourly Rate</TableHead>
                      <TableHead>Daily Rate</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facilities.map((facility) => (
                      <TableRow key={facility.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFacilityIcon(facility.type)}
                            <div>
                              <div className="font-medium">{facility.name}</div>
                              <div className="text-sm text-gray-500">
                                {facility.operatingHours.open} - {facility.operatingHours.close}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{facility.type}</Badge>
                        </TableCell>
                        <TableCell>{facility.hourlyRate ? formatCurrency(facility.hourlyRate) : "-"}</TableCell>
                        <TableCell>{facility.dailyRate ? formatCurrency(facility.dailyRate) : "-"}</TableCell>
                        <TableCell>{facility.capacity ? `${facility.capacity} people` : "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              className={facility.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              {facility.available ? "Available" : "Unavailable"}
                            </Badge>
                            {facility.bookingRequired && (
                              <Badge variant="outline" className="text-xs">
                                Booking Required
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditFacility(facility)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteFacility(facility.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Facility</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this facility? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteFacility}>
              Delete Facility
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Facility</DialogTitle>
            <DialogDescription>Update facility information and pricing</DialogDescription>
          </DialogHeader>
          {facilityToEdit && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFacilityName">Facility Name</Label>
                  <Input
                    id="editFacilityName"
                    value={facilityToEdit.name}
                    onChange={(e) => setFacilityToEdit({ ...facilityToEdit, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editFacilityType">Type</Label>
                  <Select
                    value={facilityToEdit.type}
                    onValueChange={(value) => setFacilityToEdit({ ...facilityToEdit, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {facilityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editFacilityDescription">Description</Label>
                <Textarea
                  id="editFacilityDescription"
                  value={facilityToEdit.description}
                  onChange={(e) => setFacilityToEdit({ ...facilityToEdit, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editHourlyRate">Hourly Rate (₦)</Label>
                  <Input
                    id="editHourlyRate"
                    type="number"
                    min="0"
                    step="500"
                    value={facilityToEdit.hourlyRate || 0}
                    onChange={(e) =>
                      setFacilityToEdit({
                        ...facilityToEdit,
                        hourlyRate: Number.parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDailyRate">Daily Rate (₦)</Label>
                  <Input
                    id="editDailyRate"
                    type="number"
                    min="0"
                    step="1000"
                    value={facilityToEdit.dailyRate || 0}
                    onChange={(e) =>
                      setFacilityToEdit({
                        ...facilityToEdit,
                        dailyRate: Number.parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCapacity">Capacity</Label>
                  <Input
                    id="editCapacity"
                    type="number"
                    min="1"
                    value={facilityToEdit.capacity || 0}
                    onChange={(e) =>
                      setFacilityToEdit({ ...facilityToEdit, capacity: Number.parseInt(e.target.value) || undefined })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editOpenTime">Opening Time</Label>
                  <Input
                    id="editOpenTime"
                    type="time"
                    value={facilityToEdit.operatingHours.open}
                    onChange={(e) =>
                      setFacilityToEdit({
                        ...facilityToEdit,
                        operatingHours: { ...facilityToEdit.operatingHours, open: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCloseTime">Closing Time</Label>
                  <Input
                    id="editCloseTime"
                    type="time"
                    value={facilityToEdit.operatingHours.close}
                    onChange={(e) =>
                      setFacilityToEdit({
                        ...facilityToEdit,
                        operatingHours: { ...facilityToEdit.operatingHours, close: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editAmenities">Amenities (comma separated)</Label>
                <Input
                  id="editAmenities"
                  value={facilityToEdit.amenities.join(", ")}
                  onChange={(e) =>
                    setFacilityToEdit({
                      ...facilityToEdit,
                      amenities: e.target.value
                        .split(",")
                        .map((a) => a.trim())
                        .filter((a) => a),
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Available</Label>
                  <p className="text-sm text-gray-500">Facility is available for booking</p>
                </div>
                <Switch
                  checked={facilityToEdit.available}
                  onCheckedChange={(checked) => setFacilityToEdit({ ...facilityToEdit, available: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Booking Required</Label>
                  <p className="text-sm text-gray-500">Advance booking required</p>
                </div>
                <Switch
                  checked={facilityToEdit.bookingRequired}
                  onCheckedChange={(checked) => setFacilityToEdit({ ...facilityToEdit, bookingRequired: checked })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveEditFacility} disabled={isLoading} className="flex-1">
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

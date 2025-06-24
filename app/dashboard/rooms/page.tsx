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
import { Bed, Plus, Edit, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { getRooms, saveRooms, getOnboardingData } from "@/lib/storage"

interface Room {
  id: string
  number: string
  name: string
  type: string
  capacity: number
  price: number
  status: "available" | "occupied" | "maintenance"
  amenities: string[]
  description: string
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Generate default rooms based on onboarding data
  const generateDefaultRooms = (totalRooms: number) => {
    const rooms: Room[] = []
    const roomTypes = ["standard", "deluxe", "suite", "presidential"]
    const statuses: Room["status"][] = ["available", "occupied", "maintenance"]

    for (let i = 1; i <= Math.min(totalRooms, 6); i++) {
      const roomNumber = (100 + i).toString()
      const type = roomTypes[i % roomTypes.length]
      const status = i <= 2 ? statuses[i - 1] : "available"

      rooms.push({
        id: i.toString(),
        number: roomNumber,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Room ${roomNumber}`,
        type,
        capacity: type === "suite" || type === "presidential" ? 4 : 2,
        price: type === "presidential" ? 599 : type === "suite" ? 399 : type === "deluxe" ? 249 : 149,
        status,
        amenities:
          type === "suite" || type === "presidential"
            ? ["Ocean View", "Balcony", "Mini Bar", "WiFi"]
            : ["WiFi", "AC", "TV"],
        description: `Comfortable ${type} room with modern amenities`,
      })
    }
    return rooms
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedRooms = getRooms()
    if (storedRooms.length > 0) {
      setRooms(storedRooms)
    } else {
      // Generate default rooms if none exist
      const onboardingData = getOnboardingData()
      const totalRooms = onboardingData.totalRooms || 24
      const defaultRooms = generateDefaultRooms(totalRooms)
      setRooms(defaultRooms)
      saveRooms(defaultRooms)
    }
  }, [])

  // Update localStorage whenever rooms change
  const updateRooms = (newRooms: Room[]) => {
    setRooms(newRooms)
    saveRooms(newRooms)
  }

  const handleDeleteRoom = (roomId: string) => {
    setRoomToDelete(roomId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteRoom = async () => {
    if (roomToDelete) {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedRooms = rooms.filter((room) => room.id !== roomToDelete)
      updateRooms(updatedRooms)
      setDeleteDialogOpen(false)
      setRoomToDelete(null)
      setIsLoading(false)
    }
  }

  const handleEditRoom = (room: Room) => {
    setRoomToEdit({ ...room }) // Create a copy to avoid direct mutation
    setEditDialogOpen(true)
  }

  const saveEditRoom = async () => {
    if (roomToEdit) {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedRooms = rooms.map((room) => (room.id === roomToEdit.id ? roomToEdit : room))
      updateRooms(updatedRooms)
      setEditDialogOpen(false)
      setRoomToEdit(null)
      setIsLoading(false)
    }
  }

  const [isAddingRoom, setIsAddingRoom] = useState(false)
  const [newRoom, setNewRoom] = useState({
    number: "",
    name: "",
    type: "",
    capacity: 1,
    price: 0,
    amenities: "",
    description: "",
  })

  const handleAddRoom = async () => {
    if (!newRoom.number || !newRoom.name || !newRoom.type) {
      alert("Please fill in all required fields")
      return
    }

    // Check if room number already exists
    if (rooms.some((room) => room.number === newRoom.number)) {
      alert("Room number already exists")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const room: Room = {
      id: Date.now().toString(),
      number: newRoom.number,
      name: newRoom.name,
      type: newRoom.type,
      capacity: newRoom.capacity,
      price: newRoom.price,
      status: "available",
      amenities: newRoom.amenities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a),
      description: newRoom.description,
    }

    const updatedRooms = [...rooms, room]
    updateRooms(updatedRooms)
    setNewRoom({
      number: "",
      name: "",
      type: "",
      capacity: 1,
      price: 0,
      amenities: "",
      description: "",
    })
    setIsAddingRoom(false)
    setIsLoading(false)
  }

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                  <Bed className="h-6 w-6 text-blue-600" />
                  Room Management
                </h1>
                <p className="text-sm text-gray-500">Manage your hotel rooms and pricing</p>
              </div>
            </div>
            <Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                  <DialogDescription>Create a new room for your hotel inventory</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomNumber">Room Number *</Label>
                      <Input
                        id="roomNumber"
                        value={newRoom.number}
                        onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                        placeholder="101"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roomType">Room Type *</Label>
                      <Select value={newRoom.type} onValueChange={(value) => setNewRoom({ ...newRoom, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                          <SelectItem value="presidential">Presidential</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roomName">Room Name *</Label>
                    <Input
                      id="roomName"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      placeholder="Ocean View Suite"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        value={newRoom.capacity}
                        onChange={(e) => setNewRoom({ ...newRoom, capacity: Number.parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Night (₦)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="100"
                        value={newRoom.price}
                        onChange={(e) => setNewRoom({ ...newRoom, price: Number.parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities (comma separated)</Label>
                    <Input
                      id="amenities"
                      value={newRoom.amenities}
                      onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                      placeholder="Ocean View, Balcony, Mini Bar"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                      placeholder="Describe the room features and highlights"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddRoom} disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Room"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingRoom(false)} disabled={isLoading}>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rooms.length}</div>
              <p className="text-xs text-muted-foreground">rooms created</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {rooms.filter((r) => r.status === "available").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {rooms.filter((r) => r.status === "occupied").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦
                {rooms.length > 0
                  ? Math.round(rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length).toLocaleString()
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Rooms ({rooms.length})</CardTitle>
            <CardDescription>Manage your hotel room inventory and pricing</CardDescription>
          </CardHeader>
          <CardContent>
            {rooms.length === 0 ? (
              <div className="text-center py-8">
                <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first room</p>
                <Button onClick={() => setIsAddingRoom(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Room
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.number}</TableCell>
                      <TableCell>{room.name}</TableCell>
                      <TableCell className="capitalize">{room.type}</TableCell>
                      <TableCell>{room.capacity} guests</TableCell>
                      <TableCell>₦{room.price.toLocaleString()}/night</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditRoom(room)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Room</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this room? This action cannot be undone and may affect existing
                bookings.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteRoom} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Room"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Room Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
              <DialogDescription>Update room information and pricing</DialogDescription>
            </DialogHeader>
            {roomToEdit && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editRoomNumber">Room Number</Label>
                    <Input
                      id="editRoomNumber"
                      value={roomToEdit.number}
                      onChange={(e) => setRoomToEdit({ ...roomToEdit, number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editRoomType">Room Type</Label>
                    <Select
                      value={roomToEdit.type}
                      onValueChange={(value) => setRoomToEdit({ ...roomToEdit, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="deluxe">Deluxe</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                        <SelectItem value="presidential">Presidential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editRoomName">Room Name</Label>
                  <Input
                    id="editRoomName"
                    value={roomToEdit.name}
                    onChange={(e) => setRoomToEdit({ ...roomToEdit, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editCapacity">Capacity</Label>
                    <Input
                      id="editCapacity"
                      type="number"
                      min="1"
                      value={roomToEdit.capacity}
                      onChange={(e) => setRoomToEdit({ ...roomToEdit, capacity: Number.parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editPrice">Price per Night (₦)</Label>
                    <Input
                      id="editPrice"
                      type="number"
                      min="0"
                      step="100"
                      value={roomToEdit.price}
                      onChange={(e) => setRoomToEdit({ ...roomToEdit, price: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={roomToEdit.status}
                    onValueChange={(value: Room["status"]) => setRoomToEdit({ ...roomToEdit, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editAmenities">Amenities (comma separated)</Label>
                  <Input
                    id="editAmenities"
                    value={roomToEdit.amenities.join(", ")}
                    onChange={(e) =>
                      setRoomToEdit({
                        ...roomToEdit,
                        amenities: e.target.value
                          .split(",")
                          .map((a) => a.trim())
                          .filter((a) => a),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={roomToEdit.description}
                    onChange={(e) => setRoomToEdit({ ...roomToEdit, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEditRoom} disabled={isLoading} className="flex-1">
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

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Utensils, Plus, Edit, Trash2, ArrowLeft, Wine, Loader2 } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { getMenuItems, saveMenuItems } from "@/lib/storage"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  type: "food" | "drink"
  available: boolean
  allergens?: string[]
}

interface MenuCategory {
  id: string
  name: string
  description: string
  type: "food" | "drink"
}

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([
    { id: "1", name: "Appetizers", description: "Start your meal right", type: "food" },
    { id: "2", name: "Main Courses", description: "Hearty main dishes", type: "food" },
    { id: "3", name: "Desserts", description: "Sweet endings", type: "food" },
    { id: "4", name: "Cocktails", description: "Signature cocktails", type: "drink" },
    { id: "5", name: "Wine", description: "Fine wines", type: "drink" },
  ])

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedMenuItems = getMenuItems()
    if (storedMenuItems.length > 0) {
      setMenuItems(storedMenuItems)
    } else {
      // Generate default menu items if none exist
      const defaultMenuItems: MenuItem[] = [
        {
          id: "1",
          name: "Jollof Rice",
          description: "Nigerian spiced rice with chicken and vegetables",
          price: 2500,
          category: "Main Courses",
          type: "food",
          available: true,
          allergens: ["Gluten"],
        },
        {
          id: "2",
          name: "Suya",
          description: "Grilled spiced meat skewers",
          price: 1500,
          category: "Appetizers",
          type: "food",
          available: true,
          allergens: ["Nuts"],
        },
        {
          id: "3",
          name: "Chin Chin",
          description: "Sweet fried pastry cubes",
          price: 800,
          category: "Desserts",
          type: "food",
          available: true,
          allergens: ["Dairy", "Eggs", "Gluten"],
        },
        {
          id: "4",
          name: "Chapman",
          description: "Nigerian fruit cocktail with grenadine",
          price: 1200,
          category: "Cocktails",
          type: "drink",
          available: true,
        },
      ]
      setMenuItems(defaultMenuItems)
      saveMenuItems(defaultMenuItems)
    }
  }, [])

  // Update localStorage whenever menu items change
  const updateMenuItems = (newMenuItems: MenuItem[]) => {
    setMenuItems(newMenuItems)
    saveMenuItems(newMenuItems)
  }

  const [isAddingItem, setIsAddingItem] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [activeTab, setActiveTab] = useState("food")
  const [isLoading, setIsLoading] = useState(false)

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    type: "food" as "food" | "drink",
    allergens: "",
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    type: "food" as "food" | "drink",
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null)

  const handleEditItem = (item: MenuItem) => {
    setItemToEdit({ ...item })
    setEditDialogOpen(true)
  }

  const saveEditItem = async () => {
    if (itemToEdit) {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedMenuItems = menuItems.map((item) => (item.id === itemToEdit.id ? itemToEdit : item))
      updateMenuItems(updatedMenuItems)
      setEditDialogOpen(false)
      setItemToEdit(null)
      setIsLoading(false)
    }
  }

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      const updatedMenuItems = menuItems.filter((item) => item.id !== itemToDelete)
      updateMenuItems(updatedMenuItems)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.type) {
      alert("Please fill in all required fields")
      return
    }

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price: newItem.price,
      category: newItem.category,
      type: newItem.type,
      available: true,
      allergens: newItem.allergens ? newItem.allergens.split(",").map((a) => a.trim()) : [],
    }

    const updatedMenuItems = [...menuItems, item]
    updateMenuItems(updatedMenuItems)
    setNewItem({
      name: "",
      description: "",
      price: 0,
      category: "",
      type: "food",
      allergens: "",
    })
    setIsAddingItem(false)
  }

  const handleAddCategory = () => {
    const category: MenuCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      type: newCategory.type,
    }

    setCategories([...categories, category])
    setNewCategory({
      name: "",
      description: "",
      type: "food",
    })
    setIsAddingCategory(false)
  }

  const filteredItems = menuItems.filter((item) => item.type === activeTab)
  const filteredCategories = categories.filter((cat) => cat.type === activeTab)

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
                  <Utensils className="h-6 w-6 text-green-600" />
                  Menu Management
                </h1>
                <p className="text-sm text-gray-500">Manage your restaurant menu and pricing</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>Create a new menu category</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder="Nigerian Dishes"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Input
                        id="categoryDescription"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        placeholder="Traditional Nigerian cuisine"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryType">Type</Label>
                      <Select
                        value={newCategory.type}
                        onValueChange={(value: "food" | "drink") => setNewCategory({ ...newCategory, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="drink">Drink</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddCategory} className="flex-1">
                        Add Category
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Menu Item</DialogTitle>
                    <DialogDescription>Create a new item for your menu</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Item Name *</Label>
                      <Input
                        id="itemName"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Jollof Rice"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="itemDescription">Description</Label>
                      <Textarea
                        id="itemDescription"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Nigerian spiced rice with chicken and vegetables"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="itemPrice">Price (₦) *</Label>
                        <Input
                          id="itemPrice"
                          type="number"
                          min="0"
                          step="50"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemType">Type *</Label>
                        <Select
                          value={newItem.type}
                          onValueChange={(value: "food" | "drink") => setNewItem({ ...newItem, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="drink">Drink</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="itemCategory">Category *</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allergens">Allergens (comma separated)</Label>
                      <Input
                        id="allergens"
                        value={newItem.allergens}
                        onChange={(e) => setNewItem({ ...newItem, allergens: e.target.value })}
                        placeholder="Dairy, Gluten, Nuts"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddItem} className="flex-1">
                        Add Item
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItems.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Food Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {menuItems.filter((item) => item.type === "food").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Beverages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {menuItems.filter((item) => item.type === "drink").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>Manage your restaurant menu items and categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="food" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Food
                </TabsTrigger>
                <TabsTrigger value="drink" className="flex items-center gap-2">
                  <Wine className="h-4 w-4" />
                  Beverages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="food" className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Allergens</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>₦{item.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.allergens?.map((allergen, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="drink" className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>₦{item.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteItem}>
              Delete Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit Item Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>Update menu item information and pricing</DialogDescription>
          </DialogHeader>
          {itemToEdit && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editItemName">Item Name</Label>
                <Input
                  id="editItemName"
                  value={itemToEdit.name}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editItemDescription">Description</Label>
                <Textarea
                  id="editItemDescription"
                  value={itemToEdit.description}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editItemPrice">Price (₦)</Label>
                  <Input
                    id="editItemPrice"
                    type="number"
                    min="0"
                    step="50"
                    value={itemToEdit.price}
                    onChange={(e) => setItemToEdit({ ...itemToEdit, price: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editItemType">Type</Label>
                  <Select
                    value={itemToEdit.type}
                    onValueChange={(value: "food" | "drink") => setItemToEdit({ ...itemToEdit, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="drink">Drink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editItemCategory">Category</Label>
                <Select
                  value={itemToEdit.category}
                  onValueChange={(value) => setItemToEdit({ ...itemToEdit, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editAllergens">Allergens (comma separated)</Label>
                <Input
                  id="editAllergens"
                  value={itemToEdit.allergens?.join(", ") || ""}
                  onChange={(e) =>
                    setItemToEdit({
                      ...itemToEdit,
                      allergens: e.target.value
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
                  <p className="text-sm text-gray-500">Item is available for ordering</p>
                </div>
                <Switch
                  checked={itemToEdit.available}
                  onCheckedChange={(checked) => setItemToEdit({ ...itemToEdit, available: checked })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveEditItem} disabled={isLoading} className="flex-1">
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

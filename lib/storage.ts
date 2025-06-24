// Local storage utilities for hotel management system
export interface StorageData {
  rooms: any[]
  menuItems: any[]
  facilities: any[]
  bookings: any[]
  guests: any[]
  onboardingData: any
  userProfile: any
}

const STORAGE_KEY = "hotel-management-data"

// Get data from localStorage
export function getStorageData(): Partial<StorageData> {
  if (typeof window === "undefined") return {}

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return {}
  }
}

// Save data to localStorage
export function saveStorageData(data: Partial<StorageData>) {
  if (typeof window === "undefined") return

  try {
    const existingData = getStorageData()
    const updatedData = { ...existingData, ...data }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
    console.log("Data saved to localStorage:", Object.keys(data))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

// Clear all data
export function clearStorageData() {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log("All data cleared from localStorage")
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}

// Get specific data type with fallbacks
export function getRooms() {
  const data = getStorageData().rooms
  return Array.isArray(data) ? data : []
}

export function getMenuItems() {
  const data = getStorageData().menuItems
  return Array.isArray(data) ? data : []
}

export function getFacilities() {
  const data = getStorageData().facilities
  return Array.isArray(data) ? data : []
}

export function getBookings() {
  const data = getStorageData().bookings
  return Array.isArray(data) ? data : []
}

export function getGuests() {
  const data = getStorageData().guests
  return Array.isArray(data) ? data : []
}

export function getOnboardingData() {
  const data = getStorageData().onboardingData
  return data || {}
}

export function getUserProfile() {
  const data = getStorageData().userProfile
  return data || {}
}

// Save specific data type
export function saveRooms(rooms: any[]) {
  if (!Array.isArray(rooms)) {
    console.error("Invalid rooms data - must be array")
    return
  }
  saveStorageData({ rooms })
}

export function saveMenuItems(menuItems: any[]) {
  if (!Array.isArray(menuItems)) {
    console.error("Invalid menu items data - must be array")
    return
  }
  saveStorageData({ menuItems })
}

export function saveFacilities(facilities: any[]) {
  if (!Array.isArray(facilities)) {
    console.error("Invalid facilities data - must be array")
    return
  }
  saveStorageData({ facilities })
}

export function saveBookings(bookings: any[]) {
  if (!Array.isArray(bookings)) {
    console.error("Invalid bookings data - must be array")
    return
  }
  saveStorageData({ bookings })
}

export function saveGuests(guests: any[]) {
  if (!Array.isArray(guests)) {
    console.error("Invalid guests data - must be array")
    return
  }
  saveStorageData({ guests })
}

export function saveOnboardingData(onboardingData: any) {
  saveStorageData({ onboardingData })
}

export function saveUserProfile(userProfile: any) {
  saveStorageData({ userProfile })
}

// Utility functions
export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Data relationships
export function getBookingsByGuestId(guestId: string) {
  const bookings = getBookings()
  return bookings.filter((booking: any) => booking.guestId === guestId)
}

export function getRoomById(roomId: string) {
  const rooms = getRooms()
  return rooms.find((room: any) => room.id === roomId)
}

export function getGuestById(guestId: string) {
  const guests = getGuests()
  return guests.find((guest: any) => guest.id === guestId)
}

// Data export/import
export function exportAllData() {
  const data = getStorageData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `hotel-data-${new Date().toISOString().split("T")[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importData(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        saveStorageData(data)
        resolve(true)
      } catch (error) {
        console.error("Error importing data:", error)
        resolve(false)
      }
    }
    reader.readAsText(file)
  })
}

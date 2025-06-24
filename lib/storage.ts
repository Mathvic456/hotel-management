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
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

// Clear all data
export function clearStorageData() {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}

// Get specific data type
export function getRooms() {
  return getStorageData().rooms || []
}

export function getMenuItems() {
  return getStorageData().menuItems || []
}

export function getFacilities() {
  return getStorageData().facilities || []
}

export function getBookings() {
  return getStorageData().bookings || []
}

export function getGuests() {
  return getStorageData().guests || []
}

export function getOnboardingData() {
  return getStorageData().onboardingData || {}
}

// Save specific data type
export function saveRooms(rooms: any[]) {
  saveStorageData({ rooms })
}

export function saveMenuItems(menuItems: any[]) {
  saveStorageData({ menuItems })
}

export function saveFacilities(facilities: any[]) {
  saveStorageData({ facilities })
}

export function saveBookings(bookings: any[]) {
  saveStorageData({ bookings })
}

export function saveGuests(guests: any[]) {
  saveStorageData({ guests })
}

export function saveOnboardingData(onboardingData: any) {
  saveStorageData({ onboardingData })
}

"use server"

import { redirect } from "next/navigation"

interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
  hotelName: string
  phone: string
}

interface OnboardingData {
  // Hotel Details
  hotelType: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  website?: string
  description: string

  // Operational Details
  checkInTime: string
  checkOutTime: string
  currency: string
  timezone: string

  // Initial Setup
  totalRooms: number
  hasRestaurant: boolean
  hasSpa: boolean
  hasGym: boolean
  hasPool: boolean
  hasGolf: boolean

  // Pricing
  averageRoomRate: number
  seasonalPricing: boolean
}

// Add test accounts at the top after the interfaces
const testAccounts = [
  {
    id: "test-user-1",
    email: "admin@grandhotel.ng",
    password: "admin123",
    firstName: "Adebayo",
    lastName: "Ogundimu",
    hotelName: "Grand Hotel Lagos",
    phone: "+234 801 234 5678",
    createdAt: new Date().toISOString(),
  },
  {
    id: "test-user-2",
    email: "manager@resortabuja.ng",
    password: "manager123",
    firstName: "Fatima",
    lastName: "Ibrahim",
    hotelName: "Luxury Resort Abuja",
    phone: "+234 802 345 6789",
    createdAt: new Date().toISOString(),
  },
]

// Simulate user storage (in real app, this would be a database)
const users = new Map()

// Initialize users Map with test accounts
testAccounts.forEach((account) => {
  users.set(account.email, account)
})

const onboardingData = new Map()

// Add test onboarding data for the test accounts
const testOnboardingData = {
  "test-user-1": {
    hotelType: "hotel",
    address: "123 Victoria Island",
    city: "Ikeja",
    state: "Lagos",
    country: "Nigeria",
    zipCode: "100001",
    website: "https://grandhotel.ng",
    description: "Luxury hotel in the heart of Lagos",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    currency: "NGN",
    timezone: "Africa/Lagos",
    totalRooms: 50,
    hasRestaurant: true,
    hasSpa: true,
    hasGym: true,
    hasPool: true,
    hasGolf: false,
    averageRoomRate: 45000,
    seasonalPricing: true,
    completed: true,
    completedAt: new Date().toISOString(),
  },
  "test-user-2": {
    hotelType: "resort",
    address: "456 Central Business District",
    city: "Abuja",
    state: "Federal Capital Territory",
    country: "Nigeria",
    zipCode: "900001",
    website: "https://resortabuja.ng",
    description: "Premium resort in Nigeria's capital",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    currency: "NGN",
    timezone: "Africa/Lagos",
    totalRooms: 75,
    hasRestaurant: true,
    hasSpa: true,
    hasGym: true,
    hasPool: true,
    hasGolf: true,
    averageRoomRate: 65000,
    seasonalPricing: true,
    completed: true,
    completedAt: new Date().toISOString(),
  },
}

// Initialize onboardingData Map with test data
testAccounts.forEach((account) => {
  onboardingData.set(account.id, testOnboardingData[account.id])
})

export async function signup(formData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const data: SignupData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    hotelName: formData.get("hotelName") as string,
    phone: formData.get("phone") as string,
  }

  // Basic validation
  if (!data.email || !data.password || !data.firstName || !data.lastName || !data.hotelName) {
    return { error: "All fields are required" }
  }

  // Check if user already exists
  if (users.has(data.email)) {
    return { error: "User already exists with this email" }
  }

  // Create user
  const userId = Date.now().toString()
  users.set(data.email, {
    id: userId,
    ...data,
    createdAt: new Date().toISOString(),
  })

  // Store user ID in a cookie (in real app, use proper session management)
  const response = new Response()
  response.headers.set("Set-Cookie", `userId=${userId}; Path=/; HttpOnly; Max-Age=86400`)

  // Redirect to onboarding
  redirect("/onboarding")
}

export async function saveOnboardingStep(step: number, data: any) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In real app, get user ID from session
  const userId = "temp-user-id"

  const existingData = onboardingData.get(userId) || {}
  onboardingData.set(userId, {
    ...existingData,
    [`step${step}`]: data,
    lastUpdated: new Date().toISOString(),
  })

  return { success: true }
}

export async function completeOnboarding(finalData: OnboardingData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // In real app, get user ID from session
  const userId = "temp-user-id"

  // Save complete onboarding data
  onboardingData.set(userId, {
    ...finalData,
    completed: true,
    completedAt: new Date().toISOString(),
  })

  // Also save to localStorage for persistence
  if (typeof window !== "undefined") {
    try {
      const { saveOnboardingData } = await import("@/lib/storage")
      saveOnboardingData(finalData)
    } catch (error) {
      console.error("Error saving onboarding data to localStorage:", error)
    }
  }

  // Redirect to dashboard
  redirect("/dashboard")
}

export async function login(formData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const user = users.get(email)
  if (!user || user.password !== password) {
    return { error: "Invalid email or password" }
  }

  // Check if onboarding is completed
  const userOnboarding = onboardingData.get(user.id)
  if (!userOnboarding?.completed) {
    redirect("/onboarding")
  } else {
    redirect("/dashboard")
  }
}

// Add logout function at the end
export async function logout() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, you would clear server-side session here
  // For now, we'll just redirect to login
  redirect("/auth/login")
}

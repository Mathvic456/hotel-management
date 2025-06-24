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

// Simulate user storage (in real app, this would be a database)
const users = new Map()
const onboardingData = new Map()

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

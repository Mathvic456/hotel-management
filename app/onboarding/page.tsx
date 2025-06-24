"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Hotel,
  MapPin,
  Clock,
  DollarSign,
  Utensils,
  Waves,
  Dumbbell,
  TreePine,
  Loader2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import { saveOnboardingStep, completeOnboarding } from "@/app/actions/auth"
import { NIGERIAN_STATES, getStateCapital } from "@/lib/nigeria-data"

interface OnboardingData {
  // Step 1: Hotel Details
  hotelType: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  website: string
  description: string

  // Step 2: Operational Details
  checkInTime: string
  checkOutTime: string
  currency: string
  timezone: string

  // Step 3: Facilities & Services
  totalRooms: number
  hasRestaurant: boolean
  hasSpa: boolean
  hasGym: boolean
  hasPool: boolean
  hasGolf: boolean
  hasParking: boolean
  hasWifi: boolean
  hasPetPolicy: boolean

  // Step 4: Pricing & Policies
  averageRoomRate: number
  seasonalPricing: boolean
  cancellationPolicy: string
  depositRequired: boolean
  depositAmount: number
}

const steps = [
  { id: 1, title: "Hotel Details", description: "Basic information about your hotel" },
  { id: 2, title: "Operations", description: "Operational settings and preferences" },
  { id: 3, title: "Facilities", description: "Available facilities and services" },
  { id: 4, title: "Pricing", description: "Pricing structure and policies" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    // Step 1
    hotelType: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    zipCode: "",
    website: "",
    description: "",

    // Step 2
    checkInTime: "15:00",
    checkOutTime: "11:00",
    currency: "NGN",
    timezone: "Africa/Lagos",

    // Step 3
    totalRooms: 10,
    hasRestaurant: false,
    hasSpa: false,
    hasGym: false,
    hasPool: false,
    hasGolf: false,
    hasParking: true,
    hasWifi: true,
    hasPetPolicy: false,

    // Step 4
    averageRoomRate: 25000,
    seasonalPricing: false,
    cancellationPolicy: "flexible",
    depositRequired: true,
    depositAmount: 10000,
  })

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  // Auto-fill city when state is selected
  const handleStateChange = (state: string) => {
    const capital = getStateCapital(state)
    updateData({ state, city: capital })
  }

  const handleNext = async () => {
    setIsLoading(true)

    try {
      await saveOnboardingStep(currentStep, data)

      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      } else {
        await completeOnboarding(data)
      }
    } catch (error) {
      console.error("Error saving step:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / steps.length) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Hotel className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Tell us about your hotel</h2>
              <p className="text-gray-600">We'll use this information to customize your experience</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hotelType">Hotel Type</Label>
                <Select value={data.hotelType} onValueChange={(value) => updateData({ hotelType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hotel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                    <SelectItem value="motel">Motel</SelectItem>
                    <SelectItem value="inn">Inn</SelectItem>
                    <SelectItem value="boutique">Boutique Hotel</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="bnb">Bed & Breakfast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => updateData({ address: e.target.value })}
                  placeholder="123 Victoria Island"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={data.state} onValueChange={handleStateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map((stateData) => (
                        <SelectItem key={stateData.state} value={stateData.state}>
                          {stateData.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => updateData({ city: e.target.value })}
                    placeholder="Lagos"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value="Nigeria" disabled className="bg-gray-100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={data.zipCode}
                    onChange={(e) => updateData({ zipCode: e.target.value })}
                    placeholder="100001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  value={data.website}
                  onChange={(e) => updateData({ website: e.target.value })}
                  placeholder="https://www.yourhotel.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Hotel Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => updateData({ description: e.target.value })}
                  placeholder="Describe your hotel, its unique features, and what makes it special..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Operational Settings</h2>
              <p className="text-gray-600">Configure your hotel's operational preferences</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkInTime">Check-in Time</Label>
                  <Input
                    id="checkInTime"
                    type="time"
                    value={data.checkInTime}
                    onChange={(e) => updateData({ checkInTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOutTime">Check-out Time</Label>
                  <Input
                    id="checkOutTime"
                    type="time"
                    value={data.checkOutTime}
                    onChange={(e) => updateData({ checkOutTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={data.currency} onValueChange={(value) => updateData({ currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={data.timezone} onValueChange={(value) => updateData({ timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">West Africa Time (WAT)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalRooms">Total Number of Rooms</Label>
                <Input
                  id="totalRooms"
                  type="number"
                  min="1"
                  max="1000"
                  value={data.totalRooms}
                  onChange={(e) => updateData({ totalRooms: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Waves className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Facilities & Services</h2>
              <p className="text-gray-600">What facilities and services does your hotel offer?</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Main Facilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Utensils className="h-5 w-5 text-orange-600" />
                      <div>
                        <Label>Restaurant</Label>
                        <p className="text-sm text-gray-500">On-site dining</p>
                      </div>
                    </div>
                    <Switch
                      checked={data.hasRestaurant}
                      onCheckedChange={(checked) => updateData({ hasRestaurant: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Waves className="h-5 w-5 text-blue-600" />
                      <div>
                        <Label>Swimming Pool</Label>
                        <p className="text-sm text-gray-500">Pool facilities</p>
                      </div>
                    </div>
                    <Switch checked={data.hasPool} onCheckedChange={(checked) => updateData({ hasPool: checked })} />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Dumbbell className="h-5 w-5 text-red-600" />
                      <div>
                        <Label>Fitness Center</Label>
                        <p className="text-sm text-gray-500">Gym facilities</p>
                      </div>
                    </div>
                    <Switch checked={data.hasGym} onCheckedChange={(checked) => updateData({ hasGym: checked })} />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Waves className="h-5 w-5 text-green-600" />
                      <div>
                        <Label>Spa & Wellness</Label>
                        <p className="text-sm text-gray-500">Spa services</p>
                      </div>
                    </div>
                    <Switch checked={data.hasSpa} onCheckedChange={(checked) => updateData({ hasSpa: checked })} />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <TreePine className="h-5 w-5 text-green-700" />
                      <div>
                        <Label>Golf Course</Label>
                        <p className="text-sm text-gray-500">Golf facilities</p>
                      </div>
                    </div>
                    <Switch checked={data.hasGolf} onCheckedChange={(checked) => updateData({ hasGolf: checked })} />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <Label>Parking</Label>
                        <p className="text-sm text-gray-500">Parking facilities</p>
                      </div>
                    </div>
                    <Switch
                      checked={data.hasParking}
                      onCheckedChange={(checked) => updateData({ hasParking: checked })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Additional Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Free WiFi</Label>
                      <p className="text-sm text-gray-500">Complimentary internet</p>
                    </div>
                    <Switch checked={data.hasWifi} onCheckedChange={(checked) => updateData({ hasWifi: checked })} />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Pet Friendly</Label>
                      <p className="text-sm text-gray-500">Pets allowed</p>
                    </div>
                    <Switch
                      checked={data.hasPetPolicy}
                      onCheckedChange={(checked) => updateData({ hasPetPolicy: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Pricing & Policies</h2>
              <p className="text-gray-600">Set up your pricing structure and booking policies</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="averageRoomRate">Average Room Rate (per night)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
                  <Input
                    id="averageRoomRate"
                    type="number"
                    min="0"
                    step="1000"
                    value={data.averageRoomRate}
                    onChange={(e) => updateData({ averageRoomRate: Number.parseFloat(e.target.value) })}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Seasonal Pricing</Label>
                  <p className="text-sm text-gray-500">Different rates for peak/off-peak seasons</p>
                </div>
                <Switch
                  checked={data.seasonalPricing}
                  onCheckedChange={(checked) => updateData({ seasonalPricing: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                <Select
                  value={data.cancellationPolicy}
                  onValueChange={(value) => updateData({ cancellationPolicy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible - Free cancellation 24 hours before</SelectItem>
                    <SelectItem value="moderate">Moderate - Free cancellation 5 days before</SelectItem>
                    <SelectItem value="strict">Strict - Free cancellation 14 days before</SelectItem>
                    <SelectItem value="super-strict">Super Strict - 50% refund up to 30 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Require Deposit</Label>
                  <p className="text-sm text-gray-500">Require deposit for bookings</p>
                </div>
                <Switch
                  checked={data.depositRequired}
                  onCheckedChange={(checked) => updateData({ depositRequired: checked })}
                />
              </div>

              {data.depositRequired && (
                <div className="space-y-2">
                  <Label htmlFor="depositAmount">Deposit Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
                    <Input
                      id="depositAmount"
                      type="number"
                      min="0"
                      step="1000"
                      value={data.depositAmount}
                      onChange={(e) => updateData({ depositAmount: Number.parseFloat(e.target.value) })}
                      className="pl-8"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl">Hotel Setup</CardTitle>
              <CardDescription>
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">{Math.round(progress)}% Complete</div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent>
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isLoading}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button onClick={handleNext} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {currentStep === steps.length ? "Completing Setup..." : "Saving..."}
                </>
              ) : currentStep === steps.length ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

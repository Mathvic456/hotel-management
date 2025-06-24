"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Settings, ArrowLeft, Hotel, Bell, CreditCard, Shield, Users, Loader2, Save } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    hotelName: "Grand Hotel & Resort",
    address: "123 Ocean Drive, Miami Beach, FL 33139",
    phone: "+1 (305) 555-0123",
    email: "info@grandhotel.com",
    website: "www.grandhotel.com",
    description: "Luxury beachfront resort with world-class amenities and exceptional service.",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    currency: "USD",
    timezone: "America/New_York",
    language: "en",
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingConfirmations: true,
    paymentAlerts: true,
    maintenanceAlerts: true,
    guestMessages: true,
    dailyReports: false,
    weeklyReports: true,
    monthlyReports: true,
  })

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCreditCards: true,
    acceptDebitCards: true,
    acceptPayPal: false,
    acceptCrypto: false,
    requireDeposit: true,
    depositAmount: 100,
    depositPercentage: false,
    cancellationPolicy: "flexible",
    refundPolicy: "7-days",
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: false,
    auditLogs: true,
    dataEncryption: true,
    backupFrequency: "daily",
  })

  // Staff Settings
  const [staffSettings, setStaffSettings] = useState({
    maxStaffAccounts: 25,
    defaultRole: "staff",
    requireApproval: true,
    allowSelfRegistration: false,
    sessionDuration: 8,
    shiftReminders: true,
  })

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    // Show success message (you could add a toast here)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Settings className="h-6 w-6 text-gray-600" />
                Settings
              </h1>
              <p className="text-sm text-gray-500">Manage your hotel configuration and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Information</CardTitle>
                  <CardDescription>Basic information about your hotel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hotelName">Hotel Name</Label>
                      <Input
                        id="hotelName"
                        value={generalSettings.hotelName}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, hotelName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={generalSettings.website}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, website: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={generalSettings.phone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={generalSettings.email}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={generalSettings.description}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operational Settings</CardTitle>
                  <CardDescription>Check-in/out times and other operational preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkInTime">Check-in Time</Label>
                      <Input
                        id="checkInTime"
                        type="time"
                        value={generalSettings.checkInTime}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, checkInTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOutTime">Check-out Time</Label>
                      <Input
                        id="checkOutTime"
                        type="time"
                        value={generalSettings.checkOutTime}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, checkOutTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={generalSettings.currency}
                        onValueChange={(value) => setGeneralSettings({ ...generalSettings, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={generalSettings.timezone}
                        onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={generalSettings.language}
                        onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSettings("general")} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Communication Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive browser push notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Event Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Booking Confirmations</Label>
                        <p className="text-sm text-gray-500">New booking confirmations</p>
                      </div>
                      <Switch
                        checked={notificationSettings.bookingConfirmations}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, bookingConfirmations: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Payment Alerts</Label>
                        <p className="text-sm text-gray-500">Payment received and failed notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.paymentAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, paymentAlerts: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Alerts</Label>
                        <p className="text-sm text-gray-500">Room and facility maintenance notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.maintenanceAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, maintenanceAlerts: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Guest Messages</Label>
                        <p className="text-sm text-gray-500">Messages from guests</p>
                      </div>
                      <Switch
                        checked={notificationSettings.guestMessages}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, guestMessages: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Report Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Reports</Label>
                        <p className="text-sm text-gray-500">Daily occupancy and revenue reports</p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyReports}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, dailyReports: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Reports</Label>
                        <p className="text-sm text-gray-500">Weekly performance summaries</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Monthly Reports</Label>
                        <p className="text-sm text-gray-500">Monthly financial and operational reports</p>
                      </div>
                      <Switch
                        checked={notificationSettings.monthlyReports}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, monthlyReports: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("notifications")} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Configure accepted payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Credit Cards</Label>
                        <p className="text-sm text-gray-500">Visa, MasterCard, American Express</p>
                      </div>
                      <Switch
                        checked={paymentSettings.acceptCreditCards}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({ ...paymentSettings, acceptCreditCards: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Debit Cards</Label>
                        <p className="text-sm text-gray-500">Bank debit cards</p>
                      </div>
                      <Switch
                        checked={paymentSettings.acceptDebitCards}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({ ...paymentSettings, acceptDebitCards: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>PayPal</Label>
                        <p className="text-sm text-gray-500">PayPal payments</p>
                      </div>
                      <Switch
                        checked={paymentSettings.acceptPayPal}
                        onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, acceptPayPal: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Cryptocurrency</Label>
                        <p className="text-sm text-gray-500">Bitcoin, Ethereum</p>
                      </div>
                      <Switch
                        checked={paymentSettings.acceptCrypto}
                        onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, acceptCrypto: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deposit & Policies</CardTitle>
                  <CardDescription>Configure deposit requirements and policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Deposit</Label>
                      <p className="text-sm text-gray-500">Require deposit for bookings</p>
                    </div>
                    <Switch
                      checked={paymentSettings.requireDeposit}
                      onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, requireDeposit: checked })}
                    />
                  </div>

                  {paymentSettings.requireDeposit && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="depositAmount">Deposit Amount ($)</Label>
                        <Input
                          id="depositAmount"
                          type="number"
                          min="0"
                          value={paymentSettings.depositAmount}
                          onChange={(e) =>
                            setPaymentSettings({ ...paymentSettings, depositAmount: Number.parseFloat(e.target.value) })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="depositType">Deposit Type</Label>
                        <Select
                          value={paymentSettings.depositPercentage ? "percentage" : "fixed"}
                          onValueChange={(value) =>
                            setPaymentSettings({ ...paymentSettings, depositPercentage: value === "percentage" })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                      <Select
                        value={paymentSettings.cancellationPolicy}
                        onValueChange={(value) => setPaymentSettings({ ...paymentSettings, cancellationPolicy: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flexible">Flexible</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="strict">Strict</SelectItem>
                          <SelectItem value="super-strict">Super Strict</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="refundPolicy">Refund Policy</Label>
                      <Select
                        value={paymentSettings.refundPolicy}
                        onValueChange={(value) => setPaymentSettings({ ...paymentSettings, refundPolicy: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7-days">7 Days</SelectItem>
                          <SelectItem value="14-days">14 Days</SelectItem>
                          <SelectItem value="30-days">30 Days</SelectItem>
                          <SelectItem value="no-refund">No Refund</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSettings("payments")} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication & Access</CardTitle>
                  <CardDescription>Configure security and authentication settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min="5"
                        max="480"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) =>
                          setSecuritySettings({ ...securitySettings, sessionTimeout: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        min="30"
                        max="365"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) =>
                          setSecuritySettings({ ...securitySettings, passwordExpiry: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                      <Input
                        id="loginAttempts"
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.loginAttempts}
                        onChange={(e) =>
                          setSecuritySettings({ ...securitySettings, loginAttempts: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <Select
                        value={securitySettings.backupFrequency}
                        onValueChange={(value) => setSecuritySettings({ ...securitySettings, backupFrequency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>IP Whitelist</Label>
                        <p className="text-sm text-gray-500">Restrict access to specific IP addresses</p>
                      </div>
                      <Switch
                        checked={securitySettings.ipWhitelist}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({ ...securitySettings, ipWhitelist: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Audit Logs</Label>
                        <p className="text-sm text-gray-500">Keep detailed logs of all system activities</p>
                      </div>
                      <Switch
                        checked={securitySettings.auditLogs}
                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogs: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Encryption</Label>
                        <p className="text-sm text-gray-500">Encrypt sensitive data at rest</p>
                      </div>
                      <Switch
                        checked={securitySettings.dataEncryption}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({ ...securitySettings, dataEncryption: checked })
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSettings("security")} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Staff Settings */}
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Configure staff accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxStaffAccounts">Maximum Staff Accounts</Label>
                    <Input
                      id="maxStaffAccounts"
                      type="number"
                      min="1"
                      max="100"
                      value={staffSettings.maxStaffAccounts}
                      onChange={(e) =>
                        setStaffSettings({ ...staffSettings, maxStaffAccounts: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultRole">Default Role</Label>
                    <Select
                      value={staffSettings.defaultRole}
                      onValueChange={(value) => setStaffSettings({ ...staffSettings, defaultRole: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Approval</Label>
                      <p className="text-sm text-gray-500">New staff accounts require admin approval</p>
                    </div>
                    <Switch
                      checked={staffSettings.requireApproval}
                      onCheckedChange={(checked) => setStaffSettings({ ...staffSettings, requireApproval: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Self Registration</Label>
                      <p className="text-sm text-gray-500">Staff can create their own accounts</p>
                    </div>
                    <Switch
                      checked={staffSettings.allowSelfRegistration}
                      onCheckedChange={(checked) =>
                        setStaffSettings({ ...staffSettings, allowSelfRegistration: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Shift Reminders</Label>
                      <p className="text-sm text-gray-500">Send reminders for upcoming shifts</p>
                    </div>
                    <Switch
                      checked={staffSettings.shiftReminders}
                      onCheckedChange={(checked) => setStaffSettings({ ...staffSettings, shiftReminders: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionDuration">Default Session Duration (hours)</Label>
                  <Input
                    id="sessionDuration"
                    type="number"
                    min="1"
                    max="24"
                    value={staffSettings.sessionDuration}
                    onChange={(e) =>
                      setStaffSettings({ ...staffSettings, sessionDuration: Number.parseInt(e.target.value) })
                    }
                  />
                </div>

                <Button onClick={() => handleSaveSettings("staff")} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Hotel, Settings, CheckCircle, LogOut } from "lucide-react"
import Link from "next/link"
import { logout } from "@/app/actions/auth"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  hotelName?: string
}

export function DashboardHeader({ title, subtitle, hotelName = "Your Hotel" }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Hotel className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-sm text-gray-500">{subtitle || `${hotelName} • Management`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <form action={logout}>
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}

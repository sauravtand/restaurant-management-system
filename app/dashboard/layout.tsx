"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, user, restaurant } = useAuth()
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Only check authentication after the initial auth state is loaded
    if (!isLoading) {
      console.log("Dashboard layout - Auth state:", {
        isAuthenticated,
        user: user?.name,
        role: user?.role,
        restaurant: restaurant?.name,
      })

      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login...")
        router.push("/")
      }

      setIsCheckingAuth(false)
    }
  }, [isAuthenticated, isLoading, router, user, restaurant])

  // Show loading state while checking authentication
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // Render dashboard if authenticated
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

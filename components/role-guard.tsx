"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallbackPath?: string
}

export default function RoleGuard({ children, allowedRoles, fallbackPath = "/dashboard" }: RoleGuardProps) {
  const { user, hasRole, isAuthenticated } = useAuth()
  const router = useRouter()

  const hasAccess = hasRole(allowedRoles)

  useEffect(() => {
    if (isAuthenticated && !hasAccess) {
      console.log("Access denied: User role not allowed", {
        userRole: user?.role,
        allowedRoles,
      })
      router.push(fallbackPath)
    }
  }, [isAuthenticated, hasAccess, router, fallbackPath, user?.role, allowedRoles])

  if (!isAuthenticated) {
    return null
  }

  if (!hasAccess) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You don't have permission to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}

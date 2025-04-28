"use client"

import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthDebugger() {
  const { user, restaurant, isAuthenticated, isLoading } = useAuth()

  return (
    <Card className="max-w-md mx-auto my-4">
      <CardHeader>
        <CardTitle>Auth Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
          </div>
          <div>
            <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
          </div>
          <div>
            <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "Not logged in"}
          </div>
          <div>
            <strong>Restaurant:</strong> {restaurant ? restaurant.name : "None"}
          </div>
          <div>
            <strong>Restaurant Code:</strong> {restaurant ? restaurant.code : "None"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

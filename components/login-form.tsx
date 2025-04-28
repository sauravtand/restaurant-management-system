"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [restaurantCode, setRestaurantCode] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !restaurantCode) {
      setError("All fields are required")
      return
    }

    try {
      console.log("Submitting login form:", { email, restaurantCode })
      const success = await login(email, password, restaurantCode)

      if (success) {
        console.log("Login successful, redirecting to dashboard...")
        // Use a small delay to ensure state is updated before navigation
        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your restaurant dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurantCode">Restaurant Code</Label>
            <Input
              id="restaurantCode"
              placeholder="e.g. REST001"
              value={restaurantCode}
              onChange={(e) => setRestaurantCode(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Demo credentials:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full text-sm">
          <Card className="p-3">
            <p className="font-semibold">Italiano Delizioso (REST001)</p>
            <p>Email: john@example.com</p>
            <p>Password: password</p>
            <p>Code: REST001</p>
          </Card>
          <Card className="p-3">
            <p className="font-semibold">Sushi Paradise (REST002)</p>
            <p>Email: akira@example.com</p>
            <p>Password: password</p>
            <p>Code: REST002</p>
          </Card>
        </div>
      </CardFooter>
    </Card>
  )
}

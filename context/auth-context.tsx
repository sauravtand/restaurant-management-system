"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authenticateUser, verifyRestaurantAccess, hasRole } from "@/lib/auth-service"
import type { Restaurant, User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  restaurant: Restaurant | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, restaurantCode: string) => Promise<boolean>
  logout: () => void
  hasAccess: (restaurantCode: string) => boolean
  hasRole: (roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved auth on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user")
      const savedRestaurant = localStorage.getItem("restaurant")

      if (savedUser && savedRestaurant) {
        const parsedUser = JSON.parse(savedUser)
        const parsedRestaurant = JSON.parse(savedRestaurant)

        setUser(parsedUser)
        setRestaurant(parsedRestaurant)
        setIsAuthenticated(true)

        console.log("Auth restored from localStorage:", {
          user: parsedUser,
          restaurantCode: parsedRestaurant.code,
          isAuthenticated: true,
        })
      }
    } catch (error) {
      console.error("Error restoring auth from localStorage:", error)
      // Clear potentially corrupted storage
      localStorage.removeItem("user")
      localStorage.removeItem("restaurant")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string, restaurantCode: string) => {
    try {
      setIsLoading(true)
      console.log("Attempting login:", { email, restaurantCode })

      const { user, restaurant } = await authenticateUser(email, password, restaurantCode)

      if (user && restaurant) {
        // Set state first
        setUser(user)
        setRestaurant(restaurant)
        setIsAuthenticated(true)

        // Then save to localStorage
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("restaurant", JSON.stringify(restaurant))

        console.log("Login successful, state updated:", {
          isAuthenticated: true,
          user,
          restaurant,
        })

        return true
      }

      console.log("Login failed: Invalid credentials")
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setRestaurant(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("restaurant")
    console.log("Logged out, auth state cleared")
  }

  // Check if user has access to a specific restaurant
  const hasAccess = (restaurantCode: string) => {
    return verifyRestaurantAccess(user, restaurantCode)
  }

  // Check if user has one of the required roles
  const checkRole = (roles: string[]) => {
    return hasRole(user, roles)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        restaurant,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasAccess: hasAccess,
        hasRole: checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

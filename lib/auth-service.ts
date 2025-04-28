import type { User } from "./types"
import { mockUsers, mockRestaurants } from "./mock-data"

export async function authenticateUser(email: string, password: string, restaurantCode: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find user with matching credentials
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password && u.restaurantCode === restaurantCode,
  )

  if (!user) {
    return { user: null, restaurant: null }
  }

  // Find associated restaurant
  const restaurant = mockRestaurants.find((r) => r.code === user.restaurantCode)

  if (!restaurant) {
    return { user: null, restaurant: null }
  }

  // Return user without password and the restaurant
  const { password: _, ...safeUser } = user

  // Log successful authentication
  console.log("Authentication successful:", {
    user: safeUser,
    restaurantCode: restaurant.code,
    role: user.role,
  })

  return {
    user: safeUser as User,
    restaurant,
  }
}

// Helper function to verify user has access to a specific restaurant
export function verifyRestaurantAccess(user: User | null, restaurantCode: string): boolean {
  if (!user) return false
  return user.restaurantCode === restaurantCode
}

// Helper function to check if user has required role
export function hasRole(user: User | null, requiredRoles: string[]): boolean {
  if (!user) return false
  return requiredRoles.includes(user.role)
}

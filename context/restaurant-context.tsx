"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/context/auth-context"
import * as dataService from "@/lib/data-service"
import type { MenuItem, Table, Order } from "@/lib/types"

interface RestaurantContextType {
  // Menu operations
  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, "id">) => Promise<MenuItem | null>
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<MenuItem | null>
  deleteMenuItem: (id: string) => Promise<boolean>

  // Table operations
  tables: Table[]
  addTable: (table: Omit<Table, "id">) => Promise<Table | null>
  updateTable: (id: string, updates: Partial<Table>) => Promise<Table | null>
  deleteTable: (id: string) => Promise<boolean>

  // Order operations
  orders: Order[]
  addOrder: (order: Omit<Order, "id">) => Promise<Order | null>
  updateOrder: (id: string, updates: Partial<Order>) => Promise<Order | null>
  deleteOrder: (id: string) => Promise<boolean>

  // Loading states
  isLoading: boolean
  refreshData: () => Promise<void>
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const { user, restaurant, isAuthenticated } = useAuth()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    if (isAuthenticated && restaurant) {
      refreshData()
    }
  }, [isAuthenticated, restaurant])

  // Refresh all data
  const refreshData = async () => {
    if (!user?.restaurantCode) return

    setIsLoading(true)
    try {
      const restaurantCode = user.restaurantCode

      // Load menu items
      const menuData = dataService.getMenuItems(restaurantCode)
      setMenuItems(menuData)

      // Load tables
      const tableData = dataService.getTables(restaurantCode)
      setTables(tableData)

      // Load orders
      const orderData = dataService.getOrders(restaurantCode)
      setOrders(orderData)

      console.log(`Data loaded for restaurant ${restaurantCode}`)
    } catch (error) {
      console.error("Error loading restaurant data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Menu operations
  const addMenuItem = async (item: Omit<MenuItem, "id">) => {
    if (!user?.restaurantCode) return null

    const newItem = dataService.addMenuItem(user.restaurantCode, item)
    if (newItem) {
      setMenuItems((prev) => [...prev, newItem])
    }
    return newItem
  }

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    if (!user?.restaurantCode) return null

    const updatedItem = dataService.updateMenuItem(user.restaurantCode, id, updates)
    if (updatedItem) {
      setMenuItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)))
    }
    return updatedItem
  }

  const deleteMenuItem = async (id: string) => {
    if (!user?.restaurantCode) return false

    const success = dataService.deleteMenuItem(user.restaurantCode, id)
    if (success) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id))
    }
    return success
  }

  // Table operations
  const addTable = async (table: Omit<Table, "id">) => {
    if (!user?.restaurantCode) return null

    const newTable = dataService.addTable(user.restaurantCode, table)
    if (newTable) {
      setTables((prev) => [...prev, newTable])
    }
    return newTable
  }

  const updateTable = async (id: string, updates: Partial<Table>) => {
    if (!user?.restaurantCode) return null

    const updatedTable = dataService.updateTable(user.restaurantCode, id, updates)
    if (updatedTable) {
      setTables((prev) => prev.map((table) => (table.id === id ? updatedTable : table)))
    }
    return updatedTable
  }

  const deleteTable = async (id: string) => {
    if (!user?.restaurantCode) return false

    const success = dataService.deleteTable(user.restaurantCode, id)
    if (success) {
      setTables((prev) => prev.filter((table) => table.id !== id))
    }
    return success
  }

  // Order operations
  const addOrder = async (order: Omit<Order, "id">) => {
    if (!user?.restaurantCode) return null

    const newOrder = dataService.addOrder(user.restaurantCode, order)
    if (newOrder) {
      setOrders((prev) => [...prev, newOrder])
    }
    return newOrder
  }

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    if (!user?.restaurantCode) return null

    const updatedOrder = dataService.updateOrder(user.restaurantCode, id, updates)
    if (updatedOrder) {
      setOrders((prev) => prev.map((order) => (order.id === id ? updatedOrder : order)))
    }
    return updatedOrder
  }

  const deleteOrder = async (id: string) => {
    if (!user?.restaurantCode) return false

    const success = dataService.deleteOrder(user.restaurantCode, id)
    if (success) {
      setOrders((prev) => prev.filter((order) => order.id !== id))
    }
    return success
  }

  return (
    <RestaurantContext.Provider
      value={{
        // Menu operations
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,

        // Table operations
        tables,
        addTable,
        updateTable,
        deleteTable,

        // Order operations
        orders,
        addOrder,
        updateOrder,
        deleteOrder,

        // Loading states
        isLoading,
        refreshData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider")
  }
  return context
}

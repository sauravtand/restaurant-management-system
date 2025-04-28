import { mockRestaurants } from "./mock-data"
import type { Restaurant, MenuItem, Table, Order } from "./types"

// In-memory data store (simulating a database)
let restaurants = [...mockRestaurants]

// Helper function to find restaurant by code
function findRestaurantByCode(code: string): Restaurant | undefined {
  return restaurants.find((r) => r.code === code)
}

// Helper function to clone data to avoid direct mutations
function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

// Restaurant data access
export function getRestaurantByCode(code: string): Restaurant | null {
  const restaurant = findRestaurantByCode(code)
  return restaurant ? cloneData(restaurant) : null
}

// Menu item operations
export function getMenuItems(restaurantCode: string): MenuItem[] {
  const restaurant = findRestaurantByCode(restaurantCode)
  return restaurant ? cloneData(restaurant.menu) : []
}

export function addMenuItem(restaurantCode: string, menuItem: Omit<MenuItem, "id">): MenuItem | null {
  const restaurant = findRestaurantByCode(restaurantCode)
  if (!restaurant) return null

  const newItem: MenuItem = {
    id: `item-${Date.now()}`,
    ...menuItem,
  }

  // Update in-memory data
  restaurant.menu.push(newItem)

  return cloneData(newItem)
}

export function updateMenuItem(
  restaurantCode: string,
  menuItemId: string,
  updates: Partial<MenuItem>,
): MenuItem | null {
  const restaurant = findRestaurantByCode(restaurantCode)
  if (!restaurant) return null

  const itemIndex = restaurant.menu.findIndex((item) => item.id === menuItemId)
  if (itemIndex === -1) return null

  // Update the item
  const updatedItem = {
    ...restaurant.menu[itemIndex],
    ...updates,
  }
  restaurant.menu[itemIndex] = updatedItem

  return cloneData(updatedItem)
}

export function deleteMenuItem(restaurantCode: string, menuItemId: string): boolean {
  const restaurant = findRestaurantByCode(restaurantCode)
  if (!restaurant) return false

  const initialLength = restaurant.menu.length
  restaurant.menu = restaurant.menu.filter((item) => item.id !== menuItemId)

  return restaurant.menu.length < initialLength
}

// Table operations
export function getTables(restaurantCode: string): Table[] {
  const restaurant = findRestaurantByCode(restaurantCode)
  return restaurant ? cloneData(restaurant.tables) : []
}

export function addTable(restaurantCode: string, table: Omit<Table, "id">): Table | null {
  const restaurant = findRestaurantByCode(restaurantCode)
  if (!restaurant) return null

  const newTable: Table = {
    id: `table-${Date.now()}`,
    ...table,
  }

  // Update in-memory data
  restaurant.tables.push(newTable)

  return cloneData(newTable)
}

export function updateTable(restaurantCode: string, tableId: string, updates: Partial<Table>): Table | null {
  const restaurant = findRestaurantByCode(restaurantCode)
  if (!restaurant) return null

  const tableIndex = restaurant.tables.findIndex((table) => table.id === tableId)
  if (tableIndex === -1) return null

  // Update the table
  const updatedTable = {
    ...restaurant.tables[tableIndex],
    ...updates,
  }
  restaurant.tables[tableIndex] = updatedTable

  return cloneData(updatedTable)
}

export function deleteTable(restaurantCode: string, tableId: string): boolean {
  const restaurant = findRestaurantByCode(restaurantCode)
  if (!restaurant) return false

  const initialLength = restaurant.tables.length
  restaurant.tables = restaurant.tables.filter((table) => table.id !== tableId)

  return restaurant.tables.length < initialLength
}

// Order operations
export function getOrders(restaurantCode: string): Order[] {
  const restaurant = findRestaurantByCode(restaurantCode)
  return restaurant ? cloneData(restaurant.orders) : []
}

export function addOrder(restaurantCode: string, order: Omit<Order, "id">): Order | null {
  const restaurant = findRestaurantByCode(restaurantCode)
  if (!restaurant) return null

  const newOrder: Order = {
    id: `order-${Date.now()}`,
    ...order,
  }

  // Update in-memory data
  restaurant.orders.push(newOrder)

  return cloneData(newOrder)
}

export function updateOrder(restaurantCode: string, orderId: string, updates: Partial<Order>): Order | null {
  const restaurant = findRestaurantByCode(restaurantCode)
  if (!restaurant) return null

  const orderIndex = restaurant.orders.findIndex((order) => order.id === orderId)
  if (orderIndex === -1) return null

  // Update the order
  const updatedOrder = {
    ...restaurant.orders[orderIndex],
    ...updates,
  }
  restaurant.orders[orderIndex] = updatedOrder

  return cloneData(updatedOrder)
}

export function deleteOrder(restaurantCode: string, orderId: string): boolean {
  const restaurant = findRestaurantByCode(restaurantCode)
  if (!restaurant) return false

  const initialLength = restaurant.orders.length
  restaurant.orders = restaurant.orders.filter((order) => order.id !== orderId)

  return restaurant.orders.length < initialLength
}

// Reset data (for testing)
export function resetData(): void {
  restaurants = cloneData(mockRestaurants)
}

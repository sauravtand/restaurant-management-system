export interface User {
  id: string
  name: string
  email: string
  password?: string
  role: "owner" | "manager" | "staff"
  restaurantCode: string
}

export interface Restaurant {
  id: string
  name: string
  code: string
  address: string
  phone: string
  tables: Table[]
  menu: MenuItem[]
  orders: Order[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  image?: string
}

export interface Table {
  id: string
  number: number
  capacity: number
  status: "free" | "occupied" | "reserved"
}

export interface Order {
  id: string
  tableId: string
  tableNumber: number
  items: OrderItem[]
  status: "pending" | "preparing" | "served" | "completed" | "cancelled"
  total: number
  createdAt: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
}

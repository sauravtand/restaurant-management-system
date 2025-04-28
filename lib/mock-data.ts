import type { User, Restaurant, MenuItem, Table, Order } from "./types"

// Mock Users for different restaurants
export const mockUsers: User[] = [
  // Italiano Delizioso (REST001) Users
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    password: "password",
    role: "owner",
    restaurantCode: "REST001",
  },
  {
    id: "user2",
    name: "Maria Garcia",
    email: "maria@example.com",
    password: "password",
    role: "manager",
    restaurantCode: "REST001",
  },

  // Sushi Paradise (REST002) Users
  {
    id: "user3",
    name: "Akira Tanaka",
    email: "akira@example.com",
    password: "password",
    role: "owner",
    restaurantCode: "REST002",
  },
  {
    id: "user4",
    name: "Lisa Chen",
    email: "lisa@example.com",
    password: "password",
    role: "manager",
    restaurantCode: "REST002",
  },
]

// Menu Items for Italiano Delizioso (REST001)
const rest001Menu: MenuItem[] = [
  {
    id: "item001-1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    category: "Pizza",
    available: true,
  },
  {
    id: "item001-2",
    name: "Pepperoni Pizza",
    description: "Pizza with tomato sauce, mozzarella, and pepperoni",
    price: 14.99,
    category: "Pizza",
    available: true,
  },
  {
    id: "item001-3",
    name: "Caesar Salad",
    description: "Romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 8.99,
    category: "Salad",
    available: true,
  },
  {
    id: "item001-4",
    name: "Spaghetti Carbonara",
    description: "Spaghetti with egg, cheese, pancetta, and black pepper",
    price: 16.99,
    category: "Pasta",
    available: true,
  },
  {
    id: "item001-5",
    name: "Tiramisu",
    description: "Coffee-flavored Italian dessert",
    price: 7.99,
    category: "Dessert",
    available: true,
  },
  {
    id: "item001-6",
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter",
    price: 4.99,
    category: "Appetizer",
    available: false,
  },
]

// Menu Items for Sushi Paradise (REST002)
const rest002Menu: MenuItem[] = [
  {
    id: "item002-1",
    name: "California Roll",
    description: "Crab, avocado, and cucumber roll",
    price: 8.99,
    category: "Maki",
    available: true,
  },
  {
    id: "item002-2",
    name: "Salmon Nigiri",
    description: "Fresh salmon over pressed vinegared rice",
    price: 6.99,
    category: "Nigiri",
    available: true,
  },
  {
    id: "item002-3",
    name: "Spicy Tuna Roll",
    description: "Spicy tuna and cucumber roll",
    price: 9.99,
    category: "Maki",
    available: true,
  },
  {
    id: "item002-4",
    name: "Miso Soup",
    description: "Traditional Japanese soup with tofu and seaweed",
    price: 3.99,
    category: "Soup",
    available: true,
  },
  {
    id: "item002-5",
    name: "Edamame",
    description: "Steamed soybean pods with sea salt",
    price: 4.99,
    category: "Appetizer",
    available: true,
  },
  {
    id: "item002-6",
    name: "Green Tea Ice Cream",
    description: "Creamy matcha flavored ice cream",
    price: 5.99,
    category: "Dessert",
    available: true,
  },
]

// Tables for Italiano Delizioso (REST001)
const rest001Tables: Table[] = [
  { id: "table001-1", number: 1, capacity: 2, status: "occupied" },
  { id: "table001-2", number: 2, capacity: 4, status: "free" },
  { id: "table001-3", number: 3, capacity: 4, status: "occupied" },
  { id: "table001-4", number: 4, capacity: 6, status: "free" },
  { id: "table001-5", number: 5, capacity: 2, status: "reserved" },
  { id: "table001-6", number: 6, capacity: 8, status: "free" },
]

// Tables for Sushi Paradise (REST002)
const rest002Tables: Table[] = [
  { id: "table002-1", number: 1, capacity: 2, status: "free" },
  { id: "table002-2", number: 2, capacity: 4, status: "occupied" },
  { id: "table002-3", number: 3, capacity: 6, status: "occupied" },
  { id: "table002-4", number: 4, capacity: 8, status: "reserved" },
  { id: "table002-5", number: 5, capacity: 2, status: "free" },
]

// Orders for Italiano Delizioso (REST001)
const rest001Orders: Order[] = [
  {
    id: "order001-1",
    tableId: "table001-1",
    tableNumber: 1,
    items: [
      { menuItemId: "item001-1", name: "Margherita Pizza", price: 12.99, quantity: 1 },
      { menuItemId: "item001-3", name: "Caesar Salad", price: 8.99, quantity: 1 },
    ],
    status: "served",
    total: 21.98,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: "order001-2",
    tableId: "table001-3",
    tableNumber: 3,
    items: [
      { menuItemId: "item001-2", name: "Pepperoni Pizza", price: 14.99, quantity: 2 },
      { menuItemId: "item001-6", name: "Garlic Bread", price: 4.99, quantity: 1 },
    ],
    status: "preparing",
    total: 34.97,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: "order001-3",
    tableId: "table001-5",
    tableNumber: 5,
    items: [
      { menuItemId: "item001-4", name: "Spaghetti Carbonara", price: 16.99, quantity: 1 },
      { menuItemId: "item001-5", name: "Tiramisu", price: 7.99, quantity: 1 },
    ],
    status: "pending",
    total: 24.98,
    createdAt: new Date().toISOString(), // Just now
  },
]

// Orders for Sushi Paradise (REST002)
const rest002Orders: Order[] = [
  {
    id: "order002-1",
    tableId: "table002-2",
    tableNumber: 2,
    items: [
      { menuItemId: "item002-1", name: "California Roll", price: 8.99, quantity: 2 },
      { menuItemId: "item002-4", name: "Miso Soup", price: 3.99, quantity: 2 },
    ],
    status: "served",
    total: 25.96,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
  },
  {
    id: "order002-2",
    tableId: "table002-3",
    tableNumber: 3,
    items: [
      { menuItemId: "item002-2", name: "Salmon Nigiri", price: 6.99, quantity: 4 },
      { menuItemId: "item002-3", name: "Spicy Tuna Roll", price: 9.99, quantity: 1 },
      { menuItemId: "item002-5", name: "Edamame", price: 4.99, quantity: 1 },
    ],
    status: "preparing",
    total: 42.95,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  },
]

// Mock Restaurants
export const mockRestaurants: Restaurant[] = [
  {
    id: "rest001",
    name: "Italiano Delizioso",
    code: "REST001",
    address: "123 Main St, Anytown, USA",
    phone: "(555) 123-4567",
    tables: rest001Tables,
    menu: rest001Menu,
    orders: rest001Orders,
  },
  {
    id: "rest002",
    name: "Sushi Paradise",
    code: "REST002",
    address: "456 Ocean Ave, Seaside, USA",
    phone: "(555) 987-6543",
    tables: rest002Tables,
    menu: rest002Menu,
    orders: rest002Orders,
  },
]

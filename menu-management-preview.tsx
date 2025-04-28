"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function MenuManagementPreview() {
  // Sample menu items
  const menuItems = [
    {
      id: "item1",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      category: "Pizza",
      available: true,
    },
    {
      id: "item2",
      name: "Pepperoni Pizza",
      description: "Pizza with tomato sauce, mozzarella, and pepperoni",
      price: 14.99,
      category: "Pizza",
      available: true,
    },
    {
      id: "item3",
      name: "Caesar Salad",
      description: "Romaine lettuce with Caesar dressing, croutons, and parmesan",
      price: 8.99,
      category: "Salad",
      available: true,
    },
    {
      id: "item4",
      name: "Spaghetti Carbonara",
      description: "Spaghetti with egg, cheese, pancetta, and black pepper",
      price: 16.99,
      category: "Pasta",
      available: true,
    },
    {
      id: "item5",
      name: "Tiramisu",
      description: "Coffee-flavored Italian dessert",
      price: 7.99,
      category: "Dessert",
      available: true,
    },
    {
      id: "item6",
      name: "Garlic Bread",
      description: "Toasted bread with garlic butter",
      price: 4.99,
      category: "Appetizer",
      available: false,
    },
  ]

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant's menu items</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Dish
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>
            {menuItems.length} items in your menu, {menuItems.filter((item) => item.available).length} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Switch checked={item.available} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

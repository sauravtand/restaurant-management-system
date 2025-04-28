"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRestaurant } from "@/context/restaurant-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order, OrderItem } from "@/lib/types"
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react"

export default function OrderManagement() {
  const { restaurant } = useAuth()
  const { orders, tables, menuItems, addOrder, updateOrder, deleteOrder, isLoading } = useRestaurant()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Form state for new/edit order
  const [formData, setFormData] = useState<{
    tableId: string
    items: OrderItem[]
    status: Order["status"]
  }>({
    tableId: "",
    items: [],
    status: "pending",
  })

  // Temporary state for adding items to an order
  const [selectedMenuItem, setSelectedMenuItem] = useState("")
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `Table ${order.tableNumber}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddOrder = async () => {
    if (!formData.tableId || formData.items.length === 0) return

    const selectedTable = tables.find((table) => table.id === formData.tableId)
    if (!selectedTable) return

    const total = formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const newOrder = {
      tableId: formData.tableId,
      tableNumber: selectedTable.number,
      items: formData.items,
      status: formData.status,
      total,
      createdAt: new Date().toISOString(),
    }

    await addOrder(newOrder)
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditOrder = async () => {
    if (!currentOrder) return

    const selectedTable = tables.find((table) => table.id === formData.tableId)
    if (!selectedTable) return

    const total = formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const updates = {
      tableId: formData.tableId,
      tableNumber: selectedTable.number,
      items: formData.items,
      status: formData.status,
      total,
    }

    await updateOrder(currentOrder.id, updates)
    resetForm()
    setIsEditDialogOpen(false)
    setCurrentOrder(null)
  }

  const handleDeleteOrder = async (id: string) => {
    await deleteOrder(id)
  }

  const openEditDialog = (order: Order) => {
    setCurrentOrder(order)
    setFormData({
      tableId: order.tableId,
      items: [...order.items],
      status: order.status,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      tableId: "",
      items: [],
      status: "pending",
    })
    setSelectedMenuItem("")
    setSelectedQuantity(1)
  }

  const addItemToOrder = () => {
    if (!selectedMenuItem) return

    const menuItem = menuItems.find((item) => item.id === selectedMenuItem)
    if (!menuItem) return

    const newItem: OrderItem = {
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: selectedQuantity,
    }

    // Check if item already exists in order
    const existingItemIndex = formData.items.findIndex((item) => item.menuItemId === menuItem.id)

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...formData.items]
      updatedItems[existingItemIndex].quantity += selectedQuantity
      setFormData({ ...formData, items: updatedItems })
    } else {
      // Add new item
      setFormData({ ...formData, items: [...formData.items, newItem] })
    }

    // Reset selection
    setSelectedMenuItem("")
    setSelectedQuantity(1)
  }

  const removeItemFromOrder = (menuItemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.menuItemId !== menuItemId),
    })
  }

  const updateItemQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(menuItemId)
      return
    }

    setFormData({
      ...formData,
      items: formData.items.map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item)),
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading order data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">
            Manage orders for {restaurant?.name} <Badge variant="outline">{restaurant?.code}</Badge>
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>Create a new order for a table</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="table">Table</Label>
                <Select
                  value={formData.tableId}
                  onValueChange={(value) => setFormData({ ...formData, tableId: value })}
                >
                  <SelectTrigger id="table">
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        Table {table.number} ({table.capacity} seats)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Add Menu Items</Label>
                <div className="flex gap-2">
                  <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a menu item" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuItems
                        .filter((item) => item.available)
                        .map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - ${item.price.toFixed(2)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="quantity" className="sr-only">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      className="w-20"
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(Number.parseInt(e.target.value, 10) || 1)}
                    />
                    <Button type="button" onClick={addItemToOrder} disabled={!selectedMenuItem}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {formData.items.length > 0 && (
                <div className="border rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.items.map((item) => (
                        <TableRow key={item.menuItemId}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateItemQuantity(item.menuItemId, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span>{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateItemQuantity(item.menuItemId, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeItemFromOrder(item.menuItemId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total:
                        </TableCell>
                        <TableCell className="font-bold">
                          ${formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Order["status"] })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="served">Served</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddOrder} disabled={!formData.tableId || formData.items.length === 0}>
                Create Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID, status, or table..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {orders.filter((o) => o.status === "pending").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Preparing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {orders.filter((o) => o.status === "preparing").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Served</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {orders.filter((o) => o.status === "served").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {orders.filter((o) => o.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage all orders for your restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>Table {order.tableNumber}</TableCell>
                    <TableCell>
                      {order.items.map((item) => (
                        <div key={item.menuItemId} className="text-sm">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(order)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Order</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete order {order.id}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteOrder(order.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">{searchTerm ? "No orders match your search" : "No orders found"}</p>
              {!searchTerm && (
                <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  Create your first order
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update the details of this order</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-table">Table</Label>
              <Select value={formData.tableId} onValueChange={(value) => setFormData({ ...formData, tableId: value })}>
                <SelectTrigger id="edit-table">
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      Table {table.number} ({table.capacity} seats)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Add Menu Items</Label>
              <div className="flex gap-2">
                <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a menu item" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuItems
                      .filter((item) => item.available)
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - ${item.price.toFixed(2)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    className="w-20"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number.parseInt(e.target.value, 10) || 1)}
                  />
                  <Button type="button" onClick={addItemToOrder} disabled={!selectedMenuItem}>
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {formData.items.length > 0 && (
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.map((item) => (
                      <TableRow key={item.menuItemId}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateItemQuantity(item.menuItemId, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateItemQuantity(item.menuItemId, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeItemFromOrder(item.menuItemId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total:
                      </TableCell>
                      <TableCell className="font-bold">
                        ${formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Order["status"] })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="served">Served</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditOrder} disabled={!formData.tableId || formData.items.length === 0}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const statusConfig = {
    pending: { variant: "outline", label: "Pending" },
    preparing: { variant: "secondary", label: "Preparing" },
    served: { variant: "default", label: "Served" },
    completed: { variant: "success", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  } as const

  const config = statusConfig[status]

  return <Badge variant={config.variant as any}>{config.label}</Badge>
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

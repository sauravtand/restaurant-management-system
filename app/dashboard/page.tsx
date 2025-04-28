"use client"
import { useAuth } from "@/context/auth-context"
import { useRestaurant } from "@/context/restaurant-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Order } from "@/lib/types"
import { LayoutDashboard, UtensilsCrossed, TableIcon, Clock, Loader2, RefreshCw } from "lucide-react"

export default function Dashboard() {
  const { restaurant, isAuthenticated } = useAuth()
  const { orders, tables, menuItems, updateOrder, isLoading, refreshData } = useRestaurant()

  // Filter today's orders
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  })

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    await updateOrder(orderId, { status: newStatus })
  }

  const handleRefresh = () => {
    refreshData()
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Count tables by status
  const tableCounts = {
    total: tables.length || 0,
    occupied: tables.filter((t) => t.status === "occupied").length || 0,
    free: tables.filter((t) => t.status === "free").length || 0,
    reserved: tables.filter((t) => t.status === "reserved").length || 0,
  }

  // Count menu items
  const menuCount = menuItems.length || 0
  const availableMenuCount = menuItems.filter((item) => item.available).length || 0

  // Count orders by status
  const orderCounts = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    served: orders.filter((o) => o.status === "served").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }

  // Calculate total revenue (excluding cancelled orders)
  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to {restaurant?.name} <Badge variant="outline">{restaurant?.code}</Badge>
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <TableIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tableCounts.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {tableCounts.occupied} occupied, {tableCounts.free} free
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{availableMenuCount} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderCounts.pending + orderCounts.preparing + orderCounts.served}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {orderCounts.completed} completed, {orderCounts.cancelled} cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">From {orders.length - orderCounts.cancelled} orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Orders */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Today's Orders</CardTitle>
          <CardDescription>Manage your restaurant's orders for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayOrders.map((order) => (
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
                    <TableCell className="text-right">
                      <Select
                        defaultValue={order.status}
                        onValueChange={(value) => handleUpdateOrderStatus(order.id, value as Order["status"])}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="served">Served</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No orders for today</p>
              <Button variant="outline" className="mt-4" onClick={() => (window.location.href = "/dashboard/orders")}>
                Create a new order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
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

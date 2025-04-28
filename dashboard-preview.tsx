"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutDashboard, UtensilsCrossed, TableIcon, Clock } from "lucide-react"

export default function DashboardPreview() {
  // Sample data
  const restaurant = {
    name: "Italiano Delizioso",
    code: "REST001",
  }

  const orders = [
    {
      id: "order1",
      tableNumber: 1,
      items: [
        { menuItemId: "item1", name: "Margherita Pizza", price: 12.99, quantity: 1 },
        { menuItemId: "item3", name: "Caesar Salad", price: 8.99, quantity: 1 },
      ],
      status: "served",
      total: 21.98,
    },
    {
      id: "order2",
      tableNumber: 3,
      items: [
        { menuItemId: "item2", name: "Pepperoni Pizza", price: 14.99, quantity: 2 },
        { menuItemId: "item6", name: "Garlic Bread", price: 4.99, quantity: 1 },
      ],
      status: "preparing",
      total: 34.97,
    },
    {
      id: "order3",
      tableNumber: 5,
      items: [
        { menuItemId: "item4", name: "Spaghetti Carbonara", price: 16.99, quantity: 1 },
        { menuItemId: "item5", name: "Tiramisu", price: 7.99, quantity: 1 },
      ],
      status: "pending",
      total: 24.98,
    },
  ]

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to {restaurant.name}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <TableIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground mt-1">2 occupied, 3 free</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground mt-1">5 available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">1 completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$81.93</div>
            <p className="text-xs text-muted-foreground mt-1">From 3 orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Orders */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Today's Orders</CardTitle>
        </CardHeader>
        <CardContent>
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
              {orders.map((order) => (
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
                    <Select defaultValue={order.status}>
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
        </CardContent>
      </Card>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { variant: "outline", label: "Pending" },
    preparing: { variant: "secondary", label: "Preparing" },
    served: { variant: "default", label: "Served" },
    completed: { variant: "success", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  } as const

  const config = statusConfig[status as keyof typeof statusConfig]

  return <Badge variant={config.variant as any}>{config.label}</Badge>
}

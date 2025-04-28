"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function TableManagementPreview() {
  // Sample tables
  const tables = [
    { id: "table1", number: 1, capacity: 2, status: "occupied" },
    { id: "table2", number: 2, capacity: 4, status: "free" },
    { id: "table3", number: 3, capacity: 4, status: "occupied" },
    { id: "table4", number: 4, capacity: 6, status: "free" },
    { id: "table5", number: 5, capacity: 2, status: "reserved" },
    { id: "table6", number: 6, capacity: 8, status: "free" },
  ]

  // Count tables by status
  const tableCounts = {
    total: tables.length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    free: tables.filter((t) => t.status === "free").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 md:ml-64">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Table Management</h1>
          <p className="text-muted-foreground">Manage your restaurant's tables</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Table
        </Button>
      </div>

      {/* Table Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tableCounts.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Free Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tableCounts.free}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupied Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{tableCounts.occupied}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reserved Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{tableCounts.reserved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table Visualization */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Table Layout</CardTitle>
          <CardDescription>Visual representation of your restaurant's tables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`
                  p-4 rounded-lg border text-center cursor-pointer transition-colors
                  ${table.status === "free" ? "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800" : ""}
                  ${table.status === "occupied" ? "bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800" : ""}
                  ${table.status === "reserved" ? "bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800" : ""}
                `}
              >
                <div className="font-bold text-lg">Table {table.number}</div>
                <div className="text-sm text-muted-foreground">Seats: {table.capacity}</div>
                <div
                  className={`
                  mt-2 text-xs font-medium px-2 py-1 rounded-full inline-block
                  ${table.status === "free" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                  ${table.status === "occupied" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" : ""}
                  ${table.status === "reserved" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100" : ""}
                `}
                >
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table List */}
      <Card>
        <CardHeader>
          <CardTitle>Table Management</CardTitle>
          <CardDescription>Manage your restaurant's tables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 p-4 font-medium border-b">
              <div>Table Number</div>
              <div>Capacity</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {tables.map((table) => (
              <div key={table.id} className="grid grid-cols-5 p-4 border-b last:border-0 items-center">
                <div className="font-medium">Table {table.number}</div>
                <div>{table.capacity} seats</div>
                <div>
                  <Select defaultValue={table.status}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

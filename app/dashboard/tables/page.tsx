"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import type { Table } from "@/lib/types"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function TableManagement() {
  const { restaurant } = useAuth()
  const [tables, setTables] = useState<Table[]>(restaurant?.tables || [])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentTable, setCurrentTable] = useState<Table | null>(null)

  // Form state
  const [formData, setFormData] = useState<Partial<Table>>({
    number: 0,
    capacity: 2,
    status: "free",
  })

  // In the resetForm function, ensure we're using explicit numbers instead of potentially undefined values
  const resetForm = () => {
    setFormData({
      number: 0,
      capacity: 2,
      status: "free",
    })
  }

  // In the handleAddTable function, ensure we're using explicit numbers with fallbacks
  const handleAddTable = () => {
    const newTable: Table = {
      id: `table${Date.now()}`,
      number: Number(formData.number) || 0,
      capacity: Number(formData.capacity) || 2,
      status: (formData.status as "free" | "occupied" | "reserved") || "free",
    }

    setTables([...tables, newTable])
    resetForm()
    setIsAddDialogOpen(false)
  }

  // In the handleEditTable function, ensure we're using explicit numbers with fallbacks
  const handleEditTable = () => {
    if (!currentTable) return

    const updatedTable = {
      ...currentTable,
      number: Number(formData.number) || currentTable.number,
      capacity: Number(formData.capacity) || currentTable.capacity,
      status: (formData.status as "free" | "occupied" | "reserved") || currentTable.status,
    }

    setTables(tables.map((table) => (table.id === currentTable.id ? updatedTable : table)))

    resetForm()
    setIsEditDialogOpen(false)
    setCurrentTable(null)
  }

  const handleDeleteTable = (id: string) => {
    setTables(tables.filter((table) => table.id !== id))
  }

  const openEditDialog = (table: Table) => {
    setCurrentTable(table)
    setFormData({
      number: table.number,
      capacity: table.capacity,
      status: table.status,
    })
    setIsEditDialogOpen(true)
  }

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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Table
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
              <DialogDescription>Add a new table to your restaurant</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="number">Table Number</Label>
                <Input
                  id="number"
                  type="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: Number.parseInt(e.target.value, 10) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value, 10) || 2 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Table["status"] })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTable}>Add Table</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                onClick={() => openEditDialog(table)}
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

            {tables.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No tables found</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  Add your first table
                </Button>
              </div>
            )}
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
                  <Select
                    value={table.status}
                    onValueChange={(value) => {
                      setTables(tables.map((t) => (t.id === table.id ? { ...t, status: value as Table["status"] } : t)))
                    }}
                  >
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
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(table)}>
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
                        <AlertDialogTitle>Delete Table</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete Table {table.number}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTable(table.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}

            {tables.length === 0 && <div className="p-4 text-center text-muted-foreground">No tables found</div>}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
            <DialogDescription>Update the details of this table</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-number">Table Number</Label>
              <Input
                id="edit-number"
                type="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: Number.parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-capacity">Capacity</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value, 10) || 2 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status as string}
                onValueChange={(value) => setFormData({ ...formData, status: value as Table["status"] })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTable}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

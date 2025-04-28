"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, MenuIcon, UtensilsCrossed, Table, LogOut, ChevronDown, ClipboardList } from "lucide-react"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { restaurant, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/orders",
      label: "Order Management",
      icon: ClipboardList,
      active: pathname === "/dashboard/orders",
    },
    {
      href: "/dashboard/menu",
      label: "Menu Management",
      icon: UtensilsCrossed,
      active: pathname === "/dashboard/menu",
    },
    {
      href: "/dashboard/tables",
      label: "Table Management",
      icon: Table,
      active: pathname === "/dashboard/tables",
    },
  ]

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <MobileSidebarContent restaurant={restaurant} routes={routes} logout={logout} setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-y-auto">
          <DesktopSidebarContent restaurant={restaurant} routes={routes} logout={logout} />
        </div>
      </div>
    </>
  )
}

function MobileSidebarContent({
  restaurant,
  routes,
  logout,
  setOpen,
}: {
  restaurant: any
  routes: any[]
  logout: () => void
  setOpen: (open: boolean) => void
}) {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{restaurant?.name}</h2>
            <Badge variant="outline">{restaurant?.code}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-1 px-2 flex-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={() => setOpen(false)}
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              route.active
                ? "bg-gray-100 dark:bg-gray-800 text-primary"
                : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <route.icon className="mr-3 h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="px-2 mt-6">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => {
            logout()
            setOpen(false)
          }}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

function DesktopSidebarContent({
  restaurant,
  routes,
  logout,
}: {
  restaurant: any
  routes: any[]
  logout: () => void
}) {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold">{restaurant?.name}</h2>
        <Badge variant="outline">{restaurant?.code}</Badge>
      </div>
      <div className="space-y-1 px-2 flex-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              route.active
                ? "bg-gray-100 dark:bg-gray-800 text-primary"
                : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <route.icon className="mr-3 h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="px-2 mt-6">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  MessageSquare,
  Bot,
  Tag,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  merchant: {
    id: string
    companyName: string
  }
}

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Services", href: "/dashboard/services", icon: Package },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Users },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Payouts", href: "/dashboard/payouts", icon: Wallet },
  { name: "Coupons", href: "/dashboard/coupons", icon: Tag },
  { name: "Support", href: "/dashboard/support", icon: MessageSquare },
  { name: "Bot Settings", href: "/dashboard/bot", icon: Bot },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar({ merchant }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <span className="text-sm font-bold text-primary-foreground">Z</span>
        </div>
        <span className="font-semibold">{merchant.companyName}</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-accent/50 p-3">
          <p className="text-xs text-muted-foreground">Current Plan</p>
          <p className="font-medium">Free Plan</p>
          <Link href="/dashboard/billing" className="mt-2 block text-xs text-primary hover:underline">
            Upgrade Plan
          </Link>
        </div>
      </div>
    </aside>
  )
}

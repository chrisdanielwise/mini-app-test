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
  Sparkles,
  User // Added missing User import
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  merchant: {
    id: string 
    companyName: string
    planStatus?: string 
  }
}

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Services", href: "/dashboard/services", icon: Package },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Users },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 }, // Linked to your new analytics page
  { name: "Payouts", href: "/dashboard/payouts", icon: Wallet },
  { name: "Coupons", href: "/dashboard/coupons", icon: Tag },
  { name: "Support", href: "/dashboard/support", icon: MessageSquare },
  { name: "Bot Config", href: "/dashboard/bot", icon: Bot },
  { name: "Business Settings", href: "/dashboard/settings", icon: Settings }, // Renamed for clarity
  { name: "My Profile", href: "/dashboard/profile", icon: User }, // Linked to your new admin profile
]

export function DashboardSidebar({ merchant }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
          <span className="text-xs font-black text-primary-foreground italic">Z</span>
        </div>
        <span className="font-bold tracking-tight truncate uppercase text-sm">
          {merchant.companyName}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) => {
          // Precise active state logic to avoid conflicts between /profile and /dashboard/profile
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 transition-transform group-hover:scale-110",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Account/Plan Footer */}
      <div className="mt-auto border-t border-border p-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-primary/10 p-4">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3 w-3 text-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                Membership Tier
              </p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {merchant.planStatus || "Starter"}
            </p>
            <Link
              href="/dashboard/billing"
              className="mt-3 flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              UPGRADE NOW
            </Link>
          </div>
          <div className="absolute -right-2 -top-2 h-12 w-12 rounded-full bg-primary/5 blur-xl" />
        </div>
      </div>
    </aside>
  )
}
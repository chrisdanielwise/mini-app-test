"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Wallet, Settings, Users } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname();
  
  // High-traffic links for bottom nav
  const quickNav = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Services", href: "/dashboard/services", icon: Package },
    { name: "Payouts", href: "/dashboard/payouts", icon: Wallet },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-card/80 backdrop-blur-2xl border border-border rounded-[2.5rem] p-2 shadow-2xl">
      <div className="flex justify-around">
        {quickNav.map((item) => (
          <Link key={item.href} href={item.href} className={`p-4 rounded-2xl transition-all ${pathname === item.href ? "text-primary scale-110" : "text-muted-foreground"}`}>
            <item.icon className="h-5 w-5" />
          </Link>
        ))}
      </div>
    </nav>
  )
}
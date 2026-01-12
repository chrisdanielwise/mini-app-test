"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"
import { LayoutDashboard, ShoppingBag, Clock, User } from "lucide-react"
import { hapticFeedback } from "@/src/lib/telegram/webapp"

const navItems = [
  /** * 🏁 PATH COLLISION FIX
   * Updated to /home so that the /(public) landing page can own the root "/"
   */
  { href: "/home", icon: LayoutDashboard, label: "Home" },
  { href: "/services", icon: ShoppingBag, label: "Services" },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  /**
   * ⚡ TACTILE FEEDBACK PROTOCOL
   * Checks for user preferences and triggers native haptics on tap
   */
  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      // Prevents SSR hydration errors
      const hapticsEnabled = typeof window !== 'undefined' && localStorage.getItem('user_haptics_enabled') !== 'false';
      
      if (hapticsEnabled) {
        hapticFeedback("light")
      }
    }
  }

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "border-t border-border/40 bg-card/80 backdrop-blur-2xl px-4",
      "pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
    )}>
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {navItems.map((item) => {
          // Robust active check: highlights parent tab when on sub-routes
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 min-w-[70px] h-full",
                "transition-all duration-300 ease-out",
                "active:scale-90", 
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground active:text-foreground"
              )}
            >
              {/* Active Indicator Glow: Zipha V2 Premium Accent */}
              {isActive && (
                <div className="absolute -top-px h-1 w-10 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.6)] animate-in fade-in slide-in-from-top-1 duration-500" />
              )}

              <item.icon className={cn(
                "h-5 w-5 transition-all duration-300",
                isActive ? "scale-110 stroke-[2.5px] drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]" : "stroke-[2px]"
              )} />
              
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                isActive ? "opacity-100 scale-105" : "opacity-60"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
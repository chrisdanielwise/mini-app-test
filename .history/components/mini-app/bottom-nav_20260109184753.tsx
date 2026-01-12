"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"
import { Home, ShoppingBag, Clock, User } from "lucide-react"
import { hapticFeedback } from "@/src/lib/telegram/webapp"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/services", icon: ShoppingBag, label: "Services" },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  /**
   * Triggers native haptic feedback on navigation
   * Respects the user preference stored in localStorage
   */
  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      // Check setting before vibrating
      const hapticsEnabled = localStorage.getItem('user_haptics_enabled') !== 'false';
      
      if (hapticsEnabled) {
        hapticFeedback("light")
      }
    }
  }

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "border-t border-border bg-card/80 backdrop-blur-xl",
      "pb-[env(safe-area-inset-bottom)]"
    )}>
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 min-w-[64px] h-full",
                "transition-all duration-200 ease-in-out",
                // Tactile effect: shrinks slightly when tapped
                "active:scale-90", 
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <span className="absolute -top-px h-0.5 w-8 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              )}

              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "scale-110 stroke-[2.5px]" : "stroke-[2px]"
              )} />
              
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-tighter",
                isActive ? "opacity-100" : "opacity-70"
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
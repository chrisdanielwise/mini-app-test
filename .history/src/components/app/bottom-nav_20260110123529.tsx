"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Clock, 
  User,
  Zap,
  Activity,
  History,
  ShieldCheck
} from "lucide-react";
import { hapticFeedback } from "@/lib/telegram/webapp";

const navItems = [
  { href: "/home", icon: LayoutDashboard, label: "Core" },
  { href: "/services", icon: ShoppingBag, label: "Market" },
  { href: "/history", icon: History, label: "Ledger" },
  { href: "/profile", icon: ShieldCheck, label: "Identity" },
]

/**
 * 🛰️ BOTTOM NAVIGATION COMMAND (Apex Tier)
 * Hardware-persistent navigation layer for Zipha subscribers.
 */
export function BottomNav() {
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      // Identity Check: Trigger native Telegram haptics for tactile confirmation
      const hapticsEnabled = typeof window !== 'undefined' && localStorage.getItem('user_haptics_enabled') !== 'false';
      
      if (hapticsEnabled) {
        hapticFeedback("light");
      }
    }
  };

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-[100]",
      "border-t border-border/40 bg-card/60 backdrop-blur-3xl px-6",
      "pb-[env(safe-area-inset-bottom,20px)] shadow-[0_-20px_50px_rgba(0,0,0,0.2)]",
      "rounded-t-[2.5rem]" // 📱 Hardware radius for premium feel
    )}>
      <div className="mx-auto flex h-20 max-w-lg items-center justify-around">
        {navItems.map((item) => {
          // Deep-link matching: Highlights parent even when viewing specific node details
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 min-w-[64px] h-full transition-all duration-500 group",
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted-foreground/50 hover:text-foreground active:scale-90"
              )}
            >
              {/* --- ACTIVE STATUS BAR --- */}
              {isActive && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.8)] animate-in fade-in zoom-in duration-500" />
              )}

              <div className={cn(
                "relative p-2 rounded-xl transition-all duration-500",
                isActive ? "bg-primary/10 shadow-inner ring-1 ring-primary/20" : ""
              )}>
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-500",
                  isActive ? "stroke-[2.5px] drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : "stroke-[2px]"
                )} />
                
                {/* Subtle Pulse for the 'Market' icon when active */}
                {isActive && item.href === "/services" && (
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                )}
              </div>
              
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.3em] italic transition-all duration-500 leading-none",
                isActive ? "opacity-100 translate-y-0" : "opacity-40 translate-y-0.5"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
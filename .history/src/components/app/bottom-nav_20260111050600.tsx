"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  History, 
  ShieldCheck,
  Zap
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
 * Normalized: Hardware-persistent safe-zones and fluid label typography.
 * Optimized: Adaptive haptics and deep-link matching for high-resiliency navigation.
 */
export function BottomNav() {
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      hapticFeedback("light");
    }
  };

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-[100] w-full",
      "border-t border-border/20 bg-card/80 backdrop-blur-3xl px-4 md:px-6",
      "pb-[env(safe-area-inset-bottom,24px)] shadow-[0_-20px_50px_rgba(0,0,0,0.3)]",
      "rounded-t-[2rem] md:rounded-t-[2.5rem] transition-all duration-500"
    )}>
      <div className="mx-auto flex h-16 md:h-20 max-w-lg items-center justify-around">
        {navItems.map((item) => {
          // Deep-link matching: Highlights parent even when viewing specific node details
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 min-w-[64px] h-full transition-all duration-300 group",
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted-foreground/40 hover:text-foreground active:scale-90"
              )}
            >
              {/* --- ACTIVE STATUS BAR --- */}
              {isActive && (
                <div className="absolute -top-px left-1/2 -translate-y-1/2 h-[2px] md:h-1 w-6 md:w-8 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)] animate-in fade-in zoom-in-50 duration-500" />
              )}

              <div className={cn(
                "relative p-1.5 md:p-2 rounded-xl transition-all duration-500 min-w-0 min-h-0",
                isActive ? "bg-primary/10 ring-1 ring-primary/20 shadow-inner" : "group-hover:bg-muted/10"
              )}>
                <item.icon className={cn(
                  "h-4 w-4 md:h-5 md:w-5 transition-all duration-500 shrink-0",
                  isActive ? "stroke-[2.5px] drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]" : "stroke-[2px]"
                )} />
                
                {/* Protocol Activity Indicators */}
                {isActive && item.href === "/home" && (
                  <Zap className="absolute -top-1 -right-1 h-2 w-2 text-primary fill-current animate-pulse" />
                )}

                {isActive && item.href === "/services" && (
                  <span className="absolute top-0 right-0 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                  </span>
                )}
              </div>
              
              <span className={cn(
                "text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] italic transition-all duration-500 leading-none truncate max-w-full",
                isActive ? "opacity-100 translate-y-0" : "opacity-30 translate-y-0.5"
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
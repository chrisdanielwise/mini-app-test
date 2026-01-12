"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, History, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ BOTTOM NAVIGATION TERMINAL (Apex Tier)
 * Normalized: Hardware-persistent safe-zones and fluid label typography.
 * Optimized: Adaptive haptics and path-aware node matching for high-resiliency navigation.
 */
export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Market",
      href: "/services",
      icon: ShoppingBag,
    },
    {
      label: "Ledger",
      href: "/history",
      icon: History,
    },
    {
      label: "Identity",
      href: "/profile",
      icon: User,
    },
  ];

  const handleInteraction = () => {
    // ⚡ TACTILE HANDSHAKE: Institutional confirmation
    hapticFeedback("light");
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none",
      // DYNAMIC GUTTER: Respects hardware gesture bars
      "pb-[env(safe-area-inset-bottom,24px)] md:pb-10 pt-4"
    )}>
      {/* NAV SHELL: Institutional Glass Geometry */}
      <nav className={cn(
        "mx-auto max-w-lg h-16 md:h-20 flex items-center justify-around px-4 md:px-6 pointer-events-auto relative overflow-hidden transition-all duration-500",
        "rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/60 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      )}>
        
        {/* Subtle Background Circuit Effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[size:15px_15px] md:bg-[size:20px_20px]" />

        {navItems.map((item) => {
          // Robust active check: Remains active for sub-routes
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleInteraction}
              className="relative flex flex-col items-center justify-center w-full h-full group outline-none"
            >
              {/* --- ACTIVE STATUS GLOW --- */}
              {isActive && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 h-[2px] md:h-1 w-6 md:w-10 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)] animate-in fade-in zoom-in-50 duration-500" />
              )}

              <div className={cn(
                "relative p-1.5 md:p-2 rounded-xl transition-all duration-500",
                isActive ? "bg-primary/10 shadow-inner ring-1 ring-primary/20" : "group-active:scale-90"
              )}>
                <Icon
                  className={cn(
                    "h-4 w-4 md:h-5 md:w-5 transition-all duration-500",
                    isActive 
                      ? "text-primary scale-110 stroke-[2.5px] drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]" 
                      : "text-muted-foreground/50 group-hover:text-foreground stroke-[2px]"
                  )}
                />
                
                {/* Visual Heartbeat for the Active Node */}
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 flex h-1.5 w-1.5 md:h-2 md:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-primary"></span>
                  </span>
                )}
              </div>
              
              <span 
                className={cn(
                  "text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1.5 md:mt-2 transition-all duration-500 italic leading-none truncate",
                  isActive ? "text-primary translate-y-0 opacity-100" : "text-muted-foreground opacity-30 translate-y-0.5"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      
      {/* Tactical Status Indicator */}
      <div className="flex items-center justify-center gap-2 mt-3 opacity-10 italic">
        <Zap className="h-2 w-2 text-primary" />
        <span className="text-[6px] font-black uppercase tracking-[0.4em]">Protocol_Active</span>
      </div>
    </div>
  );
}
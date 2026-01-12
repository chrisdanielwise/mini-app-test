"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Clock, User, Zap, Activity, Fingerprint, History } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { hapticFeedback } from "@/src/lib/telegram/webapp";

/**
 * 🛰️ BOTTOM NAVIGATION TERMINAL (Apex Tier)
 * Ergonomic route orchestration for the Zipha subscriber ecosystem.
 * Features: Path-Aware Highlighting, Haptic Integration, and Glass-Depth.
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
    // ⚡ TACTILE HANDSHAKE: Trigger light haptic on navigation
    hapticFeedback("light");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-8 pb-10 pt-6 pointer-events-none">
      {/* NAV SHELL: 
          - rounded-[2.5rem]: Aggressive hardware radius.
          - backdrop-blur-3xl: High-end glass refraction.
      */}
      <nav className="mx-auto max-w-lg h-20 rounded-[2.5rem] border border-border/40 bg-card/60 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-around px-6 pointer-events-auto relative overflow-hidden">
        
        {/* Subtle Background Circuit Effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[size:20px_20px]" />

        {navItems.map((item) => {
          // Robust active check: Remains active for sub-routes (e.g., /services/[id])
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
                <div className="absolute -top-px left-1/2 -translate-x-1/2 h-1 w-10 rounded-full bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.8)] animate-in fade-in zoom-in duration-500" />
              )}

              <div className={cn(
                "relative p-2 rounded-xl transition-all duration-500",
                isActive ? "bg-primary/10 shadow-inner" : "group-active:scale-90"
              )}>
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-500",
                    isActive 
                      ? "text-primary scale-110 stroke-[2.5px] drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]" 
                      : "text-muted-foreground/50 group-hover:text-foreground stroke-[2px]"
                  )}
                />
                
                {/* Visual Heartbeat for the Active Node */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                )}
              </div>
              
              <span 
                className={cn(
                  "text-[8px] font-black uppercase tracking-[0.3em] mt-2 transition-all duration-500 italic leading-none",
                  isActive ? "text-primary translate-y-0 opacity-100" : "text-muted-foreground opacity-40 translate-y-1"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
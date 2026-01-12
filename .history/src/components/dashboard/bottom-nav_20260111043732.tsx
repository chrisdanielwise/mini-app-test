"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Wallet, 
  Settings, 
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 📱 MOBILE COMMAND CONTROLLER (Apex Tier)
 * Normalized: World-standard fluid typography and responsive docking geometry.
 * Optimized: Enhanced touch targets and haptic feedback for mobile staff.
 */
export function BottomNav() {
  const pathname = usePathname();
  
  const quickNav = [
    { name: "HUD", href: "/dashboard", icon: LayoutDashboard },
    { name: "NODES", href: "/dashboard/services", icon: Package },
    { name: "LEDGER", href: "/dashboard/payouts", icon: Wallet },
    { name: "CONFIG", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-sm px-2">
      <div className="relative group">
        {/* Institutional Glow Protocol */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-[2.5rem] blur-xl opacity-50 pointer-events-none" />
        
        <div className="relative flex items-center justify-around bg-card/70 backdrop-blur-3xl border border-border/40 rounded-[2rem] p-2 md:p-3 shadow-2xl overflow-hidden">
          {quickNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => hapticFeedback("light")}
                className={cn(
                  "relative flex flex-col items-center justify-center p-2.5 md:p-3 rounded-2xl transition-all duration-500 min-w-[64px]",
                  "active:scale-95 touch-manipulation",
                  isActive 
                    ? "bg-primary/10 text-primary scale-105 md:scale-110 shadow-inner" 
                    : "text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100"
                )}
              >
                {/* Active Indicator Pip */}
                {isActive && (
                  <div className="absolute top-1 md:-top-1 h-1 w-1 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                )}
                
                <item.icon className={cn(
                  "h-5 w-5 md:h-6 md:w-6 transition-transform",
                  isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                )} />
                
                <span className={cn(
                  "text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] mt-1.5 transition-all",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 h-0 translate-y-1"
                )}>
                  {item.name}
                </span>

                {/* Tactical Aura */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/5 blur-lg rounded-full -z-10 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
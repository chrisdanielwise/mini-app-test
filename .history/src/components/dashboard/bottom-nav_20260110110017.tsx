"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Wallet, 
  Settings, 
  Activity,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 📱 MOBILE COMMAND CONTROLLER (Tier 2)
 * Floating navigation for on-the-go merchant operations.
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
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-sm">
      <div className="relative group">
        {/* Outer Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-[2.5rem] blur-xl opacity-50" />
        
        <div className="relative flex items-center justify-around bg-card/60 backdrop-blur-3xl border border-border/40 rounded-[2rem] p-3 shadow-2xl">
          {quickNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={cn(
                  "relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-500",
                  isActive ? "bg-primary/10 text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active Indicator Pip */}
                {isActive && (
                  <div className="absolute -top-1 h-1 w-1 rounded-full bg-primary animate-pulse" />
                )}
                
                <item.icon className={cn(
                  "h-5 w-5 transition-transform",
                  isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                )} />
                
                <span className={cn(
                  "text-[7px] font-black uppercase tracking-[0.2em] mt-1.5 transition-opacity",
                  isActive ? "opacity-100" : "opacity-0 h-0"
                )}>
                  {item.name}
                </span>

                {/* Haptic Glow behind active icon */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/5 blur-lg rounded-full -z-10" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
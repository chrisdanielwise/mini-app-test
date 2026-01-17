"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  History, 
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID BOTTOM NAV (Institutional v16.16.12)
 * Logic: Haptic-synced identity horizon with Hardware Persistence.
 * Design: v9.9.1 Hardened Glassmorphism with Subsurface Radiance.
 */
const navItems = [
  { href: "/home", icon: LayoutDashboard, label: "Core_Node" },
  { href: "/services", icon: ShoppingBag, label: "Market_Relay" },
  { href: "/history", icon: History, label: "Ledger_Sync" },
  { href: "/profile", icon: ShieldCheck, label: "Identity" },
]

export function BottomNav() {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-[100] w-full",
      "border-t backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
      "pb-[env(safe-area-inset-bottom,20px)]",
      "rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.6)]",
      isStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-card/60 border-white/5"
    )}>
      
      {/* 🌊 RADIANCE BLOOM: Active Node Glow */}
      <div className="absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto flex h-18 md:h-22 max-w-lg items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { if (!isActive) impact("light"); }}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 min-w-[72px] h-full transition-all duration-500 group",
                isActive ? "scale-110" : "text-muted-foreground/30 hover:text-foreground/60 active:scale-90"
              )}
            >
              {/* --- KINETIC STATUS ANCHOR --- */}
              {isActive && (
                <div className={cn(
                  "absolute -top-px left-1/2 -translate-x-1/2 h-1 w-8 rounded-full blur-[2px] animate-in fade-in slide-in-from-top-2 duration-700",
                  isStaff ? "bg-amber-500 shadow-[0_0_15px_#f59e0b]" : "bg-primary shadow-[0_0_15px_#10b981]"
                )} />
              )}

              <div className={cn(
                "relative size-10 md:size-12 rounded-2xl flex items-center justify-center transition-all duration-700",
                isActive 
                  ? (isStaff ? "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20 shadow-inner" : "bg-primary/10 text-primary ring-1 ring-primary/20 shadow-inner")
                  : "bg-white/[0.02] border border-white/5 group-hover:bg-white/5"
              )}>
                <item.icon className={cn(
                  "size-5 md:size-6 transition-all duration-700",
                  isActive ? "stroke-[2.5px] rotate-0" : "stroke-[2px] -rotate-3 group-hover:rotate-0"
                )} />
                
                {/* 🛰️ REAL-TIME ACTIVITY INDICATORS */}
                {isActive && (
                  <Activity className={cn(
                    "absolute -top-1.5 -right-1.5 size-3 animate-pulse",
                    isStaff ? "text-amber-500" : "text-primary"
                  )} />
                )}
              </div>
              
              <span className={cn(
                "text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] italic transition-all duration-700",
                isActive 
                  ? (isStaff ? "text-amber-500 opacity-100" : "text-primary opacity-100") 
                  : "opacity-20"
              )}>
                {item.label}
              </span>

              {/* 🧪 SUBSURFACE AURA */}
              {isActive && (
                <div className={cn(
                  "absolute inset-0 blur-2xl opacity-10 -z-10 animate-pulse",
                  isStaff ? "bg-amber-500" : "bg-primary"
                )} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
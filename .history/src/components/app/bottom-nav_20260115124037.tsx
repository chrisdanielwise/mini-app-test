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
  Activity,
  Waves
} from "lucide-react";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDevice } from "@/context/device-provider";

/**
 * 🌊 FLUID BOTTOM NAV (Institutional v16.16.29)
 * Logic: Haptic-synced identity horizon with Device-Fluid Interpolation.
 * Design: Kinetic Hyper-Glass with Water-Ease motion and subsurface radiance.
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
  const { safeArea, isMobile } = useDevice();
  const isStaff = flavor === "AMBER";

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-[100] w-full",
      "border-t backdrop-blur-3xl overflow-hidden",
      "transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]", // 🌊 Water-like ease
      "rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-20px_80px_rgba(0,0,0,0.6)]",
      isStaff ? "bg-amber-500/[0.05] border-amber-500/20" : "bg-card/60 border-white/5"
    )}
    style={{ 
      paddingBottom: `calc(${safeArea.bottom}px + 1.5rem)`,
      paddingTop: "0.75rem"
    }}>
      
      {/* 🌊 RADIANCE BLOOM: Kinetic Active Signal Horizon */}
      <div className={cn(
        "absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-30",
        isStaff ? "text-amber-500" : "text-primary"
      )} />

      {/* Subsurface Flow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none opacity-20" />

      <div className={cn(
        "mx-auto flex items-center justify-around px-6",
        isMobile ? "h-16" : "h-20 max-w-lg"
      )}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { if (!isActive) impact("light"); }}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 min-w-[64px] transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group",
                isActive ? "scale-110 -translate-y-1" : "text-muted-foreground/30 hover:text-foreground/60 active:scale-90"
              )}
            >
              {/* --- KINETIC ANCHOR: Fluid Droplet --- */}
              {isActive && (
                <div className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 h-1.5 w-8 rounded-full blur-[2px] animate-in fade-in zoom-in duration-1000",
                  isStaff ? "bg-amber-500 shadow-[0_0_20px_#f59e0b]" : "bg-primary shadow-[0_0_20px_#10b981]"
                )} />
              )}

              <div className={cn(
                "relative size-12 md:size-14 rounded-2xl flex items-center justify-center transition-all duration-1000",
                isActive 
                  ? (isStaff ? "bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/40 shadow-inner" : "bg-primary/15 text-primary ring-1 ring-primary/40 shadow-inner")
                  : "bg-white/[0.03] border border-white/5 group-hover:bg-white/10 group-hover:border-white/10"
              )}>
                <item.icon className={cn(
                  "size-5.5 md:size-6.5 transition-all duration-1000 ease-[var(--ease-institutional)]",
                  isActive ? "stroke-[2.5px] drop-shadow-glow" : "stroke-[2px] opacity-60"
                )} />
                
                {/* 🛰️ TELEMETRY PULSE: Signal Flow */}
                {isActive && (
                  <Activity className={cn(
                    "absolute -top-1 -right-1 size-3.5 animate-pulse",
                    isStaff ? "text-amber-500" : "text-primary"
                  )} />
                )}
                
                {/* Background Waves Animation for active item */}
                {isActive && <Waves className="absolute inset-0 size-full opacity-[0.05] animate-pulse pointer-events-none" />}
              </div>
              
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.35em] italic transition-all duration-1000 leading-none",
                isActive 
                  ? (isStaff ? "text-amber-500 opacity-100" : "text-primary opacity-100") 
                  : "opacity-20"
              )}>
                {item.label}
              </span>

              {/* 🧪 SUBSURFACE AURA: Atmospheric Glow */}
              {isActive && (
                <div className={cn(
                  "absolute inset-0 blur-3xl opacity-20 -z-10 animate-pulse scale-150 transition-all duration-1000",
                  isStaff ? "bg-amber-500/40" : "bg-primary/40"
                )} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
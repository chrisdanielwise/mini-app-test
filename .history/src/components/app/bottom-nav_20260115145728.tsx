"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  History, 
  ShieldCheck,
  Activity,
  Waves
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

const navItems = [
  { href: "/home", icon: LayoutDashboard, label: "Core_Node" },
  { href: "/services", icon: ShoppingBag, label: "Market_Relay" },
  { href: "/history", icon: History, label: "Ledger_Sync" },
  { href: "/profile", icon: ShieldCheck, label: "Identity" },
]

/**
 * 🌊 BOTTOM_NAV (Institutional Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, safeArea).
 * Logic: Morphology-Aware sticky anchor with water-ease kinetic flow.
 */
export default function BottomNav() {
  const pathname = usePathname();
  const { flavor } = useLayout(); //
  const { impact } = useHaptics(); //
  
  // 🛰️ DEVICE INGRESS: Consuming full morphology physics
  const { 
    isMobile, 
    isTablet, 
    screenSize, 
    isPortrait, 
    safeArea, 
    viewportWidth,
    isReady 
  } = useDeviceContext(); //

  const isStaff = flavor === "AMBER"; //

  // 🛡️ HYDRATION GUARD: Prevents navigation "flicker" during hardware handshake
  if (!isReady || !isMobile) return null; //

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating tactical width and height based on hardware tier.
   */
  const navMaxWidth = isTablet ? "max-w-xl" : "max-w-md";
  const iconSize = screenSize === 'xs' ? "size-10" : "size-12 md:size-14";
  const navHeight = screenSize === 'xs' ? "h-16" : "h-20";

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] w-full",
        "border-t backdrop-blur-3xl overflow-hidden",
        "transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]", 
        "rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-20px_80px_rgba(0,0,0,0.6)]",
        isStaff ? "bg-amber-500/[0.05] border-amber-500/20" : "bg-card/60 border-white/5"
      )}
      style={{ 
        paddingBottom: `calc(${safeArea.bottom}px + 1rem)`, //
        paddingTop: "0.75rem"
      }}
    >
      {/* 🌊 RADIANCE BLOOM: Active Signal Horizon */}
      <div className={cn(
        "absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-30",
        isStaff ? "text-amber-500" : "text-primary"
      )} />

      <div className={cn("mx-auto flex items-center justify-around px-6", navMaxWidth, navHeight)}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { if (!isActive) impact("light"); }} //
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] group",
                isActive ? "scale-110 -translate-y-1" : "text-muted-foreground/30 hover:text-foreground/60 active:scale-90",
                screenSize === 'xs' ? "min-w-[56px]" : "min-w-[72px]"
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
                "relative rounded-2xl flex items-center justify-center transition-all duration-1000",
                iconSize,
                isActive 
                  ? (isStaff ? "bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/40 shadow-inner" : "bg-primary/15 text-primary ring-1 ring-primary/40 shadow-inner")
                  : "bg-white/[0.03] border border-white/5 group-hover:bg-white/10 group-hover:border-white/10"
              )}>
                <item.icon className={cn(
                  "transition-all duration-1000",
                  screenSize === 'xs' ? "size-5" : "size-6",
                  isActive ? "stroke-[2.5px]" : "stroke-[2px] opacity-60"
                )} />
                
                {/* 🛰️ TELEMETRY PULSE: Signal Flow */}
                {isActive && (
                  <Activity className={cn(
                    "absolute -top-1 -right-1 size-3.5 animate-pulse",
                    isStaff ? "text-amber-500" : "text-primary"
                  )} />
                )}
                
                {isActive && <Waves className="absolute inset-0 size-full opacity-[0.05] animate-pulse pointer-events-none" />}
              </div>
              
              {/* Hide labels on Portrait XS to maximize vertical real estate */}
              {!(screenSize === 'xs' && isPortrait) && (
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.35em] italic transition-all duration-1000 leading-none",
                  isActive ? (isStaff ? "text-amber-500 opacity-100" : "text-primary opacity-100") : "opacity-20"
                )}>
                  {item.label.split('_')[0]}
                </span>
              )}

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
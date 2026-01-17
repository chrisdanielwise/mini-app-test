"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, History, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

const navItems = [
  { href: "/home", icon: LayoutDashboard, label: "Core" },
  { href: "/services", icon: ShoppingBag, label: "Market" },
  { href: "/history", icon: History, label: "Ledger" },
  { href: "/profile", icon: ShieldCheck, label: "Identity" },
]

/**
 * 🛰️ BOTTOM_NAV (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon.
 * Fix: High-density h-16 profile prevents vertical blowout on XS hardware.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  const { isMobile, isTablet, screenSize, isPortrait, safeArea, isReady } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevents "Bogus" layout snap during hardware sync
  if (!isReady || !isMobile) return null;

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] w-full",
        "border-t backdrop-blur-2xl transition-all duration-700 h-16", // Reduced h-20 -> h-16
        "bg-zinc-950/80 border-white/5 rounded-t-2xl shadow-2xl",
        isStaff && "bg-amber-500/[0.01] border-amber-500/10"
      )}
      style={{ 
        paddingBottom: `calc(${safeArea.bottom}px * 0.5)`, // Tightened safe-area multiplier
        paddingTop: "0.5rem"
      }}
    >
      <div className="mx-auto flex items-center justify-around px-4 max-w-md h-full relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => !isActive && impact("light")}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 transition-all duration-500",
                isActive ? "text-primary scale-105" : "text-muted-foreground/20 hover:text-foreground/40",
                screenSize === 'xs' ? "min-w-[48px]" : "min-w-[64px]"
              )}
            >
              <div className={cn(
                "relative rounded-xl flex items-center justify-center transition-all",
                "size-9", // Standardized icon container
                isActive && (isStaff ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary")
              )}>
                <item.icon className={cn(
                  "size-5 transition-all",
                  isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                )} />
                
                {isActive && (
                  <Activity className={cn(
                    "absolute -top-1 -right-1 size-2.5 animate-pulse",
                    isStaff ? "text-amber-500" : "text-primary"
                  )} />
                )}
              </div>
              
              {/* Institutional Scale Labels */}
              {!(screenSize === 'xs' && isPortrait) && (
                <span className={cn(
                  "text-[7px] font-black uppercase tracking-widest italic leading-none transition-all",
                  isActive ? "opacity-100" : "opacity-20"
                )}>
                  {item.label}
                </span>
              )}

              {/* 🌫️ SUBSURFACE AURA */}
              {isActive && (
                <div className={cn(
                  "absolute inset-0 blur-2xl opacity-10 -z-10 scale-125 transition-all",
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
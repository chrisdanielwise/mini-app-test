"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayout } from "@/context/layout-provider";
import { 
  Home, 
  History, 
  User, 
  ShoppingBag, 
  LayoutDashboard,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ TACTICAL_BOTTOM_NAV (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Clamping.
 * Fix: Synchronized with --tg-safe-bottom for hardware clearance.
 * Fix: Balanced 5-node topology for high-density dashboard navigation.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { flavor, setThemeFlavor } = useLayout();
  const { isReady, safeArea, isMobile } = useDeviceContext();
  const { impact, selectionChange } = useHaptics();

  // 🛡️ Logic for determining user roles (adjust based on your auth implementation)
  const isStaff = flavor === "AMBER"; 

  if (!isMobile) return null;

  // 🛡️ HYDRATION SHIELD: Prevents layout jump during Telegram handshake
  if (!isReady) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6">
        <div className="flex h-14 items-center justify-around rounded-2xl border border-white/5 bg-black/80 backdrop-blur-3xl animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="size-5 rounded-md bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  // 🕵️ NAVIGATION TOPOLOGY (True Dashboard Home Structure)
  const navItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard }, // Principal Dashboard Entry
    { label: "Market", href: "/services", icon: ShoppingBag },
    { label: "Ledger", href: "/history", icon: History },
    { label: "Identity", href: "/settings", icon: User },
  ];

  const handleToggleFlavor = () => {
    const newFlavor = flavor === "AMBER" ? "EMERALD" : "AMBER";
    setThemeFlavor(newFlavor);
    impact("heavy");
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none px-4"
      style={{ 
        /* 🏁 HARDWARE SYNC: Clears the Telegram Home Indicator */
        paddingBottom: `calc(env(safe-area-inset-bottom, ${safeArea.bottom}px) + 0.75rem)` 
      }}
    >
      <nav 
        className={cn(
          "pointer-events-auto relative flex items-center justify-around transition-all duration-700",
          "h-14 w-full max-w-md mx-auto rounded-2xl border bg-black/90 backdrop-blur-2xl shadow-2xl",
          isStaff ? "border-amber-500/10" : "border-white/5"
        )}
      >
        {/* 🌫️ TACTICAL RADIANCE: Subtle bottom glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />

        {navItems.map((item) => {
          // Precise active state matching
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (!isActive) selectionChange();
              }}
              className={cn(
                "group relative flex flex-col items-center justify-center h-full flex-1 transition-all duration-500",
                isActive 
                  ? (isStaff ? "text-amber-500" : "text-primary") 
                  : "text-muted-foreground/20 hover:text-muted-foreground/40"
              )}
            >
              {/* 💧 KINETIC DROPLET: Active indicator */}
              {isActive && (
                <div className={cn(
                  "absolute top-0 h-0.5 w-4 rounded-full blur-[0.5px] animate-in slide-in-from-top-1 duration-500",
                  isStaff ? "bg-amber-500" : "bg-primary"
                )} />
              )}
              
              <Icon className={cn(
                "size-4.5 transition-all duration-500 group-active:scale-90", 
                isActive && "scale-110 drop-shadow-[0_0_8px_currentColor]"
              )} />
              
              <span className={cn(
                "text-[6px] font-black uppercase tracking-[0.2em] italic mt-1 leading-none transition-all duration-500",
                isActive ? "opacity-100" : "opacity-30"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* 🛰️ TACTICAL FLAVOR SHIFT (Staff Quick-Action) */}
        {isStaff && (
          <button
            onClick={handleToggleFlavor}
            className="mx-2 flex size-9 shrink-0 flex-col items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500 transition-all active:scale-90"
          >
            <Activity className="size-3.5" />
            <span className="text-[5px] font-black uppercase mt-0.5 opacity-40">Mode</span>
          </button>
        )}
      </nav>
    </div>
  );
}
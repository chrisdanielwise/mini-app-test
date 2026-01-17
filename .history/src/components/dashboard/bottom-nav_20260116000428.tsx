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
  Terminal,
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🌊 TACTICAL_BOTTOM_NAV (Institutional Apex v2026.1.15)
 * Strategy: High-density, low-profile navigation membrane.
 * Fix: Standardized to a 64px-72px height range to prevent layout distortion.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { flavor, setThemeFlavor } = useLayout();
  
  // 🛰️ DEVICE & AUTH INGRESS
  const { isReady, screenSize, safeArea, isMobile } = useDeviceContext();
  const { isAuthenticated, isLoading, user, isStaff } = useInstitutionalAuth();
  const { impact, selectionChange } = useHaptics();

  /**
   * 🛡️ HYDRATION SHIELD: Tactical Shimmer
   */
  if (!isReady || isLoading) {
    return (
      <div className="relative flex items-center justify-around rounded-2xl border border-white/5 bg-black/40 p-3 h-16 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <Skeleton className="size-4 rounded-md bg-white/5" />
            <Skeleton className="h-1 w-6 bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  // 🕵️ NAVIGATION TOPOLOGY: Role-aware node injection
  const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Market", href: "/services", icon: ShoppingBag },
    ...(isStaff ? [{ label: "Oversight", href: "/dashboard", icon: LayoutDashboard }] : []),
    { label: "Ledger", href: "/history", icon: History },
    { label: "Identity", href: "/settings", icon: User },
  ];

  const handleToggleFlavor = () => {
    const newFlavor = flavor === "AMBER" ? "EMERALD" : "AMBER";
    setThemeFlavor(newFlavor);
    impact("heavy");
  };

  if (!isMobile) return null;

  return (
    <nav 
      className={cn(
        "relative flex items-center justify-around border-t backdrop-blur-3xl transition-all duration-1000",
        "rounded-2xl p-2 mx-auto max-w-md bg-black/80 border-white/5 shadow-2xl",
        screenSize === 'xs' ? "pb-2" : "pb-3"
      )}
    >
      {/* 🌫️ TACTICAL RADIANCE: Low-weight Active Marker */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-10 pointer-events-none" />

      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        const isOversight = item.label === "Oversight";

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => selectionChange()}
            className={cn(
              "group relative flex flex-col items-center gap-1.5 p-2 transition-all duration-500",
              isActive 
                ? (isOversight ? "text-amber-500" : "text-primary") 
                : "text-muted-foreground/20 hover:text-muted-foreground/40"
            )}
          >
            {/* 💧 KINETIC DROPLET: Active Marker */}
            {isActive && (
              <div className={cn(
                "absolute -top-1 h-1 w-4 rounded-full blur-[1px] animate-in slide-in-from-top-2 duration-700",
                isOversight ? "bg-amber-500" : "bg-primary"
              )} />
            )}
            
            <Icon className={cn(
              "size-5 transition-all duration-500 group-active:scale-90", 
              isActive && "scale-105 drop-shadow-[0_0_8px_currentColor]"
            )} />
            
            <span className={cn(
              "text-[7px] font-black uppercase tracking-[0.2em] italic leading-none transition-all duration-500",
              isActive ? "opacity-100 translate-y-0" : "opacity-30 translate-y-0.5"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* 🛰️ TACTICAL FLAVOR SHIFT */}
      {isStaff && (
        <button
          onClick={handleToggleFlavor}
          className={cn(
            "ml-1 flex size-10 flex-col items-center justify-center rounded-xl border transition-all duration-700 active:scale-90 shadow-inner",
            flavor === "AMBER" 
              ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
              : "bg-white/[0.02] border-white/5 text-muted-foreground/20"
          )}
        >
          <Activity className="size-4" />
          <span className="text-[5px] font-black uppercase mt-1 leading-none tracking-tighter">MODE</span>
        </button>
      )}
    </nav>
  );
}
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
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ TACTICAL_BOTTOM_NAV (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Clamping.
 * Fix: Forced h-14 height and py-1 row density for a minimalist footprint.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { flavor, setThemeFlavor } = useLayout();
  const { isReady, screenSize, safeArea, isMobile } = useDeviceContext();
  const { isAuthenticated, isLoading, isStaff } = useInstitutionalAuth();
  const { impact, selectionChange } = useHaptics();

  if (!isMobile) return null;

  // 🛡️ HYDRATION SHIELD: Ultra-Slim Shimmer
  if (!isReady || isLoading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4">
        <div className="flex h-14 items-center justify-around rounded-2xl border border-white/5 bg-black/80 backdrop-blur-3xl animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="size-5 rounded-md bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  // 🕵️ NAVIGATION TOPOLOGY
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

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none px-4"
      style={{ paddingBottom: `calc(${safeArea.bottom}px + 0.75rem)` }}
    >
      <nav 
        className={cn(
          "pointer-events-auto relative flex items-center justify-around transition-all duration-700",
          "h-14 w-full max-w-md mx-auto rounded-2xl border bg-black/90 backdrop-blur-2xl shadow-2xl",
          isStaff && flavor === "AMBER" ? "border-amber-500/10" : "border-white/5"
        )}
      >
        {/* 🌫️ TACTICAL RADIANCE */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />

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
                "group relative flex flex-col items-center justify-center h-full flex-1 transition-all duration-500",
                isActive 
                  ? (isOversight ? "text-amber-500" : "text-primary") 
                  : "text-muted-foreground/20 hover:text-muted-foreground/40"
              )}
            >
              {/* 💧 KINETIC DROPLET */}
              {isActive && (
                <div className={cn(
                  "absolute top-0 h-0.5 w-4 rounded-full blur-[0.5px] animate-in slide-in-from-top-1 duration-500",
                  isOversight ? "bg-amber-500" : "bg-primary"
                )} />
              )}
              
              <Icon className={cn(
                "size-4.5 md:size-5 transition-all duration-500 group-active:scale-90", 
                isActive && "scale-110 drop-shadow-[0_0_6px_currentColor]"
              )} />
              
              <span className={cn(
                "text-[6.5px] font-black uppercase tracking-[0.15em] italic mt-1 leading-none transition-all duration-500",
                isActive ? "opacity-100" : "opacity-30"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* 🛰️ TACTICAL FLAVOR SHIFT (Staff Hub Only) */}
        {isStaff && (
          <button
            onClick={handleToggleFlavor}
            className={cn(
              "mx-2 flex size-9 shrink-0 flex-col items-center justify-center rounded-xl border transition-all duration-700 active:scale-90 shadow-inner",
              flavor === "AMBER" 
                ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                : "bg-white/[0.02] border-white/5 text-muted-foreground/20"
            )}
          >
            <Activity className="size-3.5" />
            <span className="text-[5px] font-black uppercase mt-0.5 leading-none">MODE</span>
          </button>
        )}
      </nav>
    </div>
  );
}
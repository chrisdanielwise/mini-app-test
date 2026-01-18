"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  History, 
  User, 
  Layers, 
  LayoutDashboard,
  Terminal,
  Activity,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useTelegramContext } from "../providers/telegram-provider";

/**
 * 🛰️ TACTICAL_DASHBOARD_NAV (Institutional Apex v2026.1.20)
 * Strategy: Internal Loop Navigation.
 * Mission: Ensure Merchant/Staff stay within the /dashboard domain.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { auth, isReady: isTgReady } = useTelegramContext();
  const { flavor, setThemeFlavor } = useLayout();
  const { isReady: isDeviceReady, safeArea, isMobile } = useDeviceContext();
  const { impact, selectionChange } = useHaptics();

  const isLoading = !isTgReady || !isDeviceReady || auth.isLoading;

  if (!isMobile && isDeviceReady) return null;

  if (isLoading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-8">
        <div className="flex h-14 items-center justify-around rounded-2xl border border-white/5 bg-black/80 backdrop-blur-3xl animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="size-5 rounded-md bg-white/5" />
              <Skeleton className="h-1.5 w-6 bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🛡️ DYNAMIC INTERNAL TOPOLOGY
  // We lock these to /dashboard sub-routes
  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Assets", href: "/dashboard/services", icon: Layers },
    { label: "Ledger", href: "/dashboard/payments", icon: History },
    { label: "Identity", href: "/dashboard/profile", icon: User },
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
        paddingBottom: `calc(env(safe-area-inset-bottom, ${safeArea?.bottom || 0}px) + 1.5rem)` 
      }}
    >
      <nav 
        className={cn(
          "pointer-events-auto relative flex items-center justify-around transition-all duration-700",
          "h-14 w-full max-w-md mx-auto rounded-2xl border bg-black/95 backdrop-blur-2xl shadow-2xl",
          flavor === "AMBER" ? "border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "border-white/5"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />

        {navItems.map((item) => {
          // Strict path matching for the dashboard root
          const isActive = item.href === "/dashboard" 
            ? pathname === "/dashboard" 
            : pathname.startsWith(item.href);
            
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => !isActive && selectionChange()}
              className={cn(
                "group relative flex flex-col items-center justify-center h-full flex-1 transition-all duration-500",
                isActive 
                  ? (flavor === "AMBER" ? "text-amber-500" : "text-primary") 
                  : "text-muted-foreground/20 hover:text-muted-foreground/40"
              )}
            >
              {isActive && (
                <div className={cn(
                  "absolute top-0 h-0.5 w-4 rounded-full blur-[0.5px] animate-in slide-in-from-top-1 duration-500",
                  flavor === "AMBER" ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : "bg-primary shadow-[0_0_8px_#10b981]"
                )} />
              )}
              
              <Icon className={cn(
                "size-4 transition-all duration-500 group-active:scale-90", 
                isActive && "scale-110 drop-shadow-[0_0_8px_currentColor]"
              )} />
              
              <span className={cn(
                "text-[6px] font-black uppercase tracking-[0.2em] italic mt-1 leading-none transition-all",
                isActive ? "opacity-100" : "opacity-30"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* 🛰️ SYSTEM OVERRIDE (Staff Only Visual Indicator) */}
        {flavor === "AMBER" && (
          <button
            onClick={handleToggleFlavor}
            className="mx-2 flex size-8 shrink-0 flex-col items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/20 text-amber-500 active:scale-90 transition-all"
          >
            <ShieldCheck className="size-3.5" />
            <span className="text-[4px] font-black uppercase mt-0.5">Admin</span>
          </button>
        )}
      </nav>
    </div>
  );
}
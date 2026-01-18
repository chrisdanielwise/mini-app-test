"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  History, 
  User, 
  ShoppingBag, 
  LayoutDashboard,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
// 🚩 PATH_CORRECTION: Relative provider path
import { useTelegramContext } from "../providers/telegram-provider";

/**
 * 🛰️ TACTICAL_BOTTOM_NAV (Hardened v16.16.51)
 * Strategy: Vertical Compression & Hardware-Safe Morphology.
 * Standards Alignment: Institutional Apex v2026.1.20.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { auth, isReady: isTgReady } = useTelegramContext();
  const { flavor, setThemeFlavor } = useLayout();
  const { isReady: isDeviceReady, safeArea, isMobile } = useDeviceContext();
  const { impact, selectionChange } = useHaptics();

  // 🛡️ HYDRATION SHIELD: Prevents layout collapse during identity handshake
  const isLoading = !isTgReady || !isDeviceReady || auth.isLoading;

  if (!isMobile && isDeviceReady) return null;

  if (isLoading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-8">
        <div className="flex h-14 items-center justify-around rounded-2xl border border-white/5 bg-black/80 backdrop-blur-3xl animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="size-5 rounded-md bg-white/5" />
              <Skeleton className="h-1.5 w-6 bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🕵️ DYNAMIC NAVIGATION TOPOLOGY
  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);

  const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Market", href: "/services", icon: ShoppingBag },
    ...(isStaff ? [{ label: "Dash", href: "/dashboard", icon: LayoutDashboard }] : []),
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
        /* 📐 THE SYNC: h-14 (56px) + safeArea + 1.5rem Buffer */
        paddingBottom: `calc(env(safe-area-inset-bottom, ${safeArea?.bottom || 0}px) + 1.5rem)` 
      }}
    >
      <nav 
        className={cn(
          "pointer-events-auto relative flex items-center justify-around transition-all duration-700",
          "h-14 w-full max-w-md mx-auto rounded-2xl border bg-black/95 backdrop-blur-2xl shadow-2xl",
          flavor === "AMBER" ? "border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]" : "border-white/5"
        )}
      >
        {/* 🌫️ TACTICAL RADIANCE */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          const Icon = item.icon;
          const isDashNode = item.label === "Dash";

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => !isActive && selectionChange()}
              className={cn(
                "group relative flex flex-col items-center justify-center h-full flex-1 transition-all duration-500",
                isActive 
                  ? (isDashNode || flavor === "AMBER" ? "text-amber-500" : "text-primary") 
                  : "text-muted-foreground/20 hover:text-muted-foreground/40"
              )}
            >
              {/* 💧 KINETIC DROPLET */}
              {isActive && (
                <div className={cn(
                  "absolute top-0 h-0.5 w-4 rounded-full blur-[0.5px] animate-in slide-in-from-top-1 duration-500",
                  (isDashNode || flavor === "AMBER") ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : "bg-primary shadow-[0_0_8px_#10b981]"
                )} />
              )}
              
              <Icon className={cn(
                "size-5 transition-all duration-500 group-active:scale-90", 
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

        {/* 🛰️ TACTICAL FLAVOR SHIFT (Staff Node Only) */}
        {isStaff && (
          <button
            onClick={handleToggleFlavor}
            className={cn(
              "mx-2 flex size-9 shrink-0 flex-col items-center justify-center rounded-xl border transition-all active:scale-90",
              flavor === "AMBER" 
                ? "bg-amber-500/20 border-amber-500/40 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
                : "bg-white/5 border-white/10 text-white/20"
            )}
          >
            <Terminal className="size-3.5" />
            <span className="text-[5px] font-black uppercase mt-0.5 opacity-40">Mode</span>
          </button>
        )}
      </nav>
    </div>
  );
}
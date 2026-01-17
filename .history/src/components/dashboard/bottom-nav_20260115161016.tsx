"use client";

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
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🌊 FLUID_BOTTOM_NAV (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Markers | Vapour-Glass backdrop.
 * Logic: Morphology-aware safe-area clamping with Handshake Hydration.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { flavor, setThemeFlavor } = useLayout();
  
  // 🛰️ DEVICE & AUTH INGRESS
  const { isReady, screenSize, safeArea, isMobile } = useDeviceContext();
  const { isAuthenticated, isLoading, user, isStaff } = useInstitutionalAuth();
  const { impact, selectionChange } = useHaptics();

  /**
   * 🛡️ HYDRATION SHIELD: Shimmering Handshake
   * Clamped to h-20 for consistent layout pre-painting.
   */
  if (!isReady || isLoading) {
    return (
      <div className="relative flex items-center justify-around rounded-[2.5rem] border border-white/5 bg-card/40 p-4 backdrop-blur-3xl shadow-apex h-20 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="size-6 rounded-lg bg-white/5" />
            <Skeleton className="h-2 w-8 bg-white/5" />
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
    impact("heavy"); // 🏁 TACTILE SYNC: Mode shift feedback
  };

  // Only render on mobile tiers; layout.tsx handles desktop sidebar/topbar logic
  if (!isMobile) return null;

  return (
    <nav 
      className={cn(
        "relative flex items-center justify-around border-t border-white/10 bg-card/80 backdrop-blur-3xl shadow-apex transition-all duration-1000",
        "rounded-[2.5rem] p-3 mx-auto max-w-md",
        screenSize === 'xs' ? "pb-2" : "pb-4"
      )}
    >
      {/* 🌫️ VAPOUR RADIANCE: Active Background Wash */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-30 pointer-events-none" />

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
              "group relative flex flex-col items-center gap-1.5 p-3 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              isActive 
                ? (isOversight ? "text-amber-500" : "text-primary") 
                : "text-muted-foreground/20 hover:text-muted-foreground/60"
            )}
          >
            {/* 💧 KINETIC DROPLET: Active Marker */}
            {isActive && (
              <div className={cn(
                "absolute -top-1 h-1.5 w-6 rounded-full blur-[1px] animate-in slide-in-from-top-3 duration-1000",
                isOversight ? "bg-amber-500 shadow-[0_0_15px_#f59e0b]" : "bg-primary shadow-[0_0_15px_#10b981]"
              )} />
            )}
            
            <Icon className={cn(
              "size-6 transition-all duration-700 group-active:scale-75", 
              isActive && "scale-110 drop-shadow-[0_0_10px_currentColor]"
            )} />
            
            <span className={cn(
              "text-[8px] font-black uppercase tracking-[0.3em] italic transition-all duration-700 leading-none",
              isActive ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* 🛰️ TELEMETRY SHIFT: Staff Flavor Toggle */}
      {isStaff && (
        <button
          onClick={handleToggleFlavor}
          className={cn(
            "ml-2 flex size-12 flex-col items-center justify-center rounded-2xl border transition-all duration-1000 active:scale-90 shadow-inner",
            flavor === "AMBER" 
              ? "bg-amber-500 border-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
              : "bg-white/5 border-white/5 text-muted-foreground/20"
          )}
        >
          <Terminal className="size-5" />
          <span className="text-[6px] font-black uppercase mt-1 leading-none">MODE</span>
        </button>
      )}
    </nav>
  );
}
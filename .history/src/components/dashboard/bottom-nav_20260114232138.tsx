"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { useLayout } from "@/context/layout-provider";
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
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID BOTTOM NAV (v16.16.12)
 * Logic: Haptic-synced kinetic navigation with Handshake Placeholder.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { auth, isReady } = useTelegramContext();
  const { flavor, setThemeFlavor } = useLayout();
  const { impact, selectionChange } = useHaptics();

  /**
   * 🛡️ THE FIX: SHIMMERING HANDSHAKE
   */
  if (!isReady || auth.isLoading) {
    return (
      <div className="relative flex items-center justify-around rounded-[2rem] border border-white/5 bg-card/40 p-3 backdrop-blur-3xl shadow-2xl h-18 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="size-6 rounded-lg bg-white/5" />
            <Skeleton className="h-1.5 w-8 bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);

  const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Market", href: "/services", icon: ShoppingBag },
    ...(isStaff ? [{ label: "Dash", href: "/dashboard", icon: LayoutDashboard }] : []),
    { label: "Ledger", href: "/history", icon: History },
    { label: "Profile", href: "/settings", icon: User },
  ];

  const handleToggleFlavor = () => {
    const newFlavor = flavor === "AMBER" ? "EMERALD" : "AMBER";
    setThemeFlavor(newFlavor);
    impact("heavy"); // 🏁 TACTILE SYNC: Mode shift feedback
  };

  return (
    <nav className="relative flex items-center justify-around rounded-[2rem] border border-white/10 bg-card/80 p-3 pb-4 backdrop-blur-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] overflow-hidden">
      {/* 🌊 AMBIENT RADIANCE: Active Background Wash */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-50 pointer-events-none" />

      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        const isDash = item.label === "Dash";

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => selectionChange()} // 🏁 TACTILE SYNC: Selection tick
            className={cn(
              "group relative flex flex-col items-center gap-1.5 p-2 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
              isActive 
                ? (isDash ? "text-amber-500" : "text-primary") 
                : "text-muted-foreground/30 hover:text-muted-foreground/60"
            )}
          >
            {/* 🌊 KINETIC DROPLET: Active Marker */}
            {isActive && (
              <div className={cn(
                "absolute -top-3 h-1.5 w-5 rounded-full blur-[2px] animate-in slide-in-from-top-2 duration-500",
                isDash ? "bg-amber-500 shadow-[0_0_15px_#f59e0b]" : "bg-primary shadow-[0_0_15px_#10b981]"
              )} />
            )}
            
            <Icon className={cn(
              "size-6 transition-all duration-500 group-active:scale-75", 
              isActive && "scale-110 drop-shadow-[0_0_8px_currentColor]"
            )} />
            
            <span className={cn(
              "text-[8px] font-black uppercase tracking-[0.2em] italic transition-all duration-500",
              isActive ? "opacity-100 translate-y-0" : "opacity-40 translate-y-0.5"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}

      {isStaff && (
        <button
          onClick={handleToggleFlavor}
          className={cn(
            "ml-2 flex size-12 flex-col items-center justify-center rounded-2xl border transition-all duration-700 active:scale-90",
            flavor === "AMBER" 
              ? "bg-amber-500 border-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
              : "bg-white/5 border-white/5 text-muted-foreground/20 hover:text-muted-foreground/40"
          )}
        >
          <Terminal className="size-5" />
          <span className="text-[6px] font-black uppercase mt-0.5">MODE</span>
        </button>
      )}
    </nav>
  );
}
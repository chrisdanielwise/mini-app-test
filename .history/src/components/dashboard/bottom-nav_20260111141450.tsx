"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
// import { useLayout } from "@/context/layout-context";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { 
  Home, 
  History, 
  User, 
  ShoppingBag, 
  LayoutDashboard, // 🛡️ Added for Staff Ingress
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";

/**
 * 📱 UNIFIED BOTTOM NAV (Universal Tier)
 * Dynamically injects the Dashboard route if the identity node has Staff clearance.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { auth } = useTelegramContext();
  const { flavor, setThemeFlavor } = useLayout();

  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);

  // 1. DYNAMIC ROUTE MAPPING
  const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Market", href: "/services", icon: ShoppingBag },
    // 🛡️ INJECTION: Staff see the Dashboard as a primary node
    ...(isStaff ? [{ label: "Dash", href: "/dashboard", icon: LayoutDashboard }] : []),
    { label: "Ledger", href: "/history", icon: History },
    { label: "Profile", href: "/profile", icon: User },
  ];

  const handleToggleFlavor = () => {
    const newFlavor = flavor === "AMBER" ? "EMERALD" : "AMBER";
    setThemeFlavor(newFlavor);
    hapticFeedback("heavy");
  };

  return (
    <nav className="relative flex items-center justify-around rounded-2xl border border-border/40 bg-card/70 p-2 backdrop-blur-3xl shadow-2xl overflow-hidden">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => hapticFeedback("light")}
            className={cn(
              "relative flex flex-col items-center gap-1 p-2 transition-all duration-500",
              isActive 
                ? (item.label === "Dash" ? "text-amber-500" : "text-primary") 
                : "text-muted-foreground/40"
            )}
          >
            {isActive && (
              <div className={cn(
                "absolute -top-1 h-1 w-3 rounded-full animate-in fade-in zoom-in",
                item.label === "Dash" ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : "bg-primary shadow-[0_0_8px_#10b981]"
              )} />
            )}
            <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
            <span className="text-[7px] font-black uppercase tracking-[0.1em]">{item.label}</span>
          </Link>
        );
      })}

      {/* ⚡ CONTEXT SWITCHER: Quickly swap between Staff (Amber) and User (Emerald) themes */}
      {isStaff && (
        <button
          onClick={handleToggleFlavor}
          className={cn(
            "ml-1 flex h-10 w-10 flex-col items-center justify-center rounded-xl border transition-all duration-500",
            flavor === "AMBER" 
              ? "bg-amber-500 border-amber-500/20 text-black shadow-lg" 
              : "bg-muted/10 border-border/10 text-muted-foreground/20"
          )}
        >
          <Terminal className="h-4 w-4" />
          <span className="text-[5px] font-black uppercase mt-0.5">MODE</span>
        </button>
      )}
    </nav>
  );
}
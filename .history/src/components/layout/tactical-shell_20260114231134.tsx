"use client";

import React, { useMemo, memo } from "react";
import { usePathname } from "next/navigation";
// import { useDeviceContext } from "@/lib/hooks/use-device-context";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Home, 
  History, 
  Settings, 
  ShieldAlert 
} from "lucide-react";
import Link from "next/link";
import { useDeviceContext } from "../providers/device-provider";

/**
 * 🛰️ TACTICAL SHELL (Institutional v16.16.12)
 * Philosophy: Atomic RBAC Gating & Fluid Container Adaptation.
 * Standards: v9.5.8 (Fluid), v9.4.4 (RBAC/Security).
 */
export const TacticalShell = memo(({ children }: { children: React.ReactNode }) => {
  const { isMobile, isDesktop, isTablet, isReady } = useDeviceContext();
  const { auth } = useTelegramContext();
  const pathname = usePathname();

  // 🛡️ RBAC ENGINE: Memoized permission resolution (v9.4.4)
  const navigationNodes = useMemo(() => {
    const role = auth.user?.role?.toUpperCase() || "USER";
    
    const nodes = [
      { name: "Home", path: "/home", icon: Home, access: ["USER", "MERCHANT", "AMBER", "SUPER_ADMIN"] },
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, access: ["MERCHANT", "AMBER", "SUPER_ADMIN"] },
      { name: "History", path: "/history", icon: History, access: ["USER", "MERCHANT", "AMBER", "SUPER_ADMIN"] },
      { name: "Admin", path: "/admin", icon: ShieldAlert, access: ["AMBER", "SUPER_ADMIN"] },
      { name: "Settings", path: "/settings", icon: Settings, access: ["USER", "MERCHANT", "AMBER", "SUPER_ADMIN"] },
    ];

    // Tactical Filtering: Only return nodes the user has clearance for
    return nodes.filter(node => node.access.includes(role));
  }, [auth.user?.role]);

  if (!isReady) return null; // Prevent hydration mismatch

  return (
    <div className="relative flex min-h-[var(--tg-viewport-h)] w-full overflow-hidden bg-background">
      
      {/* 💻 DESKTOP/TABLET: Institutional Side Rail (v9.5.0) */}
      {(isDesktop || isTablet) && (
        <aside className="relative z-50 flex h-screen w-20 flex-col items-center border-r border-border/10 bg-card/40 py-8 backdrop-blur-2xl transition-all hover:w-64 group">
          <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl">
            <span className="font-black italic">Z</span>
          </div>
          
          <nav className="flex flex-1 flex-col gap-4 px-4 w-full">
            {navigationNodes.map((node) => (
              <Link 
                key={node.path} 
                href={node.path}
                className={cn(
                  "flex items-center gap-4 rounded-xl p-3 transition-all active:scale-95",
                  pathname === node.path 
                    ? "bg-primary/10 text-primary shadow-inner" 
                    : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                )}
              >
                <node.icon className="h-6 w-6 shrink-0" />
                <span className="hidden group-hover:block text-[10px] font-black uppercase tracking-widest transition-opacity duration-300">
                  {node.name}
                </span>
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* 🚀 PRIMARY CONTENT VIEWPORT */}
      <main className={cn(
        "relative flex-1 overflow-y-auto px-4 pb-32 pt-6 transition-all duration-500",
        isDesktop ? "px-12 pt-12" : "px-4"
      )}>
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE: Tactical Bottom-Action Hub (v13.0.30) */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t border-border/10 bg-card/80 px-6 pb-[var(--tg-safe-bottom)] backdrop-blur-3xl">
          {navigationNodes.slice(0, 5).map((node) => (
            <Link 
              key={node.path} 
              href={node.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all active:scale-90",
                pathname === node.path ? "text-primary" : "text-muted-foreground/40"
              )}
            >
              <node.icon className={cn("h-6 w-6", pathname === node.path && "animate-pulse")} />
              <span className="text-[7px] font-black uppercase tracking-tighter">
                {node.name}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
});
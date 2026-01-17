"use client";

import React, { useMemo, memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Home, 
  History, 
  Settings, 
  ShieldAlert,
  Zap,
  Activity
} from "lucide-react";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { useDeviceContext } from "../providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ TACTICAL_SHELL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Command Horizon.
 * Fix: High-density rail (w-14) and slim mobile hub (h-16) prevent layout blowout.
 */
export const TacticalShell = memo(({ children }: { children: React.ReactNode }) => {
  const { isMobile, isDesktop, isTablet, isReady } = useDeviceContext();
  const { auth } = useTelegramContext();
  const { impact } = useHaptics();
  const pathname = usePathname();

  const navigationNodes = useMemo(() => {
    const role = auth.user?.role?.toUpperCase() || "USER";
    
    // 🛡️ RBAC TOPOLOGY: Identity-gated node access
    const nodes = [
      { name: "Core", path: "/home", icon: Home, access: ["USER", "MERCHANT", "AMBER", "SUPER_ADMIN"] },
      { name: "Terminal", path: "/dashboard", icon: LayoutDashboard, access: ["MERCHANT", "AMBER", "SUPER_ADMIN"] },
      { name: "Ledger", path: "/history", icon: History, access: ["USER", "MERCHANT", "AMBER", "SUPER_ADMIN"] },
      { name: "Oversight", path: "/admin", icon: ShieldAlert, access: ["AMBER", "SUPER_ADMIN"] },
      { name: "Protocol", path: "/settings", icon: Settings, access: ["USER", "MERCHANT", "AMBER", "SUPER_ADMIN"] },
    ];

    return nodes.filter(node => node.access.includes(role));
  }, [auth.user?.role]);

  if (!isReady) return <div className="min-h-screen bg-black animate-pulse" />;

  return (
    <div className="relative flex min-h-[100dvh] w-full overflow-hidden bg-background">
      
      {/* 💻 DESKTOP: Institutional Rail (v2026 Slim) */}
      {(isDesktop || isTablet) && (
        <aside className={cn(
          "relative z-[60] flex h-screen flex-col items-center border-r border-white/5 bg-zinc-950/60 backdrop-blur-xl transition-all duration-700 ease-out group",
          "w-14 hover:w-64" // Reduced w-24 -> w-14
        )}>
          <div className="flex h-16 w-full items-center justify-center border-b border-white/5 bg-white/[0.02]">
            <Zap className="size-5 text-primary fill-current transition-transform group-hover:rotate-12" />
          </div>
          
          <nav className="flex flex-1 flex-col gap-2 p-2 w-full mt-4">
            {navigationNodes.map((node) => (
              <Link 
                key={node.path} 
                href={node.path}
                onClick={() => impact("light")}
                className={cn(
                  "flex items-center gap-4 rounded-lg p-2.5 transition-all duration-500 overflow-hidden leading-none",
                  pathname === node.path 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground/20 hover:bg-white/5 hover:text-foreground"
                )}
              >
                <node.icon className="size-4.5 shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] italic whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {node.name}
                </span>
              </Link>
            ))}
          </nav>

          <div className="p-4 w-full border-t border-white/5 flex flex-col items-center gap-2 opacity-10">
            <Activity className="size-3 animate-pulse" />
            <span className="text-[6px] font-mono group-hover:opacity-100 transition-opacity">APEX_v16</span>
          </div>
        </aside>
      )}

      {/* 🚀 INDEPENDENT TACTICAL VOLUME: Scrollable Content */}
      <main className={cn(
        "relative flex-1 overflow-y-auto custom-scrollbar transition-all duration-700",
        isDesktop ? "p-8" : "p-4 pb-24"
      )}>
        <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-2">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE: Command Hub (v2026 Slim) */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 z-[100] flex h-16 w-full items-center justify-around border-t border-white/5 bg-black/80 backdrop-blur-2xl px-6 pb-[env(safe-area-inset-bottom,0px)]">
          {navigationNodes.map((node) => (
            <Link 
              key={node.path} 
              href={node.path}
              onClick={() => { if (pathname !== node.path) impact("light"); }}
              className={cn(
                "relative flex flex-col items-center gap-1.5 transition-all",
                pathname === node.path ? "text-primary scale-105" : "text-muted-foreground/20"
              )}
            >
              {pathname === node.path && (
                <div className="absolute -top-3 size-1 rounded-full bg-primary shadow-[0_0_10px_#10b981]" />
              )}
              <node.icon className="size-5" />
              <span className="text-[7.5px] font-black uppercase tracking-widest italic leading-none">
                {node.name}
              </span>
            </Link>
          ))}
        </nav>
      )}

      {/* 🏛️ STATIONARY GRID ANCHOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </div>
  );
});
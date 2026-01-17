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
  Zap
} from "lucide-react";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { useDeviceContext } from "../providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 TACTICAL_SHELL (v16.16.12)
 * Philosophy: RBAC-Gated Kinetic Navigation.
 * Standard: v9.9.2 Hyper-Glass Container.
 */
export const TacticalShell = memo(({ children }: { children: React.ReactNode }) => {
  const { isMobile, isDesktop, isTablet, isReady } = useDeviceContext();
  const { auth } = useTelegramContext();
  const { impact } = useHaptics();
  const pathname = usePathname();

  const navigationNodes = useMemo(() => {
    const role = auth.user?.role?.toUpperCase() || "USER";
    
    const nodes = [
      { name: "Core", path: "/home", icon: Home, access: ["USER", "MERCHANT", "AMBER", "SUPER_ADMIN"] },
      { name: "Terminal", path: "/dashboard", icon: LayoutDashboard, access: ["MERCHANT", "AMBER", "SUPER_ADMIN"] },
      { name: "Ledger", path: "/history", icon: History, access: ["USER", "MERCHANT", "AMBER", "SUPER_ADMIN"] },
      { name: "Oversight", path: "/admin", icon: ShieldAlert, access: ["AMBER", "SUPER_ADMIN"] },
      { name: "Protocol", path: "/settings", icon: Settings, access: ["USER", "MERCHANT", "AMBER", "SUPER_ADMIN"] },
    ];

    return nodes.filter(node => node.access.includes(role));
  }, [auth.user?.role]);

  if (!isReady) return null;

  return (
    <div className="relative flex min-h-[100dvh] w-full overflow-hidden bg-background selection:bg-primary/20">
      
      {/* 💻 DESKTOP: Institutional Rail (v9.9.2 Glass) */}
      {(isDesktop || isTablet) && (
        <aside className="relative z-50 flex h-screen w-24 flex-col items-center border-r border-white/5 bg-card/40 py-10 backdrop-blur-3xl transition-all duration-700 ease-[var(--ease-institutional)] hover:w-72 group">
          <div className="mb-12 flex size-14 items-center justify-center rounded-[1.25rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 rotate-0 group-hover:rotate-12 transition-transform duration-700">
            <Zap className="size-7 fill-current" />
          </div>
          
          <nav className="flex flex-1 flex-col gap-6 px-5 w-full">
            {navigationNodes.map((node) => (
              <Link 
                key={node.path} 
                href={node.path}
                onClick={() => impact("light")}
                className={cn(
                  "flex items-center gap-5 rounded-2xl p-4 transition-all duration-500",
                  pathname === node.path 
                    ? "bg-primary/10 text-primary shadow-inner ring-1 ring-primary/20" 
                    : "text-muted-foreground/40 hover:bg-white/5 hover:text-foreground"
                )}
              >
                <node.icon className="size-6 shrink-0" />
                <span className="hidden group-hover:block text-[11px] font-black uppercase tracking-[0.3em] italic whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  {node.name}
                </span>
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* 🚀 PRIMARY OPERATIONAL VIEWPORT */}
      <main className={cn(
        "relative flex-1 overflow-y-auto transition-all duration-700 ease-[var(--ease-institutional)]",
        isDesktop ? "px-16 pt-16 pb-16" : "px-6 pt-8 pb-32"
      )}>
        <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE: Tactical Command Hub */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 z-[100] flex h-20 w-full items-center justify-around border-t border-white/5 bg-card/80 px-6 pb-[env(safe-area-inset-bottom,20px)] backdrop-blur-3xl rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.4)]">
          {navigationNodes.map((node) => (
            <Link 
              key={node.path} 
              href={node.path}
              onClick={() => { if (pathname !== node.path) impact("light"); }}
              className={cn(
                "relative flex flex-col items-center gap-2 transition-all duration-500",
                pathname === node.path ? "text-primary scale-110" : "text-muted-foreground/30"
              )}
            >
              {pathname === node.path && (
                <div className="absolute -top-4 size-1.5 rounded-full bg-primary shadow-[0_0_15px_#10b981] animate-pulse" />
              )}
              <node.icon className="size-6" />
              <span className="text-[8px] font-black uppercase tracking-widest italic leading-none">
                {node.name}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
});
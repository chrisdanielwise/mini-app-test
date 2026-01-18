"use client";

import * as React from "react";
import { useMemo, useEffect, useState } from "react";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { useLayout } from "@/context/layout-provider";
import { useHeartbeat } from "@/lib/hooks/use-heartbeat"; 
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { BottomNav } from "./bottom-nav";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userRole: string; 
}

/**
 * 🛰️ DASHBOARD_LAYOUT_CLIENT (Institutional Apex v2026.1.20)
 * Strategy: Viewport-Locked Shell & Stationary Horizon HUD.
 * Fix: Reorganized for mobile-first navigation standard.
 */
export function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();
  const { impact } = useHaptics();
  const { isMobile, safeArea } = useDeviceContext();
  
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const { status: heartbeatStatus } = useHeartbeat(mounted);

  useEffect(() => {
    if (!mounted) return;
    const syncSystemNode = async () => {
      try {
        const res = await fetch("/api/user/profile", { cache: 'no-store' });
        const data = await res.json();
        if (data?.systemConfig) setSystemConfig(data.systemConfig);
      } catch (err) { console.warn("🛰️ [Sync_Failure]"); }
    };
    syncSystemNode();
  }, [mounted]);

  const isPlatformStaff = useMemo(() => 
    ["super_admin", "platform_manager", "platform_support"].includes(userRole?.toLowerCase() || ""),
    [userRole]
  );

  return (
    <div className="flex flex-col h-screen w-full bg-black overflow-hidden relative">
      
      {/* 🏛️ LAYER 1: STATIONARY HUD (Top Horizon) */}
      <header 
        className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-2xl"
        style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
      >
        <NavGuard 
          heartbeatStatus={heartbeatStatus} 
          systemConfig={systemConfig} 
          userRole={userRole} // 👈 Ensure NavGuard has the mobile Hamburger trigger
        />
      </header>

      {/* 🌊 LAYER 2: LAMINAR RESERVOIR (Main Scrollable Area) */}
      <main 
        className={cn(
          "flex-1 w-full overflow-hidden transition-all duration-700 relative",
          (isFullSize || isPlatformStaff) ? "px-0" : "max-w-[1600px] mx-auto"
        )}
        // 📐 TACTICAL CLEARANCE: Ensures content starts below the fixed header
        style={{ 
          marginTop: isMobile ? `calc(3.5rem + ${safeArea.top}px)` : "4rem",
          marginBottom: isMobile ? `calc(4rem + ${safeArea.bottom}px)` : "0px"
        }}
      >
        <div className="h-full w-full overflow-y-auto scrollbar-none overscroll-contain">
          {!mounted ? (
            <div className="p-6 space-y-4 animate-pulse">
               <Skeleton className="h-10 w-48 bg-white/5 rounded-xl" />
               <Skeleton className="h-64 w-full bg-white/5 rounded-2xl" />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 p-4 md:p-8">
              {children}
            </div>
          )}
        </div>
      </main>

      {/* 🕹️ LAYER 3: COMMAND HUB (Bottom Nav) */}
      {isMobile && mounted && (
        <nav 
          className="fixed bottom-0 left-0 right-0 z-[100] bg-zinc-950/80 backdrop-blur-3xl border-t border-white/5"
          style={{ paddingBottom: `${safeArea.bottom}px` }}
        >
          <div className="h-16 flex items-center justify-center">
            <BottomNav />
          </div>
        </nav>
      )}

      {/* 🌫️ ATMOSPHERIC RADIANCE */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className={cn(
          "absolute -top-1/4 -left-1/4 size-[80%] rounded-full blur-[120px] transition-all duration-1000 opacity-10",
          isPlatformStaff ? "bg-amber-500/20" : "bg-primary/20"
        )} />
      </div>
    </div>
  );
}
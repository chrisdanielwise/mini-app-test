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
 * Strategy: Viewport-Locked Shell & Independent Tactical Scroll.
 * Fix: Synchronized Tier-2 padding with BottomNav height.
 * Fix: Eliminated redundant nav wrapper in Tier-3.
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
    // 🏛️ TIER 1: THE SHELL (Viewport Locked)
    <div className="flex flex-col h-screen w-full bg-black overflow-hidden relative">
      
      {/* 🚀 STATIONARY HORIZON: Global Header Buffer Sync */}
      <NavGuard 
        heartbeatStatus={heartbeatStatus} 
        systemConfig={systemConfig} 
        dashboardContext={{ role: userRole, config: systemConfig }}
      />

      {/* 🌊 TIER 2: LAMINAR RESERVOIR (Independent Volume) */}
      <main 
        className={cn(
          "flex-1 w-full overflow-y-auto scrollbar-none overscroll-contain transition-all duration-700 relative",
          (isFullSize || isPlatformStaff) ? "px-0" : "max-w-full lg:max-w-[1600px] mx-auto"
        )}
      >
        <div className="relative h-full w-full min-w-0">
          {!mounted ? (
            <div className="p-6 space-y-4 animate-pulse">
               <Skeleton className="h-10 w-48 bg-white/5 rounded-xl" />
               <Skeleton className="h-64 w-full bg-white/5 rounded-2xl" />
            </div>
          ) : (
            // 🏎️ PAGE INGRESS: Content flows inside the reservoir
            <div 
              className="animate-in fade-in slide-in-from-bottom-2 duration-700 p-4 md:p-8"
              style={{ 
                /* 📐 ORGANIZED PADDING: 
                   Ensures the bottom of every page clears the BottomNav HUD.
                   Buffer (h-14/56px) + Safe Bottom + Baseline Padding.
                */
                paddingBottom: isMobile 
                  ? `calc(${safeArea.bottom}px + 5.5rem)` 
                  : "2rem" 
              }}
            >
              {children}
            </div>
          )}
        </div>
      </main>

      {/* 🕹️ TIER 3: COMMAND HUB (Independent Overlay) */}
      {/* 🛡️ FIX: Removed redundant nav wrapper. BottomNav handles its own positioning/z-index. */}
      {mounted && isMobile && <BottomNav />}

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
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

// 🛰️ NEW INGRESS SENTINEL
import { SignalIngress } from "@/components/dashboard/signal-ingress";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userRole: string; 
}

/**
 * 🛰️ DASHBOARD_LAYOUT_CLIENT (Institutional v16.16.72)
 * Strategy: Viewport-Locked Shell & Independent Tactical Scroll.
 * Mission: Orchestrate HUD, Telemetry Sentinel, and Content Reservoir.
 */
export function DashboardLayoutClient({ children, userRole }: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();
  const { impact } = useHaptics();
  const { isMobile, safeArea, isReady } = useDeviceContext();
  
  const [systemConfig, setSystemConfig] = useState<any>(null);
  
  // 💓 HEARTBEAT SYNC: Passed to sentinel and HUD
  const { status: heartbeatStatus } = useHeartbeat(mounted);

  // 🛡️ SYSTEM_SYNC: Fetching broadcast configuration
  useEffect(() => {
    if (!mounted || !isReady) return;
    const syncSystemNode = async () => {
      try {
        const res = await fetch("/api/user/profile", { cache: 'no-store' });
        const data = await res.json();
        if (data?.systemConfig) setSystemConfig(data.systemConfig);
      } catch (err) { 
        console.warn("🛰️ [Sync_Failure]: Broadcast node unreachable."); 
      }
    };
    syncSystemNode();
  }, [mounted, isReady]);

  const isPlatformStaff = useMemo(() => 
    ["super_admin", "platform_manager", "platform_support"].includes(userRole?.toLowerCase() || ""),
    [userRole]
  );

  return (
    // 🏛️ TIER 1: THE SHELL (Viewport Locked)
    <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative selection:bg-primary/30">
      
      {/* 🛰️ SENTINEL: Autonomous Signal Ingress (Headless) */}
      {mounted && <SignalIngress isAuthenticated={!!userRole} />}

      {/* 🚀 STATIONARY HORIZON: Navigation Anchor */}
      <header className="shrink-0 z-50">
        <NavGuard 
          heartbeatStatus={heartbeatStatus} 
          systemConfig={systemConfig} 
          dashboardContext={{ role: userRole, config: systemConfig }}
        />
      </header>

      {/* 🌊 TIER 2: LAMINAR RESERVOIR (Independent Volume) */}
      <main 
        className={cn(
          "flex-1 w-full overflow-y-auto scrollbar-hide overscroll-contain transition-all duration-700 relative",
          "[-webkit-overflow-scrolling:touch]", // Native iOS Momentum Scroll
          (isFullSize || isPlatformStaff) ? "max-w-none px-0" : "max-w-[1600px] mx-auto"
        )}
      >
        <div className="relative min-h-full w-full">
          {!mounted || !isReady ? (
            <div className="p-6 space-y-6 animate-pulse">
               <div className="flex items-center space-x-4">
                 <Skeleton className="h-12 w-12 rounded-xl bg-white/5" />
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-48 bg-white/5" />
                   <Skeleton className="h-3 w-32 bg-white/5" />
                 </div>
               </div>
               <Skeleton className="h-64 w-full bg-white/5 rounded-2xl" />
            </div>
          ) : (
            // 🏎️ PAGE INGRESS: Content flows inside the reservoir
            <div 
              className="animate-in fade-in slide-in-from-bottom-2 duration-700 p-4 md:p-10"
              style={{ 
                /* 📐 GEOMETRIC CLEARANCE: Ensures content clears the BottomNav Command Hub */
                paddingBottom: isMobile 
                  ? `calc(${safeArea.bottom}px + 8rem)` 
                  : "4rem" 
              }}
            >
              {children}
            </div>
          )}
        </div>
      </main>

      {/* 🕹️ TIER 3: COMMAND HUB (Independent Tactical Overlay) */}
      {mounted && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom duration-500 px-4 pb-6">
          <BottomNav />
        </div>
      )}

      {/* 🌫️ ATMOSPHERIC RADIANCE: Role-Aware Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-20">
        <div className={cn(
          "absolute -top-1/4 -left-1/4 size-[80%] rounded-full blur-[140px] transition-all duration-1000",
          isPlatformStaff ? "bg-amber-500/20" : "bg-primary/20"
        )} />
        <div className={cn(
          "absolute -bottom-1/4 -right-1/4 size-[60%] rounded-full blur-[140px] transition-all duration-1000",
          isPlatformStaff ? "bg-amber-600/10" : "bg-primary/10"
        )} />
      </div>
    </div>
  );
}
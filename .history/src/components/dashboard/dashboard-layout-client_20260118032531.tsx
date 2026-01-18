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

// 🛰️ TELEMETRY & LEDGER INGRESS
import { SignalIngress } from "@/components/dashboard/signal-ingress";
import { PaymentsLedger } from "@/components/payments/payments-ledger";
import { PayoutLedger } from "@/components/payments/payout-ledger";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userRole: string; 
}

/**
 * 🛰️ DASHBOARD_LAYOUT_CLIENT (Institutional v16.16.78)
 * Strategy: Viewport-Locked Shell & Independent Tactical Scroll.
 * Mission: Orchestrate HUD, Telemetry Sentinel, and Financial Ledgers.
 */
export function DashboardLayoutClient({ children, userRole }: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();
  const { impact } = useHaptics();
  const { isMobile, safeArea, isReady } = useDeviceContext();
  
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const { status: heartbeatStatus } = useHeartbeat(mounted);

  // 🛡️ SYSTEM_SYNC_PROTOCOL: Active broadcast node discovery
  useEffect(() => {
    if (!mounted || !isReady) return;
    
    const syncSystemNode = async () => {
      try {
        const res = await fetch("/api/user/profile", { cache: 'no-store' });
        const data = await res.json();
        if (data?.systemConfig) setSystemConfig(data.systemConfig);
      } catch (err) { 
        console.warn("🛰️ [Sync_Failure]: System_Broadcast node unreachable."); 
      }
    };
    
    syncSystemNode();
  }, [mounted, isReady]);

  // 🕵️ ROLE_TOPOLOGY: Determines the chromatic theme shift (Amber vs Primary)
  const isPlatformStaff = useMemo(() => 
    ["super_admin", "platform_manager", "platform_support"].includes(userRole?.toLowerCase() || ""),
    [userRole]
  );

  return (
    // 🏛️ TIER 1: THE SHELL (Viewport Locked to Hardware Baseline)
    <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative selection:bg-primary/30">
      
      {/* 🛰️ SENTINEL: Autonomous Signal Ingress (Headless Observer) */}
      {mounted && <SignalIngress isAuthenticated={!!userRole} />}

      {/* 🚀 STATIONARY HORIZON: HUD Navigation Anchor */}
      <header className="shrink-0 z-50">
        <NavGuard 
          heartbeatStatus={heartbeatStatus} 
          systemConfig={systemConfig} 
          dashboardContext={{ role: userRole, config: systemConfig }}
        />
      </header>

      {/* 🌊 TIER 2: LAMINAR RESERVOIR (Independent Tactical Volume) */}
      <main 
        className={cn(
          "flex-1 w-full overflow-y-auto scrollbar-hide overscroll-contain transition-all duration-700 relative",
          "[-webkit-overflow-scrolling:touch]", // Momentum Handshake for Mobile
          (isFullSize || isPlatformStaff) ? "max-w-none px-0" : "max-w-[1600px] mx-auto"
        )}
      >
        <div className="relative min-h-full w-full">
          {!mounted || !isReady ? (
            // 🛡️ HYDRATION_SHIELD: Prevents layout snap during device handshake
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
            // 🏎️ PAGE_INGRESS: Staggered content entry inside the reservoir
            <div 
              className="animate-in fade-in slide-in-from-bottom-2 duration-700 p-4 md:p-10 space-y-8"
              style={{ 
                /* 📐 GEOMETRIC CLEARANCE: Align with BottomNav Command Hub */
                paddingBottom: isMobile 
                  ? `calc(${safeArea.bottom}px + 8rem)` 
                  : "4rem" 
              }}
            >
              {/* 📊 CONTENT INGRESS: Children inherit the layout's tactical volume */}
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
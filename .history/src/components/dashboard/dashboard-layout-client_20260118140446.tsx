"use client";

import * as React from "react";
import { useMemo, useEffect, useState } from "react";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { useLayout } from "@/context/layout-provider";
import { useHeartbeat } from "@/lib/hooks/use-heartbeat"; 
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeviceContext } from "@/components/providers/device-provider";
import { BottomNav } from "./bottom-nav";

// 🛰️ TELEMETRY & ADMIN PROTOCOLS
import { SignalIngress } from "@/components/dashboard/signal-ingress";
import { StaffIdentitySwap } from "@/components/staff/staff-identity-swap";
import { SettlementRequestDrawer } from "@/components/dashboard/settlement-request-drawer";

// 🛡️ GLOBAL_HOOK_INGRESS
import { useSettlement } from "@/lib/hooks/use-settlement";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userRole: string;
  impersonationData?: {
    adminName: string;
    merchantName: string;
  } | null;
}

/**
 * 🛰️ DASHBOARD_LAYOUT_CLIENT (Institutional Apex v2026.1.18)
 * Strategy: Viewport-Locked Shell & Tactical Identity Orchestration.
 * Mission: Coordinate HUD, Admin Tunneling, and Mobile Safe-Area Ingress.
 */
export function DashboardLayoutClient({ 
  children, 
  userRole, 
  impersonationData 
}: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();
  const { isMobile, safeArea, isReady } = useDeviceContext();
  
  // 🏎️ GLOBAL_SETTLEMENT_SYNC: Listening to the headless observer
  const { isOpen, balance, closeSettlement } = useSettlement();
  
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const { status: heartbeatStatus } = useHeartbeat(mounted);

  // ✅ ROLE_NORMALIZATION: Ensure lowercase matching for all authorized logic
  const normalizedRole = (userRole || "").toLowerCase();

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

  // 🕵️ ROLE_TOPOLOGY: Staff state determines background atmospheric bleed
  const isPlatformStaff = useMemo(() => 
    ["super_admin", "platform_manager", "platform_support", "amber"].includes(normalizedRole),
    [normalizedRole]
  );

  return (
    // 🏛️ TIER 1: THE SHELL (Viewport Locked at 100dvh for Telegram Safety)
    <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative selection:bg-primary/30">
      
      {/* 🛡️ TACTICAL OVERLAY: Active Identity Swap Sentinel (Staff Only) */}
      {mounted && (
        <StaffIdentitySwap 
          isImpersonating={!!impersonationData}
          originalAdminName={impersonationData?.adminName}
          targetMerchantName={impersonationData?.merchantName}
        />
      )}

      {/* 🛰️ SENTINEL: Autonomous Signal Ingress */}
      {mounted && <SignalIngress isAuthenticated={!!userRole} />}

      {/* 🚀 SETTLEMENT_PORTAL: Global Financial Request UI */}
      {mounted && (
        <SettlementRequestDrawer 
          isOpen={isOpen} 
          onClose={closeSettlement} 
          balance={balance}
        />
      )}

      {/* 🛰️ STATIONARY HORIZON: HUD Navigation Anchor */}
      <header className={cn(
        "shrink-0 z-50 transition-all duration-500",
        impersonationData ? "pt-10" : "pt-0" 
      )}>
        <NavGuard 
          heartbeatStatus={heartbeatStatus} 
          systemConfig={systemConfig} 
          dashboardContext={{ role: normalizedRole, config: systemConfig }}
        />
      </header>

      {/* 🌊 TIER 2: LAMINAR RESERVOIR (Independent Volume) */}
      <main 
        className={cn(
          "flex-1 w-full overflow-y-auto scrollbar-hide overscroll-contain transition-all duration-700 relative",
          "[-webkit-overflow-scrolling:touch]",
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
            // 🏎️ PAGE_INGRESS: Content reservoir entry
            <div 
              className="animate-in fade-in slide-in-from-bottom-2 duration-700 p-4 md:p-10"
              style={{ 
                // 📐 MOBILE_SHIELD: Clears the BottomNav + Home Indicator
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

      {/* 🕹️ TIER 3: MOBILE HUB (Stationary Bottom HUD) */}
      {mounted && isMobile && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom duration-500 px-4 pb-6"
          style={{ paddingBottom: `calc(${safeArea.bottom}px + 1.5rem)` }}
        >
          <BottomNav />
        </div>
      )}

      {/* 🌫️ ATMOSPHERIC RADIANCE: Identity-Aware Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-20">
        <div className={cn(
          "absolute -top-1/4 -left-1/4 size-[80%] rounded-full blur-[140px] transition-all duration-1000",
          (isPlatformStaff || !!impersonationData) ? "bg-amber-500/20" : "bg-primary/20"
        )} />
        <div className={cn(
          "absolute -bottom-1/4 -right-1/4 size-[60%] rounded-full blur-[140px] transition-all duration-1000",
          (isPlatformStaff || !!impersonationData) ? "bg-amber-600/10" : "bg-primary/10"
        )} />
      </div>
    </div>
  );
}
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
 * 🛰️ DASHBOARD_LAYOUT_CLIENT (Institutional Apex v2026.1.18 - FINAL HARDENING)
 * Strategy: Absolute Viewport Anchor.
 * Fix: Removed global 'overflow-y-auto' to prevent stationary header collision.
 * Mission: Force internal scrolling on children while HUD remains physically locked.
 */
export function DashboardLayoutClient({ 
  children, 
  userRole, 
  impersonationData 
}: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();
  const { isMobile, safeArea, isReady } = useDeviceContext();
  
  const { isOpen, balance, closeSettlement } = useSettlement();
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const { status: heartbeatStatus } = useHeartbeat(mounted);

  const normalizedRole = (userRole || "").toLowerCase();

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

  const isPlatformStaff = useMemo(() => 
    ["super_admin", "platform_manager", "platform_support", "amber"].includes(normalizedRole),
    [normalizedRole]
  );

  return (
    // 🏛️ TIER 1: THE PRIMARY CHASSIS (Locked at 100dvh)
    <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative selection:bg-primary/30">
      
      {/* 🛡️ TACTICAL OVERLAYS */}
      {mounted && <StaffIdentitySwap isImpersonating={!!impersonationData} originalAdminName={impersonationData?.adminName} targetMerchantName={impersonationData?.merchantName} />}
      {mounted && <SignalIngress isAuthenticated={!!userRole} />}
      {mounted && <SettlementRequestDrawer isOpen={isOpen} onClose={closeSettlement} balance={balance} />}

      {/* 🛰️ STATIONARY HUD (Z-50)
          🏁 THE FIX: shrink-0 + z-50 pins the global navigation.
      */}
      <header 
        className={cn("shrink-0 z-50 transition-all duration-500", impersonationData ? "pt-10" : "pt-0")}
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 6px)` : "0px" }}
      >
        <NavGuard 
          heartbeatStatus={heartbeatStatus} 
          systemConfig={systemConfig} 
          dashboardContext={{ role: normalizedRole, config: systemConfig }}
        />
      </header>

      {/* 🌊 TIER 2: LAMINAR RESERVOIR (Internal Logic)
          🏁 THE FIX: REMOVED 'overflow-y-auto'. 
          This container is now a rigid window. Only the {children} inside can scroll.
      */}
      <main 
        className={cn(
          "flex-1 min-h-0 w-full relative overflow-hidden", // Forced overflow-hidden
          (isFullSize || isPlatformStaff) ? "max-w-none px-0" : "max-w-[1600px] mx-auto"
        )}
      >
        <div className="h-full w-full">
          {!mounted || !isReady ? (
            <div className="p-6 space-y-6 animate-pulse">
               <Skeleton className="h-12 w-12 rounded-xl bg-white/5" />
               <Skeleton className="h-64 w-full bg-white/5 rounded-2xl" />
            </div>
          ) : (
            /* 🏎️ PAGE_INGRESS: This area now fills 100% of the remaining height. */
            <div className="h-full w-full">
               {children}
            </div>
          )}
        </div>
      </main>

      {/* 🕹️ TIER 3: MOBILE COMMAND HUB (Pinned Bottom) */}
      {mounted && isMobile && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-[70] px-4"
          style={{ paddingBottom: `calc(${safeArea.bottom}px + 1.5rem)` }}
        >
          <BottomNav />
        </div>
      )}

      {/* 🌫️ ATMOSPHERIC RADIANCE */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-20">
        <div className={cn("absolute -top-1/4 -left-1/4 size-[80%] rounded-full blur-[140px]", isPlatformStaff ? "bg-amber-500/20" : "bg-primary/20")} />
      </div>
    </div>
  );
}
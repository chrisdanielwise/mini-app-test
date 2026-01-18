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
 * Fix: Implements the "World Standard" 3-tier architecture.
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
    // 🏛️ TIER 1: THE SHELL (Fixed & Non-Scrolling)
    <div className="flex flex-col h-screen w-full bg-black overflow-hidden relative">
      
      {/* 🚀 STATIONARY HORIZON: Your Handled Header */}
      {/* We do not wrap this in a header tag to ensure we don't interfere with your custom styles */}
      <NavGuard 
        heartbeatStatus={heartbeatStatus} 
        systemConfig={systemConfig} 
      />

      {/* 🌊 TIER 2: LAMINAR RESERVOIR (Independent Scroll Volume) */}
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
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 p-4 md:p-8 pb-32">
              {children}
            </div>
          )}
        </div>
      </main>

      {/* 🕹️ TIER 3: COMMAND HUB (Stationary Rail) */}
      {mounted && isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-[70] h-16 bg-zinc-950/80 backdrop-blur-3xl border-t border-white/5 px-4">
          <BottomNav />
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
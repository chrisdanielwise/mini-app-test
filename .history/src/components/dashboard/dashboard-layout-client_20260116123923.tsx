"use client";

import * as React from "react";
import { useMemo, useEffect, useState } from "react";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { useLayout } from "@/context/layout-provider";
import { useHeartbeat } from "@/lib/hooks/use-heartbeat"; 
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { BottomNav } from "./bottom-nav";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userRole: string; 
}

/**
 * 🛰️ DASHBOARD_LAYOUT_CLIENT (Institutional Apex v2026.1.20)
 * Strategy: Viewport-Locked Shell & Independent Tactical Scroll.
 * Fix: Standardized vertical compression and geometry lock for the primary dashboard membrane.
 */
export function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();
  const { impact } = useHaptics();
  
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const { status: heartbeatStatus } = useHeartbeat(mounted);

  useEffect(() => {
    if (!mounted) return;

    const syncSystemNode = async () => {
      try {
        const res = await fetch("/api/user/profile", { cache: 'no-store' });
        if (!res.ok) throw new Error("NODE_HANDSHAKE_FAILED");
        const data = await res.json();
        if (data?.systemConfig) setSystemConfig(data.systemConfig);
      } catch (err) {
        console.warn("⚠️ [System_Sync_Isolated]: Handshake severed.");
      }
    };

    syncSystemNode();
  }, [mounted]);

  const isPlatformStaff = useMemo(() => 
    ["super_admin", "platform_manager", "platform_support"].includes(userRole?.toLowerCase() || ""),
    [userRole]
  );

  return (
    <div 
      key={userRole} 
      // 🛡️ TACTICAL SLIM: Absolute viewport lock prevents global blowout
      className="flex flex-1 flex-col relative w-full h-full min-w-0 bg-black selection:bg-primary/20 text-foreground overflow-hidden"
    >
      {/* 🚀 FIXED COMMAND HUD: Stationary Header Membrane */}
      <header className="shrink-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <NavGuard 
          heartbeatStatus={heartbeatStatus} 
          systemConfig={systemConfig} 
        />
      </header>

      {/* 🚀 CONTENT ENGINE: Independent Scroll Reservoir */}
      <main 
        className={cn(
          // 🛡️ GEOMETRY LOCK: Removed overflow-y-auto to allow children to scroll independently
          "flex-1 w-full min-w-0 min-h-0 overflow-hidden transition-all duration-700",
          (isFullSize || isPlatformStaff) ? "px-0" : "max-w-full lg:max-w-[1600px] mx-auto",
          "relative flex flex-col" 
        )}
      >
        <div className="relative flex-1 h-full w-full min-w-0">
          {!mounted ? (
            <div className="space-y-6 animate-pulse p-6 w-full min-w-0">
              <div className="flex items-center space-x-4">
                <Skeleton className="size-10 rounded-xl bg-white/5" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-40 bg-white/5" />
                  <Skeleton className="h-2 w-24 bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-[300px] w-full rounded-2xl bg-white/5" />
            </div>
          ) : (
            // 🏎️ PAGE INGRESS: Children fill the locked flex volume
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 w-full h-full min-w-0 flex flex-col overflow-hidden">
              {children}
            </div>
          )}
        </div>
      </main>

      {/* 📱 TACTICAL MOBILE HUD */}
      {mounted && (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-[70] px-4 pb-4">
          <BottomNav />
        </div>
      )}

      {/* 🌫️ ATMOSPHERIC RADIANCE */}
      <div className="fixed inset-0 pointer-events-none z-[-1] select-none">
        <div className={cn(
          "absolute -top-[5%] -left-[5%] h-[40%] w-[40%] rounded-full blur-[100px] transition-all duration-[2000ms] opacity-20",
          isPlatformStaff ? "bg-amber-500/10" : "bg-primary/10"
        )} />
      </div>
    </div>
  );
}
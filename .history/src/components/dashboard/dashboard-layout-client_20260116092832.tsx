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
 * 🛰️ TACTICAL_LAYOUT_ORCHESTRATOR (Apex v2026.1.15)
 * Strategy: High-density, morphology-aware fixed-to-flow grid.
 * Fix: Clamped padding and defensive sync for Super Admin stability.
 */
export function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();
  const { impact } = useHaptics();
  
  // ✅ FIXED: Initialized with defensive null-state to prevent "undefined" crashes
  const [systemConfig, setSystemConfig] = useState<any>(null);
  
  const { status: heartbeatStatus } = useHeartbeat(mounted);

  useEffect(() => {
    if (!mounted) return;

    const syncSystemNode = async () => {
      try {
        const res = await fetch("/api/user/profile", { cache: 'no-store' });
        if (!res.ok) throw new Error("NODE_HANDSHAKE_FAILED");
        const data = await res.json();
        // ✅ FIXED: Optional chaining on data ingress
        if (data?.systemConfig) setSystemConfig(data.systemConfig);
      } catch (err) {
        console.warn("⚠️ [System_Sync_Isolated]: Handshake severed.");
      }
    };

    syncSystemNode();
  }, [mounted]);

  const isPlatformStaff = useMemo(() => 
    ["super_admin", "platform_manager", "platform_support"].includes(userRole.toLowerCase()),
    [userRole]
  );

  return (
    <div 
      key={userRole} 
      className="flex h-[100dvh] flex-col relative min-w-0 bg-black selection:bg-primary/20 text-foreground overflow-hidden"
    >
      {/* 🚀 FIXED HUD: Stationary z-index anchor */}
      <header className="shrink-0 z-50">
        <NavGuard 
          heartbeatStatus={heartbeatStatus} 
          systemConfig={systemConfig} 
        />
      </header>

      {/* 🚀 CONTENT ENGINE: Independent Tactical Scroll Volume */}
    <main 
  className={cn(
    "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
    "scroll-smooth focus:outline-none overscroll-y-contain custom-scrollbar",
    // 🛡️ TACTICAL FIX: Changed pt-6 to pt-0 because the Root Layout handles the gap
    (isFullSize || isPlatformStaff) ? "px-4 md:px-8 lg:px-10" : "max-w-[1400px] mx-auto px-5 md:px-10",
    "pb-32 md:pb-20 pt-0" // <--- CHANGED FROM pt-6 TO pt-0
  )}
>
        <div className="relative min-h-full w-full">
          {!mounted ? (
            <div className="space-y-8 animate-pulse p-4">
              <div className="flex items-center space-x-5">
                <Skeleton className="size-12 rounded-xl bg-white/5" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48 bg-white/5" />
                  <Skeleton className="h-3 w-32 bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-[400px] w-full rounded-[2rem] bg-white/5" />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          )}
        </div>
      </main>

      {/* 📱 MOBILE NAV HUD: Tactical Glass Membrane */}
      {mounted ? (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-[70] px-5 pb-6 animate-in slide-in-from-bottom-8 duration-700">
          <BottomNav />
        </div>
      ) : (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-3xl border-t border-white/5 z-[70]" />
      )}

      {/* 🌌 DUAL ATMOSPHERIC RADIANCE: Reduced opacity for higher text contrast */}
      <div className="fixed inset-0 pointer-events-none z-[-1] select-none">
        <div className={cn(
          "absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full blur-[120px] transition-all duration-[2000ms]",
          isPlatformStaff ? "bg-amber-500/5" : "bg-primary/5"
        )} />
        <div className={cn(
          "absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full blur-[120px] transition-all duration-[2000ms]",
          isPlatformStaff ? "bg-amber-500/[0.02]" : "bg-primary/5"
        )} />
      </div>
    </div>
  );
}
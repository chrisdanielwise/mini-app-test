"use client";

import * as React from "react";
import { useMemo, useEffect, useState } from "react";
// import { BottomNav } from "@/components/nav/bottom-nav";
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
 * 🌊 FLUID LAYOUT ORCHESTRATOR (v16.16.12)
 * Logic: Synchronized Fixed-to-Flow Architecture with Haptic Guarding.
 * Scale: 1M+ User Optimized | Design: v9.9.1 Hardened Glassmorphism.
 */
export function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();
  const { impact } = useHaptics();
  const [systemConfig, setSystemConfig] = useState<any>(null);
  
  // 💓 HEARTBEAT: Signals the NavGuard security dot
  const { status: heartbeatStatus } = useHeartbeat(mounted);

  // 🛡️ SYSTEM SYNC: Hydrate Broadcast Node
  useEffect(() => {
    if (!mounted) return;

    const syncSystemNode = async () => {
      try {
        const res = await fetch("/api/user/profile", { cache: 'no-store' });
        const data = await res.json();
        if (data.systemConfig) setSystemConfig(data.systemConfig);
      } catch (err) {
        console.warn("⚠️ [System_Sync_Failure]: Node unreachable.");
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
      className="flex h-[100dvh] flex-col relative min-w-0 bg-background selection:bg-primary/20 text-foreground overflow-hidden"
    >
      {/* 🚀 FIXED HEADER NODE: Stationary z-index anchor */}
      <header className="shrink-0 z-50">
        <NavGuard 
          heartbeatStatus={heartbeatStatus} 
          systemConfig={systemConfig} 
        />
      </header>

      {/* 🌊 KINETIC SCROLL ENGINE: Fluid Momentum */}
      <main 
        onScroll={() => {
          // Micro-haptic scrub could be added here for specific 1M+ user interactions
        }}
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "scroll-smooth focus:outline-none overscroll-y-contain custom-scrollbar",
          "[-webkit-overflow-scrolling:touch]", 
          (isFullSize || isPlatformStaff) ? "px-6 md:px-10 lg:px-14" : "max-w-7xl mx-auto px-6 md:px-12",
          "pb-36 md:pb-24 pt-4" 
        )}
      >
        <div className="relative min-h-full w-full">
          {!mounted ? (
            <div className="space-y-10 animate-pulse p-4">
              <div className="flex items-center space-x-6">
                <Skeleton className="size-16 rounded-[1.5rem] bg-white/5" />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-[280px] bg-white/5" />
                  <Skeleton className="h-4 w-[220px] bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-[500px] w-full rounded-[3rem] bg-white/5" />
            </div>
          ) : (
            <div className="transition-all duration-1000 animate-in fade-in slide-in-from-bottom-6">
              {children}
            </div>
          )}
        </div>
      </main>

      {/* 📱 MOBILE NAVIGATION HUD: v9.9.1 Glassmorphism */}
      {mounted ? (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-[70] px-6 pb-8 animate-in slide-in-from-bottom-10 duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]">
          <BottomNav />
        </div>
      ) : (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 h-28 bg-card/20 backdrop-blur-3xl border-t border-white/5 z-[70]" />
      )}

      {/* 🌌 DUAL ATMOSPHERIC RADIANCE: Role-Aware Depth */}
      <div className="fixed inset-0 pointer-events-none z-[-1] select-none">
        <div className={cn(
          "absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full blur-[140px] transition-all duration-1000",
          isPlatformStaff ? "bg-amber-500/10" : "bg-primary/5"
        )} />
        <div className={cn(
          "absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full blur-[140px] transition-all duration-1000",
          isPlatformStaff ? "bg-amber-500/5" : "bg-primary/10"
        )} />
      </div>
    </div>
  );
}
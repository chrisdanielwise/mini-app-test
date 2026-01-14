"use client";

import { useMemo } from "react";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { useLayout } from "@/context/layout-provider";
import { useHeartbeat } from "@/lib/hooks/use-heartbeat"; 
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userRole: string; 
}

/**
 * 🛰️ DASHBOARD CLIENT ORCHESTRATOR (v15.62.0)
 * Logic: Restored Natural Scroll Flow & Cross-Platform Kinetic Motion.
 */
export function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();
  const { status: heartbeatStatus } = useHeartbeat(mounted);

  const isPlatformStaff = useMemo(() => 
    ["super_admin", "platform_manager", "platform_support"].includes(userRole.toLowerCase()),
    [userRole]
  );

  return (
    <div 
      key={userRole} 
      className="flex h-full flex-col relative min-w-0 bg-background selection:bg-primary/20 text-foreground overflow-hidden"
    >
      {/* 🚀 FIXED TOP NAV: Remains stationary while content flows underneath */}
      <div className="shrink-0 pt-1.5 md:pt-0 z-50">
        <NavGuard heartbeatStatus={heartbeatStatus} />
      </div>

      {/* 🛰️ PRIMARY SCROLL CONTAINER
          Logic: 'overflow-y-auto' + 'overscroll-behavior-contain' ensures a smooth, 
          native feel on iOS and Android without breaking the layout.
      */}
      <main className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-500",
        "scroll-smooth focus:outline-none", // Standard kinetic flow
        "overscroll-y-contain", // Prevents pull-to-refresh on mobile browsers
        (isFullSize || isPlatformStaff) ? "max-w-none px-4 md:px-8 lg:px-10" : "max-w-7xl px-4 md:px-8",
        "pb-40 md:pb-24" // Buffer for BottomNav visibility
      )}>
        <div className="relative min-h-full">
          {!mounted ? (
            <div className="space-y-6 animate-pulse p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full bg-muted/40" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-muted/40" />
                  <Skeleton className="h-4 w-[200px] bg-muted/40" />
                </div>
              </div>
              <Skeleton className="h-[400px] w-full rounded-3xl bg-muted/20" />
            </div>
          ) : (
            <div className="transition-opacity duration-700 opacity-100 animate-in fade-in slide-in-from-bottom-2">
              {children}
            </div>
          )}
        </div>
      </main>

      {/* 📱 MOBILE NAV: Stays fixed but follows layout-provider mount state */}
      {mounted ? (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom duration-500 px-4 pb-6">
          <BottomNav />
        </div>
      ) : (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 h-24 bg-card/20 backdrop-blur-xl border-t border-border/10" />
      )}

      {/* 🌌 DUAL BACKGROUND NODES */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.15]">
        <div className={cn(
          "absolute top-[-5%] left-[-5%] h-[40%] w-[40%] rounded-full blur-[120px] transition-colors duration-1000",
          isPlatformStaff ? "bg-amber-500/20" : "bg-primary/10"
        )} />
        <div className={cn(
          "absolute bottom-[-5%] right-[-5%] h-[40%] w-[40%] rounded-full blur-[120px] transition-colors duration-1000",
          isPlatformStaff ? "bg-amber-500/10" : "bg-primary/20"
        )} />
      </div>
    </div>
  );
}
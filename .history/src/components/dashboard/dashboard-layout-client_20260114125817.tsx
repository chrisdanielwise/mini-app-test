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
 * 🛰️ DASHBOARD CLIENT ORCHESTRATOR (v16.0.2)
 * Logic: Synchronized Fixed-to-Flow Architecture.
 * Feature: Cross-platform kinetic scrolling with overscroll containment.
 */
export function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();
  
  // 💓 HEARTBEAT: Signals the NavGuard security dot
  const { status: heartbeatStatus } = useHeartbeat(mounted);

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
      <header className="shrink-0 pt-1.5 md:pt-0 z-50">
        <NavGuard heartbeatStatus={heartbeatStatus} />
      </header>

      {/* 🛰️ KINETIC SCROLL ENGINE
          Logic: flex-1 expansion + overflow-y-auto creates the 'standard' flow.
          Overscroll-contain prevents the browser's 'bounce-to-refresh' behavior.
      */}
      <main className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-500",
        "scroll-smooth focus:outline-none overscroll-y-contain",
        "[-webkit-overflow-scrolling:touch]", // Native iOS momentum scrolling
        (isFullSize || isPlatformStaff) ? "max-w-none px-4 md:px-8 lg:px-10" : "max-w-7xl px-4 md:px-8",
        "pb-32 md:pb-20" // Ensures content clears the BottomNav HUD
      )}>
        <div className="relative min-h-full w-full">
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

      {/* 📱 MOBILE NAVIGATION HUD: Floating fixed position */}
      {mounted ? (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom duration-500 px-4 pb-6">
          <BottomNav />
        </div>
      ) : (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 h-24 bg-card/20 backdrop-blur-xl border-t border-border/10 z-[70]" />
      )}

      {/* 🌌 DUAL ATMOSPHERIC NODES: Institutional Branding */}
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
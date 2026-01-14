"use client";

import { useMemo } from "react";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { useLayout } from "@/context/layout-provider";
import { useHeartbeat } from "@/lib/hooks/use-heartbeat"; 
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 🛠️ PROPS INTERFACE
 * Explicitly defining userRole here resolves the ts(2322) error 
 * in the Server Layout.
 */
interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userRole: string; 
}

export function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();

  // 🛡️ 1. Heartbeat Integration: Captures status for NavGuard
  const { status: heartbeatStatus } = useHeartbeat(mounted);

  // 🛡️ 2. Role Stabilization
  const isPlatformStaff = useMemo(() => 
    ["super_admin", "platform_manager", "platform_support"].includes(userRole.toLowerCase()),
    [userRole]
  );

  return (
    /**
     * 🚀 THE SESSION ANCHOR
     * Using userRole as a key forces a clean re-mount when identity 
     * handshake finishes, preventing UI ghosting.
     */
    <div 
      key={userRole} 
      className="flex flex-1 flex-col relative min-w-0 bg-background text-foreground"
    >
      
      {/* 🚀 NAV GUARD: Receives the live heartbeat status prop */}
      <div className="pt-1.5 md:pt-0">
        <NavGuard heartbeatStatus={heartbeatStatus} />
      </div>

      <main
        className={cn(
          "flex-1 transition-all duration-500 ease-in-out mx-auto w-full min-w-0",
          (isFullSize || isPlatformStaff) 
            ? "max-w-none px-4 md:px-8 lg:px-10" 
            : "max-w-7xl px-4 md:px-8",
          "pb-40 md:pb-24"
        )}
      >
        <div className="relative">
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

      {/* 📱 MOBILE NAVIGATION */}
      {mounted && (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom duration-500">
          <BottomNav />
        </div>
      )}

      {/* 🌌 TACTICAL BACKGROUND AURA */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.15]">
        <div className={cn(
          "absolute top-[-5%] left-[-5%] h-[40%] w-[40%] rounded-full blur-[120px]",
          isPlatformStaff ? "bg-amber-500/20" : "bg-primary/10"
        )} />
      </div>
    </div>
  );
}
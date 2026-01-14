"use client";

import { useMemo } from "react";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { useLayout } from "@/context/layout-provider";
import { useHeartbeat } from "@/lib/hooks/use-heartbeat"; // ✅ NEW: Sliding Window Sync
import { cn } from "@/lib/utils";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userRole: string; 
}

/**
 * 🛰️ DASHBOARD CLIENT ORCHESTRATOR (Institutional v14.2.0)
 * Logic: Manages Identity Handshakes, Heartbeats, and Layout Scaling.
 * Security: Active Heartbeat ensures JWT validity and Stamp verification every 15m.
 */
export default function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize, mounted } = useLayout();

  // 🛡️ ROLE STABILIZATION
  const isPlatformStaff = useMemo(() => 
    ["super_admin", "platform_manager", "platform_support"].includes(userRole.toLowerCase()),
    [userRole]
  );

  /**
   * 💓 HEARTBEAT PROTOCOL
   * Logic: Runs a background "Thin Check" on the Security Stamp.
   * Note: We pass 'mounted' to ensure it only starts once the browser is ready.
   */
  useHeartbeat(mounted);

  return (
    <div className="flex flex-1 flex-col relative min-w-0 bg-background selection:bg-primary/20 text-foreground">
      
      {/* 🚀 NAVIGATION GUARD: Only runs on client */}
      <div className="pt-1.5 md:pt-0">
        <NavGuard role={userRole} />
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
        {/* 🛡️ HYDRATION SHIELD: Prevents UI flickering before heartbeat/session is stable */}
        <div className={cn(
          "relative transition-opacity duration-700",
          mounted ? "opacity-100 animate-in fade-in slide-in-from-bottom-2" : "opacity-0"
        )}>
          {children}
        </div>
      </main>

      {/* 📱 MOBILE NAVIGATION CONTROLLER */}
      {mounted && (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom duration-500">
          <BottomNav role={userRole} />
        </div>
      )}

      {/* 🌌 TACTICAL BACKGROUND AURA: Dynamic coloring (Amber for Staff, Primary for Merchants) */}
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
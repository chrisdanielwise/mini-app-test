"use client";

import { useLayout } from "@/context/layout-provider";
import { BottomNav } from "@/components/app/bottom-nav"; // Refined: Using shared BottomNav
import { NavGuard } from "@/components/dashboard/nav-guard";
import { cn } from "@/lib/utils";

/**
 * 🛰️ COMMAND CENTER CLIENT ENGINE (Apex Tier)
 * Fixed: 'min-w-0' implementation across the tree to prevent metric clipping.
 * Fixed: Normalized fluid gutters to eliminate the "Horizontal Squeeze" bug.
 * Optimized: Adaptive padding for Telegram Mini App and desktop viewports.
 */
export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isFullSize } = useLayout();

  return (
    <div className="flex flex-1 flex-col relative min-w-0 w-full overflow-x-hidden antialiased">
      
      {/* 🚀 BREADCRUMB TELEMETRY
          Strategic Pathing: Ensures paths (CLUSTER // HUB) remain visible.
      */}
      <div className="pt-2 lg:pt-0 shrink-0">
        <NavGuard />
      </div>

      <main
        className={cn(
          "flex-1 transition-all duration-700 ease-in-out mx-auto w-full min-w-0",
          // Fluid Viewport Calibration
          isFullSize
            ? "max-w-none px-4 md:px-12 lg:px-16"
            : "max-w-[1440px] px-4 sm:px-8 lg:px-12",
          // Safety Gutters: Pushes content above navigation nodes
          "pb-40 lg:pb-20"
        )}
      >
        {/* Main Content Node: 
            Hardened with 'min-w-0' to ensure metrics like '$12,000' wrap 
            rather than forcing horizontal overflow.
        */}
        <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-1000 min-w-0 w-full h-full">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE FLOATING CONTROLLER
          Visibility: Institutional replacement for the desktop sidebar on mobile nodes.
      */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>

      {/* 🌌 COMMAND CENTER AMBIENCE (Background Aura) */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
      </div>
    </div>
  );
}
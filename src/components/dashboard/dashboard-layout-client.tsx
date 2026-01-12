"use client";

import { useLayout } from "@/context/layout-provider";
import { BottomNav } from "@/components/app/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { cn } from "@/lib/utils";

/**
 * 🛰️ COMMAND CENTER CLIENT ENGINE
 * Logic: Synchronized with Theme Flavors (Amber for Staff Oversight).
 * Fixed: Elastic viewport calibration to eliminate the "Horizontal Squeeze" bug.
 */
export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isFullSize, flavor } = useLayout();
  const isStaffFlavor = flavor === "AMBER";

  return (
    <div className="flex flex-1 flex-col relative min-w-0 w-full overflow-x-hidden antialiased">
      
      {/* 🚀 BREADCRUMB TELEMETRY
          Strategic Pathing: Ensures navigation context remains pinned.
      */}
      <div className="pt-2 lg:pt-0 shrink-0">
        <NavGuard />
      </div>

      <main
        className={cn(
          "flex-1 transition-all duration-700 ease-in-out mx-auto w-full min-w-0",
          // Fluid Viewport Calibration: Adapts to Desktop vs Mini App viewports
          isFullSize
            ? "max-w-none px-4 md:px-12 lg:px-16"
            : "max-w-[1440px] px-4 sm:px-8 lg:px-12",
          // Safety Gutters: Critical for floating mobile navigation nodes
          "pb-36 lg:pb-20"
        )}
      >
        {/* Main Content Node: 
            Hardened with 'min-w-0' to ensure Recharts and KPI cards 
            calculate width correctly without forcing overflow.
        */}
        <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-1000 min-w-0 w-full h-full">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE FLOATING CONTROLLER
          Visibility: Primary navigation node for Telegram Mini App users.
      */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-700">
        <BottomNav />
      </div>

      {/* 🌌 COMMAND CENTER AMBIENCE (Role-Aware Background Aura) */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20 transition-colors duration-1000">
        <div className={cn(
          "absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full blur-[120px] transition-all duration-1000",
          isStaffFlavor ? "bg-amber-500/10" : "bg-primary/5"
        )} />
        <div className={cn(
          "absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full blur-[120px] transition-all duration-1000",
          isStaffFlavor ? "bg-amber-600/15" : "bg-primary/10"
        )} />
      </div>
    </div>
  );
}
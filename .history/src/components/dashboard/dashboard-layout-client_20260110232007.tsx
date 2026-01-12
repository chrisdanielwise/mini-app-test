"use client";

import { useLayout } from "@/context/layout-provider";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { cn } from "@/lib/utils";

/**
 * 🛰️ COMMAND CENTER CLIENT ENGINE (Cleaned & Optimized)
 * Fixed: Removed redundant sidebar and top-nav calls to stop the "Double Sidebar" bug.
 * Fixed: Added 'min-w-0' to prevent horizontal scrolling and text clipping.
 */
export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isFullSize } = useLayout();

  return (
    <div className="flex flex-1 flex-col relative min-w-0 overflow-hidden">
      
      {/* 🚀 BREADCRUMB TELEMETRY
          Ensures navigation paths (e.g., CLUSTER // SERVICES) are visible without being squashed.
      */}
      <div className="pt-2 lg:pt-0">
        <NavGuard />
      </div>

      <main
        className={cn(
          "flex-1 transition-all duration-700 ease-in-out mx-auto w-full min-w-0",
          // Dynamic viewport scaling logic
          isFullSize
            ? "max-w-none px-4 md:px-12"
            : "max-w-[1400px] px-4 sm:px-10 lg:px-12",
          // Pushes content above the floating mobile controller
          "pb-40 lg:pb-16"
        )}
      >
        {/* Main Content Node: Uses 'min-w-0' to ensure text like 'COMMAND CENTER' wraps correctly */}
        <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-1000 min-w-0">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE FLOATING CONTROLLER
          Only visible on small screens to replace the desktop sidebar.
      */}
      <div className="lg:hidden block">
        <BottomNav />
      </div>

      {/* 🌌 COMMAND CENTER AMBIENCE (Background Aura) */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>
    </div>
  );
}
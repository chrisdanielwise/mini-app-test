"use client";

import { useLayout } from "@/context/layout-provider";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { cn } from "@/lib/utils";

/**
 * 🛰️ COMMAND CENTER CLIENT ENGINE (Tactical Medium)
 * Normalized: World-standard fluid scaling for high-resiliency layout.
 * Fixed: Purged redundant sidebar/topnav loops and synchronized gutters.
 */
export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { isFullSize } = useLayout();

  return (
    <div className="flex flex-1 flex-col relative min-w-0 bg-background selection:bg-primary/20">
      
      {/* 🚀 TELEGRAM VIEWPORT SYNC & GUARD */}
      <div className="pt-1.5 md:pt-0">
        <NavGuard />
      </div>

      <main
        className={cn(
          "flex-1 transition-all duration-500 ease-in-out mx-auto w-full min-w-0",
          // TACTICAL CLAMPING: Prevents layout stretching on ultra-wide nodes
          isFullSize 
            ? "max-w-none px-4 md:px-8 lg:px-10" 
            : "max-w-7xl px-4 md:px-8",
          // SAFETY INSETS: Compensate for Mobile Floating Controller
          "pb-32 md:pb-16"
        )}
      >
        <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE FLOATING CONTROLLER: HIDDEN ON DESKTOP CLUSTERS */}
      <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>

      {/* TACTICAL BACKGROUND AURA: MINIMAL SIGNAL */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.15]">
        <div className="absolute top-[-5%] left-[-5%] h-[35%] w-[35%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] h-[35%] w-[35%] rounded-full bg-primary/10 blur-[100px]" />
      </div>
    </div>
  );
}
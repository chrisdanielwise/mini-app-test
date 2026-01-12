"use client";

import { useLayout } from "@/src/context/layout-provider";
import { DashboardSidebar } from "@/src/components/dashboard/sidebar";
import { DashboardTopNav } from "@/src/components/dashboard/top-nav";
import { BottomNav } from "@/src/components/dashboard/bottom-nav";
import { NavGuard } from "@/src/components/dashboard/nav-guard";
import { cn } from "@/src/lib/utils";

/**
 * 🛰️ COMMAND CENTER CLIENT ENGINE (V2)
 * High-resiliency shell for merchant operations.
 * Optimized for Telegram Mini App viewport constraints.
 */
export function DashboardLayoutClient({
  children,
  merchant,
}: {
  children: React.ReactNode;
  merchant: any;
}) {
  const { isFullSize, navMode } = useLayout();

  return (
    <div
      className={cn(
        "flex min-h-screen bg-background transition-all duration-700 ease-in-out",
        navMode === "TOPBAR" ? "flex-col" : "flex-row"
      )}
    >
      {/* 💻 DESKTOP SIDEBAR: Institutional Node Column */}
      {navMode === "SIDEBAR" && (
        <aside className="hidden lg:flex shrink-0 border-r border-border/40 bg-card/20 backdrop-blur-3xl">
          <DashboardSidebar merchant={merchant} />
        </aside>
      )}

      <div className="flex flex-1 flex-col relative">
        {/* 1. TOP NAV MODE: Command Strip */}
        {navMode === "TOPBAR" && (
          <header className="sticky top-0 z-[60] w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <DashboardTopNav merchant={merchant} />
          </header>
        )}

        {/* 🚀 TELEGRAM VIEWPORT SYNC: Overlap Protection Protocol */}
        <div className="pt-16 lg:pt-4">
          <NavGuard />
        </div>

        <main
          className={cn(
            "flex-1 transition-all duration-700 ease-in-out mx-auto w-full",
            // Dynamic viewport scaling based on FullSize toggle
            isFullSize
              ? "max-w-none px-4 md:px-12"
              : "max-w-[1400px] px-4 sm:px-10 lg:px-12",
            // Prevent Mobile BottomNav overlap (increased to pb-40 for safety)
            "pb-40 lg:pb-16"
          )}
        >
          {/* Main Content Node */}
          <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {children}
          </div>
        </main>

        {/* 📱 FLOATING CONTROLLER: Responsive Logic */}
        <div className="lg:hidden block">
          <BottomNav />
        </div>

        {/* Optional Desktop Floating Nav Mode */}
        {navMode === "BOTTOM" && (
          <div className="hidden lg:block">
            <BottomNav />
          </div>
        )}

        {/* Background Noise/Aura Effect for the Terminal feel */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
          <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        </div>
      </div>
    </div>
  );
}
"use client";

import { useLayout } from "@/src/context/layout-provider";
import { DashboardSidebar } from "@/src/components/dashboard/sidebar";
import { DashboardTopNav } from "@/src/components/dashboard/top-nav";
import { BottomNav } from "@/src/components/dashboard/bottom-nav";
import { NavGuard } from "@/src/components/dashboard/nav-guard";
import { cn } from "@/src/lib/utils";

/**
 * 🛰️ COMMAND CENTER CLIENT ENGINE
 * Fixes the Telegram 'Close' button overlap and handles responsive nav modes.
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
        "flex min-h-screen bg-background transition-all duration-500",
        navMode === "TOPBAR" ? "flex-col" : "flex-row"
      )}
    >
      {/* 💻 DESKTOP SIDEBAR: Only visible on LG screens */}
      {navMode === "SIDEBAR" && (
        <div className="hidden lg:flex shrink-0">
          <DashboardSidebar merchant={merchant} />
        </div>
      )}

      <div className="flex flex-1 flex-col relative overflow-hidden">
        {/* 2. TOP NAV MODE */}
        {navMode === "TOPBAR" && <DashboardTopNav merchant={merchant} />}

        {/* 🚀 TELEGRAM OVERLAP FIX: Added pt-14 (56px) to move UI below the X button */}
        <div className="pt-14 lg:pt-0">
          <NavGuard />
        </div>

        <main
          className={cn(
            "flex-1 transition-all duration-700 ease-in-out mx-auto w-full",
            // Viewport scaling
            isFullSize
              ? "max-w-none px-4 md:px-12"
              : "max-w-7xl px-4 sm:px-6 lg:px-8",
            // Ensure bottom nav doesn't cover content
            "pb-32 lg:pb-12"
          )}
        >
          <div className="p-4 sm:p-6 lg:py-8">{children}</div>
        </main>

        {/* 📱 MOBILE BOTTOM NAV: Always visible on small screens to prevent user traps */}
        <div className="lg:hidden block">
          <BottomNav />
        </div>

        {/* Desktop Bottom Nav if selected */}
        {navMode === "BOTTOM" && (
          <div className="hidden lg:block">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useLayout } from "@/context/layout-provider";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { cn } from "@/lib/utils";

export function DashboardLayoutClient({
  children,
  merchant,
}: {
  children: React.ReactNode;
  merchant: any;
}) {
  const { isFullSize, navMode } = useLayout();

  return (
    <div className={cn(
      "flex min-h-screen bg-background transition-colors duration-500",
      navMode === "TOPBAR" ? "flex-col" : "flex-row"
    )}>
      
      {/* 📱 MOBILE FIX: Hidden on small screens, only shows on LG (Desktop) */}
      {navMode === "SIDEBAR" && (
        <div className="hidden lg:flex">
          <DashboardSidebar merchant={merchant} />
        </div>
      )}

      <div className="flex flex-1 flex-col relative overflow-hidden">
        {/* 2. Top Nav Mode */}
        {navMode === "TOPBAR" && <DashboardTopNav merchant={merchant} />}
        
        {/* 🚀 UI FIX: Add pt-12 (48px) to push the Back button below the Telegram 'Close' button */}
        <div className="pt-10">
           <NavGuard />
        </div>

        <main
          className={cn(
            "flex-1 transition-all duration-700 ease-in-out mx-auto w-full",
            isFullSize ? "max-w-none px-4 md:px-12" : "max-w-7xl px-4 sm:px-6 lg:px-8",
            "pb-32" // Ensure bottom content isn't covered by BottomNav
          )}
        >
          {/* ⚡ Content Area */}
          <div className="p-4 sm:p-6 lg:py-8">
            {children}
          </div>
        </main>

        {/* 📱 MOBILE NAVIGATION: Always visible on mobile if set */}
        <div className="lg:hidden block">
             <BottomNav />
        </div>
        {/* Only show desktop version if navMode is BOTTOM */}
        {navMode === "BOTTOM" && <div className="hidden lg:block"><BottomNav /></div>}
      </div>
    </div>
  );
}
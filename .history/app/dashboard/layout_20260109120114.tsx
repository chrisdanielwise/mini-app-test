"use client";

import { useLayout } from "@/context/layout-provider";
import { DashboardSidebar } from "@/components/dashboard/sidebar"; // Left Side
import { DashboardTopNav } from "@/components/dashboard/top-nav";   // Top Side
import { BottomNav } from "@/components/dashboard/bottom-nav";       // Bottom Side
import { NavGuard } from "@/components/dashboard/nav-guard";

/**
 * 🛠️ THE MASTER SWITCHER
 * Supports Sidebar, Topbar, and Bottom navigation modes based on user preference.
 */
export default function DashboardLayout({
  children,
  merchant, // Pass merchant data down to the sidebar/nav
}: {
  children: React.ReactNode;
  merchant: any; 
}) {
  const { isFullSize, navMode } = useLayout();

  return (
    <div className={cn(
      "flex min-h-screen bg-background transition-all duration-500",
      navMode === "TOPBAR" ? "flex-col" : "flex-row"
    )}>
      
      {/* 1. SIDEBAR MODE (Left Navigation) */}
      {navMode === "SIDEBAR" && <DashboardSidebar merchant={merchant} />}

      <div className="flex flex-1 flex-col relative overflow-hidden">
        
        {/* 2. TOP NAV MODE (Top Navigation) */}
        {navMode === "TOPBAR" && <DashboardTopNav merchant={merchant} />}

        {/* 🚀 THE GLOBAL BACK BUTTON: Independent of Nav Mode */}
        <NavGuard />

        <main
          className={cn(
            "flex-1 transition-all duration-700 ease-in-out mx-auto w-full",
            isFullSize ? "max-w-none px-4 md:px-12" : "max-w-7xl px-4 sm:px-6 lg:px-8",
            navMode === "BOTTOM" ? "pb-32" : "pb-20"
          )}
        >
          <div className="py-6">
            {children}
          </div>
        </main>

        {/* 3. BOTTOM NAV MODE (Mobile/Mini-App Style) */}
        {navMode === "BOTTOM" && <BottomNav />}
      </div>
    </div>
  );
}
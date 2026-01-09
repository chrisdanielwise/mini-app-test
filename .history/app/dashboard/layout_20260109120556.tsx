"use client";

import { useLayout } from "@/context/layout-provider";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { cn } from "@/lib/utils";

/**
 * 🛠️ THE COMMAND CENTER LAYOUT
 * Dynamically renders Sidebar, TopBar, or BottomNav based on user settings.
 * Merchant data is passed down to maintain your existing identity logic.
 */
export default function DashboardLayout({
  children,
  merchant, // 🔑 Ensure your Server Page passes the merchant session data here
}: {
  children: React.ReactNode;
  merchant: {
    id: string;
    companyName: string;
    planStatus?: string;
  };
}) {
  const { isFullSize, navMode } = useLayout();

  return (
    <div className={cn(
      "flex min-h-screen bg-background transition-colors duration-500",
      navMode === "TOPBAR" ? "flex-col" : "flex-row"
    )}>
      
      {/* 1. SIDEBAR MODE: Your original vertical navigation */}
      {navMode === "SIDEBAR" && <DashboardSidebar merchant={merchant} />}

      <div className="flex flex-1 flex-col relative overflow-hidden">
        
        {/* 2. TOP NAV MODE: Horizontal header navigation */}
        {navMode === "TOPBAR" && <DashboardTopNav merchant={merchant} />}

        {/* 🚀 THE GLOBAL BACK BUTTON: Always available for sub-pages */}
        <NavGuard />

        <main
          className={cn(
            "flex-1 transition-all duration-700 ease-in-out mx-auto w-full",
            // 📐 Viewport Logic
            isFullSize 
              ? "max-w-none px-4 md:px-12" // Ultra-Wide expansion
              : "max-w-7xl px-4 sm:px-6 lg:px-8", // Standard centered view
            // 📱 Spacing Logic
            navMode === "BOTTOM" ? "pb-32" : "pb-20"
          )}
        >
          <div className="py-6">
            {children}
          </div>
        </main>

        {/* 3. BOTTOM NAV MODE: Floating mobile-style navigation */}
        {navMode === "BOTTOM" && <BottomNav />}
      </div>
    </div>
  );
}
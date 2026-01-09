"use client";

import { useLayout } from "@/context/layout-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isFullSize, navMode } = useLayout();

  return (
    <div className={`flex min-h-screen bg-background transition-colors duration-500 ${
      navMode === "TOPBAR" ? "flex-col" : "flex-row"
    }`}>
      
      {/* 1. SIDEBAR MODE: Only render if selected */}
      {navMode === "SIDEBAR" && <Sidebar />}

      <div className="flex flex-1 flex-col relative">
        
        {/* 2. TOP NAV MODE: Only render if selected */}
        {navMode === "TOPBAR" && <TopNav />}

        {/* 🚀 THE GLOBAL GUARD: Handles the 'Back' button for sub-pages */}
        <NavGuard />

        <main
          className={`flex-1 transition-all duration-700 ease-in-out mx-auto w-full ${
            isFullSize 
              ? "max-w-[1920px] px-4 md:px-12" 
              : "max-w-7xl px-4 sm:px-6 lg:px-8"
          } ${navMode === "BOTTOM" ? "pb-32" : "pb-20"}`}
        >
          <div className="py-6">
            {children}
          </div>
        </main>

        {/* 3. BOTTOM NAV MODE: Only render if selected */}
        {navMode === "BOTTOM" && <BottomNav />}
      </div>
    </div>
  );
}
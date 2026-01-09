"use client";

import { useLayout } from "@/context/layout-provider";
import { Sidebar } from "@/components/dashboard/sidebar"; // Assuming you have a sidebar
import { TopNav } from "@/components/dashboard/top-nav"; // Assuming you have a topnav

/**
 * 🛠️ DASHBOARD COMMAND LAYOUT
 * Consumes LayoutProvider state to toggle between Standard and Ultra-Wide views.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isFullSize } = useLayout();

  return (
    <div className="flex min-h-screen bg-background">
      {/* 1. Sidebar (Fixed or Responsive) 
          If you have a sidebar, it stays consistent regardless of viewport width.
      */}
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* 2. Top Navigation */}
        <TopNav />

        {/* 3. DYNAMIC VIEWPORT CONTAINER
            - max-w-7xl: Standard centered view (Legacy Feel)
            - max-w-[1920px]: Ultra-Wide view (Command Center Feel)
        */}
        <main
          className={`flex-1 transition-all duration-700 ease-in-out mx-auto w-full pb-20 ${
            isFullSize 
              ? "max-w-[1920px] px-4 md:px-12" // 🚀 Ultra-Wide Mode
              : "max-w-7xl px-4 sm:px-6 lg:px-8" // 🛡️ Standard Mode
          }`}
        >
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
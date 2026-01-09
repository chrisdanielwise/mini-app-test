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
      {navMode === "SIDEBAR" && <DashboardSidebar merchant={merchant} />}

      <div className="flex flex-1 flex-col relative overflow-hidden">
        {navMode === "TOPBAR" && <DashboardTopNav merchant={merchant} />}
        <NavGuard />
        <main
          className={cn(
            "flex-1 transition-all duration-700 ease-in-out mx-auto w-full",
            isFullSize ? "max-w-none px-4 md:px-12" : "max-w-7xl px-4 sm:px-6 lg:px-8",
            navMode === "BOTTOM" ? "pb-32" : "pb-20"
          )}
        >
          <div className="py-6">{children}</div>
        </main>
        {navMode === "BOTTOM" && <BottomNav />}
      </div>
    </div>
  );
}
"use client";

import { useLayout } from "@/context/layout-provider";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { cn } from "@/lib/utils";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userRole: string; // Passed from the Server Layout
}

/**
 * 🛰️ COMMAND CENTER CLIENT ENGINE (Tactical Medium)
 * Normalized: Multi-role fluid scaling for Admin, Manager, Support, and Merchant.
 * Optimized: Unified viewport for Telegram Mini App & Desktop Terminal.
 */
export default function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize } = useLayout();

  // Define Staff vs Merchant context for UI tweaks
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(userRole);

  return (
    <div className="flex flex-1 flex-col relative min-w-0 bg-background selection:bg-primary/20">
      
      {/* 🚀 TELEGRAM VIEWPORT SYNC & GUARD */}
      <div className="pt-1.5 md:pt-0">
        <NavGuard role={userRole} />
      </div>

      <main
        className={cn(
          "flex-1 transition-all duration-500 ease-in-out mx-auto w-full min-w-0",
          // TACTICAL CLAMPING: 
          // Admins/Staff get wider viewports for complex data tables.
          // Merchants get centered, readable max-w-7xl layouts.
          (isFullSize || isPlatformStaff) 
            ? "max-w-none px-4 md:px-8 lg:px-10" 
            : "max-w-7xl px-4 md:px-8",
          // SAFETY INSETS: Floating controller space
          "pb-36 md:pb-20"
        )}
      >
        <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE FLOATING CONTROLLER: Gated by user role */}
      <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-50">
        {/* Pass the role to BottomNav so it can filter icons (Support vs Merchant) */}
        <BottomNav role={userRole} />
      </div>

      {/* TACTICAL BACKGROUND AURA: Mode-Specific Signal */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.12]">
        <div className={cn(
          "absolute top-[-5%] left-[-5%] h-[40%] w-[40%] rounded-full blur-[120px]",
          isPlatformStaff ? "bg-amber-500/10" : "bg-primary/5"
        )} />
        <div className={cn(
          "absolute bottom-[-5%] right-[-5%] h-[40%] w-[40%] rounded-full blur-[120px]",
          isPlatformStaff ? "bg-amber-500/5" : "bg-primary/10"
        )} />
      </div>
    </div>
  );
}
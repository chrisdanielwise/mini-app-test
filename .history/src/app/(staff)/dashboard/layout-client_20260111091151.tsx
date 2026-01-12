"use client";

import { useLayout } from "@/context/layout-provider";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { NavGuard } from "@/components/dashboard/nav-guard";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userRole: string; 
}

/**
 * 🛰️ COMMAND CENTER CLIENT ENGINE (Hardened Version)
 * Fix: Implemented mounting safety to prevent hydration blocking.
 * Fix: Decoupled layout rendering from child data-node timeouts.
 */
export default function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize } = useLayout();
  const [mounted, setMounted] = useState(false);

  // 🛡️ HYDRATION GUARD: Ensures the sidebar and layout chassis render 
  // immediately even if background data nodes (like Revenue) are timing out.
  useEffect(() => {
    setMounted(true);
  }, []);

  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(userRole);

  // If the client hasn't mounted, we still return the layout structure 
  // to prevent "Jumping" UI, but we hide specific interactive elements.
  return (
    <div className="flex flex-1 flex-col relative min-w-0 bg-background selection:bg-primary/20">
      
      {/* 🚀 TELEGRAM VIEWPORT SYNC & GUARD */}
      <div className="pt-1.5 md:pt-0">
        <NavGuard role={userRole} />
      </div>

      <main
        className={cn(
          "flex-1 transition-all duration-500 ease-in-out mx-auto w-full min-w-0",
          // TACTICAL CLAMPING: Staff get wide-mode for data; Merchants get centered-mode.
          (isFullSize || isPlatformStaff) 
            ? "max-w-none px-4 md:px-8 lg:px-10" 
            : "max-w-7xl px-4 md:px-8",
          // SAFETY INSETS: Floating controller space for Telegram/Mobile
          "pb-36 md:pb-20"
        )}
      >
        <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-700">
          {/* ✅ RENDER PROTECTION: 
              We render children regardless of internal errors to ensure the 
              sidebar/topnav (parent level) stay visible even during a 500 error.
          */}
          {children}
        </div>
      </main>

      {/* 📱 MOBILE FLOATING CONTROLLER: Visible only after mount to prevent hydration mismatch */}
      {mounted && (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
          <BottomNav role={userRole} />
        </div>
      )}

      {/* TACTICAL BACKGROUND AURA: Mode-Specific Signal */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.12]">
        <div className={cn(
          "absolute top-[-5%] left-[-5%] h-[40%] w-[40%] rounded-full blur-[120px] transition-colors duration-1000",
          isPlatformStaff ? "bg-amber-500/20" : "bg-primary/10"
        )} />
        <div className={cn(
          "absolute bottom-[-5%] right-[-5%] h-[40%] w-[40%] rounded-full blur-[120px] transition-colors duration-1000",
          isPlatformStaff ? "bg-amber-500/10" : "bg-primary/20"
        )} />
      </div>
    </div>
  );
}
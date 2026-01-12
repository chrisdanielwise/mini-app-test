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
 * 🛰️ COMMAND CENTER CLIENT ENGINE (Apex Tier)
 * Normalized: Unified viewport for Telegram Mini App & Desktop Terminal.
 * Safety: Implements non-blocking hydration to preserve Sidebar visibility.
 */
export default function DashboardLayoutClient({ 
  children, 
  userRole 
}: DashboardLayoutClientProps) {
  const { isFullSize } = useLayout();
  const [mounted, setMounted] = useState(false);

  // 🛡️ MOUNT HANDSHAKE:
  // Ensures client-only features (BottomNav, NavGuard) don't trigger hydration 
  // mismatches that could crash the parent layout/sidebar.
  useEffect(() => {
    setMounted(true);
  }, []);

  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(userRole);

  return (
    <div className="flex flex-1 flex-col relative min-w-0 bg-background selection:bg-primary/20">
      
      {/* 🚀 TELEGRAM VIEWPORT SYNC & GUARD */}
      {/* NavGuard handles Telegram WebApp initialization and safe-areas */}
      <div className="pt-1.5 md:pt-0">
        <NavGuard role={userRole} />
      </div>

      <main
        className={cn(
          "flex-1 transition-all duration-500 ease-in-out mx-auto w-full min-w-0",
          // 🏁 TACTICAL CLAMPING: 
          // Staff (Admins/Managers) utilize full viewport width for complex data.
          // Merchants receive the standard max-w-7xl centered experience.
          (isFullSize || isPlatformStaff) 
            ? "max-w-none px-4 md:px-8 lg:px-10" 
            : "max-w-7xl px-4 md:px-8",
          // 🛡️ SAFETY INSETS: 
          // Extended padding-bottom (pb-40) to prevent the Telegram 'Main Button' 
          // from obscuring the lower UI components.
          "pb-40 md:pb-24"
        )}
      >
        <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-700">
          {/* ✅ PAYLOAD INGRESS: 
              If children crash, the parent layout (Sidebar/TopNav) remains static.
          */}
          {children}
        </div>
      </main>

      {/* 📱 MOBILE FLOATING CONTROLLER: 
          Strictly gated by mount state to prevent layout jumping on mobile Safari/Telegram.
      */}
      {mounted && (
        <div className="lg:hidden block fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom duration-500">
          <BottomNav role={userRole} />
        </div>
      )}

      {/* 🌌 TACTICAL BACKGROUND AURA: 
          Role-Specific signal logic provides instant psychological context.
      */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.15]">
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
"use client";

import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { BottomNav } from "@/components/app/bottom-nav";
import { cn } from "@/lib/utils";
import { useLayout } from "@/providers/LayoutProvider"; // 🛡️ Consistently mapped path
import { useEffect, useState } from "react";

/**
 * 🛰️ USER APP SHELL (Institutional v9.5.9)
 * Architecture: Clamped viewport for Telegram Mini App resiliency.
 * Logic: Synchronized with Theme Flavors (Amber for Staff, Emerald for Users).
 * Hardened: Hydration Shield prevents layout-shift during hardware handshake.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { flavor, mounted } = useLayout();
  const [isStable, setIsStable] = useState(false);

  // 🛡️ HYDRATION BARRIER
  // Ensures the theme-class and grid overlay only render after client hydration.
  useEffect(() => {
    if (mounted) setIsStable(true);
  }, [mounted]);

  if (!isStable) return null;

  return (
    <TelegramProvider>
      <div className={cn(
        "relative flex min-h-[100dvh] w-full flex-col bg-background text-foreground transition-colors duration-700",
        "antialiased overflow-x-hidden selection:bg-primary/20",
        // 🚀 THEME FLAVOR INJECTION: Controls global CSS variables
        flavor === "AMBER" ? "theme-staff" : "theme-merchant"
      )}>
        
        {/* --- DYNAMIC BACKGROUND AURA --- */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className={cn(
            "absolute top-[-10%] left-[-10%] w-[70%] h-[50%] rounded-full blur-[140px] opacity-[0.08] transition-all duration-1000",
            flavor === "AMBER" ? "bg-amber-500 scale-110" : "bg-primary scale-100"
          )} />
          <div className={cn(
            "absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full blur-[140px] opacity-[0.08] transition-all duration-1000",
            flavor === "AMBER" ? "bg-amber-600 scale-110" : "bg-primary scale-100"
          )} />
          
          {/* Subtle Grid Overlay for Tactical Aesthetic */}
          <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.03]" />
        </div>

        {/* 🚀 PRIMARY INGRESS: Content Node Clamped to Institutional Max-Width */}
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 pb-32">
          <div className="relative animate-in fade-in slide-in-from-bottom-3 duration-1000">
            {children}
          </div>
        </main>
        
        {/* 📱 BOTTOM NAV ANCHOR: Fixed at high Z-Index for Mini App visibility */}
        <div className="fixed bottom-0 left-0 right-0 z-[60] px-6 pb-8 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <BottomNav />
          </div>
        </div>

      </div>
    </TelegramProvider>
  );
}
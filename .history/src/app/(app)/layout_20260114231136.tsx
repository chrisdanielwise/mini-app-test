"use client";

import { TelegramProvider } from "@/components/providers/telegram-provider";
import { BottomNav } from "@/components/app/bottom-nav";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider"; 
import { useEffect, useState } from "react";

/**
 * 🛰️ USER APP SHELL (Institutional v12.29.0)
 * Architecture: Clamped viewport for Telegram Mini App (TMA) resiliency.
 * Logic: Soft-Session Layout Sync (Amber for Staff, Emerald for Users).
 * Hardened: Hydration Shield prevents layout-shift during hardware handshake.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { flavor, mounted } = useLayout();
  const [isStable, setIsStable] = useState(false);

  // 🛡️ HYDRATION BARRIER
  // Ensures the theme-class and tactical background render only after client hydration.
  useEffect(() => {
    if (mounted) setIsStable(true);
  }, [mounted]);

  // Prevent flash of unstyled content during the Bearer Recovery phase
  if (!isStable) return null;

  return (
    <TelegramProvider>
      <div
        className={cn(
          "relative flex min-h-[100dvh] w-full flex-col bg-background text-foreground transition-colors duration-700",
          "antialiased overflow-x-hidden selection:bg-primary/20",
          // 🚀 THEME FLAVOR INJECTION: Orchestrates global CSS variables
          flavor === "AMBER" ? "theme-staff" : "theme-merchant"
        )}
      >
        {/* --- DYNAMIC BACKGROUND AURA --- */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div
            className={cn(
              "absolute top-[-10%] left-[-10%] w-[70%] h-[50%] rounded-full blur-[140px] opacity-[0.08] transition-all duration-1000",
              flavor === "AMBER"
                ? "bg-amber-500 scale-110"
                : "bg-primary scale-100"
            )}
          />
          <div
            className={cn(
              "absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full blur-[140px] opacity-[0.08] transition-all duration-1000",
              flavor === "AMBER"
                ? "bg-amber-600 scale-110"
                : "bg-primary scale-100"
            )}
          />

          {/* Tactical Aesthetic: Radial Gradient Mask for Grid Backdrop */}
          <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.03]" />
        </div>

        {/* 🚀 PRIMARY INGRESS: Content Node Clamped to Institutional Max-Width */}
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 pb-32">
          <div className="relative animate-in fade-in slide-in-from-bottom-3 duration-1000">
            {children}
          </div>
        </main>

        {/* 📱 BOTTOM NAV ANCHOR: High Z-Index for persistent TMA visibility */}
        <div className="fixed bottom-0 left-0 right-0 z-[60] px-6 pb-8 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <BottomNav />
          </div>
        </div>
      </div>
    </TelegramProvider>
  );
}
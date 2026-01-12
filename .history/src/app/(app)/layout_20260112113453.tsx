"use client";

import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { BottomNav } from "@/components/app/bottom-nav";
// import { useLayout } from "@/context/layout-context";
import { cn } from "@/lib/utils";

/**
 * 🛰️ USER APP SHELL
 * Logic: Synchronized with Theme Flavors (Amber for Staff, Emerald for Users).
 * Optimized: Viewport-clamped for Telegram Mini App resiliency.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { flavor, mounted } = useLayout();

  // 🏁 HYDRATION BARRIER
  // Prevents layout shift before the hardware telemetry is restored.
  if (!mounted) return null;

  return (
    <TelegramProvider>
      <div className={cn(
        "relative flex min-h-[100dvh] w-full flex-col bg-background text-foreground transition-colors duration-700",
        "antialiased overflow-x-hidden selection:bg-primary/20",
        // Injecting the theme flavor class for global CSS variable control
        flavor === "AMBER" ? "theme-staff" : flavor === "EMERALD" ? "theme-merchant" : ""
      )}>
        
        {/* --- DYNAMIC BACKGROUND AURA --- */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className={cn(
            "absolute top-[-5%] left-[-5%] w-[60%] h-[40%] rounded-full blur-[120px] opacity-10 transition-colors duration-1000",
            flavor === "AMBER" ? "bg-amber-500" : "bg-primary"
          )} />
          <div className={cn(
            "absolute bottom-[-5%] right-[-5%] w-[50%] h-[40%] rounded-full blur-[120px] opacity-10 transition-colors duration-1000",
            flavor === "AMBER" ? "bg-amber-600" : "bg-primary"
          )} />
          
          {/* Subtle Grid Overlay for Tactical Aesthetic */}
          <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.02]" />
        </div>

        {/* 🚀 PRIMARY INGRESS: Content Node Clamped to 768px */}
        <main className="flex-1 w-full max-w-3xl mx-auto px-1 pb-28">
          <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-700">
            {children}
          </div>
        </main>
        
        {/* 📱 INSTITUTIONAL BOTTOM NAV: The Control Anchor */}
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <BottomNav />
          </div>
        </div>

      </div>
    </TelegramProvider>
  );
}
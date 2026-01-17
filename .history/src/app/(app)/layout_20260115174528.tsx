"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Providers & Hooks
import { DeviceProvider, useDeviceContext } from "@/components/providers/device-provider";
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { useLayout } from "@/context/layout-provider"; 

// 🛠️ Atomic UI Components
import { AppNavbar } from "@/components/app/navbar"; 
import { BottomNav } from "@/components/app/bottom-nav"; 

/**
 * 🌊 APEX_APP_SHELL (Institutional Apex v2026.1.15)
 * Architecture: Laminar Membrane Separation.
 * Aesthetics: Water-Ease Transition | Obsidian-OLED Depth.
 */
function AppShellContent({ children }: { children: React.ReactNode }) {
  const { flavor, mounted } = useLayout();
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();
  const [isStable, setIsStable] = useState(false);

  // 🛡️ HYDRATION SYNC: Ensures the membrane is ready before rendering
  useEffect(() => {
    if (mounted && isReady) setIsStable(true);
  }, [mounted, isReady]);

  // 🧪 MORPHOLOGY CALCULATIONS
  const paddingBottom = useMemo(() => {
    if (!isMobile) return "pb-24";
    // Mobile: Clears BottomNav + Hardware Home Indicator
    return `pb-[calc(11rem+${safeArea.bottom}px)]`;
  }, [isMobile, safeArea.bottom]);

  if (!isStable) return null;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col bg-background selection:bg-primary/30">
      
      {/* 🛰️ LAYER 1: FIXED TOP NAV (Portal Interface) */}
      <header className="fixed top-0 left-0 right-0 z-[200] w-full pointer-events-none">
        <div 
          className="pointer-events-auto"
          style={{ paddingTop: `${safeArea.top}px` }}
        >
          <AppNavbar />
        </div>
      </header>

      {/* 🚀 LAYER 2: THE LAMINAR SCROLL VOLUME */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative custom-scrollbar scroll-smooth">
        <div
          className={cn(
            "min-h-full flex flex-col w-full text-foreground transition-colors duration-1000",
            flavor === "AMBER" ? "theme-staff" : "theme-merchant"
          )}
        >
          {/* Content Indentation: Precision clearing for fixed UI nodes */}
          <div className={cn(
            "flex-1 w-full mx-auto px-6 md:px-12 max-w-7xl pt-28 md:pt-44",
            paddingBottom
          )}>
            {/* 🏎️ KINETIC INGRESS: Staggered entrance for all children */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* 📱 LAYER 3: FIXED BOTTOM NAV (Thumb-Zone Priority) */}
      {isMobile && (
        <footer 
          className="fixed bottom-0 left-0 right-0 z-[200] w-full pointer-events-none"
          style={{ paddingBottom: `calc(${safeArea.bottom}px + 2rem)` }}
        >
          <div className="mx-auto pointer-events-auto max-w-md px-6">
            <div className="animate-in slide-in-from-bottom-full fade-in duration-1000">
              <BottomNav />
            </div>
          </div>
        </footer>
      )}

      {/* 🌫️ LAYER 4: ATMOSPHERIC DEPTH (Fixed Backdrop) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Vapour Radiance */}
        <div
          className={cn(
            "absolute rounded-full blur-[160px] opacity-[0.08] transition-all duration-[3000ms] ease-in-out",
            flavor === "AMBER" ? "bg-amber-500" : "bg-primary"
          )}
          style={{ 
            top: "-10%", 
            left: "-5%", 
            width: isMobile ? "100vw" : "60vw", 
            height: "50vh" 
          }}
        />
        
        {/* Institutional Grid Mesh */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('/assets/grid.svg')] bg-[length:50px_50px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        
        {/* Obsidian Grain */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('/assets/noise.png')] mix-blend-overlay" />
      </div>
    </div>
  );
}

/**
 * 🛰️ ROOT PROVIDER WRAPPER
 * Ensures the hardware handshake is established before the shell hydrates.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeviceProvider>
      <TelegramProvider>
        <AppShellContent>{children}</AppShellContent>
      </TelegramProvider>
    </DeviceProvider>
  );
}

// src/
// ├── app/
// │   └── (app)/
// │       ├── marketplace/       <-- Handle Product/Category models
// │       ├── orders/            <-- Handle Order/OrderItem models
// │       ├── trading/           <-- Handle TradeSignal/CopierSetting models
// │       └── affiliate/         <-- Handle AffiliateLink models
// ├── components/
// │   ├── marketplace/           <-- ProductCards, CategoryGrids
// │   ├── trading/               <-- MT4Form, SignalPulse
// │   ├── orders/                <-- OrderTimeline, RiderStatus
// │   ├── vault/                 <-- BalanceDisplay, WithdrawalForm
// │   └── shared/                <-- BottomNav, DiscoveryHeader (formerly /components/app)
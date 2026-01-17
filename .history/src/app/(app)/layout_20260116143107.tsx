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
 * 🛰️ APEX_APP_SHELL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon.
 * Fix: High-density h-14/h-16 profiles prevent layout blowout.
 */
function AppShellContent({ children }: { children: React.ReactNode }) {
  const { flavor, mounted } = useLayout();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const [isStable, setIsStable] = useState(false);

  useEffect(() => {
    if (mounted && isReady) setIsStable(true);
  }, [mounted, isReady]);

  // 🧪 TACTICAL CLEARANCE
  const paddingBottom = useMemo(() => {
    if (!isMobile) return "pb-12";
    // Mobile Standard: Clears h-16 BottomNav + Hardware Home Indicator
    return `pb-[calc(5rem+${safeArea.bottom}px)]`;
  }, [isMobile, safeArea.bottom]);

  if (!isStable) return null;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col bg-background selection:bg-primary/20 leading-none">
      
      {/* 🛡️ LAYER 1: FIXED HUD (Stationary Header) */}
      <header className="fixed top-0 left-0 right-0 z-[200] w-full pointer-events-none">
        <div 
          className="pointer-events-auto"
          style={{ paddingTop: `calc(${safeArea.top}px * 0.5)` }}
        >
          <AppNavbar />
        </div>
      </header>

      {/* 🚀 LAYER 2: THE LAMINAR SCROLL VOLUME */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative custom-scrollbar scroll-smooth">
        <div
          className={cn(
            "min-h-full flex flex-col w-full text-foreground transition-colors duration-700",
            flavor === "AMBER" ? "theme-staff" : "theme-merchant"
          )}
        >
          {/* Content Indentation: Precision clearing for clinical HUD (h-14/16 standard) */}
          <div className={cn(
            "flex-1 w-full mx-auto px-5 md:px-8 max-w-6xl pt-20 md:pt-24",
            paddingBottom
          )}>
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* 📱 LAYER 3: FIXED COMMAND (Stationary Footer) */}
      {isMobile && (
        <footer 
          className="fixed bottom-0 left-0 right-0 z-[200] w-full pointer-events-none"
          style={{ paddingBottom: `calc(${safeArea.bottom}px * 0.5)` }}
        >
          <div className="mx-auto pointer-events-auto">
            <BottomNav />
          </div>
        </footer>
      )}

      {/* 🌫️ LAYER 4: ATMOSPHERIC DEPTH (Stationary Grid) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Radiance */}
        <div
          className={cn(
            "absolute rounded-full blur-[120px] opacity-[0.02] transition-all duration-1000",
            flavor === "AMBER" ? "bg-amber-500" : "bg-primary"
          )}
          style={{ top: "-10%", left: "20%", width: "60vw", height: "40vh" }}
        />
        
        {/* Institutional Grid Mesh (Stationary Horizon Anchor) */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('/assets/grid.svg')] bg-[length:32px_32px] md:bg-[length:48px_48px] bg-center" />
      </div>
    </div>
  );
}

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
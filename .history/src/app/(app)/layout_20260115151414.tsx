"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Providers
import { DeviceProvider, useDeviceContext } from "@/components/providers/device-provider";
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { useLayout } from "@/context/layout-provider"; 

// 🛠️ Atomic UI Components
import { BottomNav } from "@/components/app/bottom-nav";
import { Waves } from "lucide-react";

/**
 * 🛰️ APEX_APP_SHELL (Institutional Apex v16.16.30)
 * Architecture: Hardware-Clamped Viewport for TMA Resiliency.
 * Logic: morphology-aware background physics with Water-Ease motion.
 */
function AppShellContent({ children }: { children: React.ReactNode }) {
  const { flavor, mounted } = useLayout();
  
  // 🛰️ DEVICE INGRESS: Consuming full morphology physics
  const { 
    isReady, 
    viewportHeight, 
    viewportWidth, 
    isDesktop, 
    safeArea,
    screenSize 
  } = useDeviceContext();

  const [isStable, setIsStable] = useState(false);

  // 🛡️ HYDRATION & STABILIZATION BARRIER
  useEffect(() => {
    if (mounted && isReady) {
      setIsStable(true);
    }
  }, [mounted, isReady]);

  // Prevent flash of unstyled content during hardware calibration
  if (!isStable) return null;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col bg-background text-foreground transition-colors duration-[1000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "antialiased overflow-x-hidden selection:bg-primary/20",
        flavor === "AMBER" ? "theme-staff" : "theme-merchant"
      )}
      style={{ minHeight: `calc(var(--vh, 1vh) * 100)` }}
    >
      {/* --- 🌊 DYNAMIC BACKGROUND AURA: Hardware-Fluid Physics --- */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Kinetic Bloom Top-Left */}
        <div
          className={cn(
            "absolute rounded-full blur-[140px] opacity-[0.08] transition-all duration-[2000ms] ease-out",
            flavor === "AMBER" ? "bg-amber-500 scale-125" : "bg-primary scale-100"
          )}
          style={{ 
            top: "-10%", 
            left: "-10%", 
            width: `${Math.max(300, viewportWidth * 0.7)}px`, 
            height: `${Math.max(300, viewportHeight * 0.5)}px` 
          }}
        />
        
        {/* Kinetic Bloom Bottom-Right */}
        <div
          className={cn(
            "absolute rounded-full blur-[140px] opacity-[0.08] transition-all duration-[2000ms] ease-out",
            flavor === "AMBER" ? "bg-amber-600 scale-125" : "bg-primary scale-100"
          )}
          style={{ 
            bottom: "-10%", 
            right: "-10%", 
            width: `${Math.max(250, viewportWidth * 0.6)}px`, 
            height: `${Math.max(250, viewportHeight * 0.5)}px` 
          }}
        />

        {/* 📐 Institutional Grid Backdrop: Fluid Masking */}
        <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.03]" />
        
        {/* Subsurface Flow (Waves) */}
        <Waves className="absolute bottom-0 left-0 w-full opacity-[0.02] text-primary animate-pulse" 
               style={{ height: `${viewportHeight * 0.2}px` }} />
      </div>

      {/* 🚀 PRIMARY INGRESS: Content Node Morphology */}
      <main className={cn(
        "flex-1 w-full mx-auto transition-all duration-1000",
        isDesktop ? "max-w-7xl px-12" : "max-w-3xl px-6",
        "pb-44" // Space for Bottom Nav
      )}>
        <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
          {children}
        </div>
      </main>

      {/* 📱 NAVIGATION ANCHOR: Safe-Area Anchored */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-[100] w-full pointer-events-none"
        style={{ paddingBottom: `${safeArea.bottom}px` }}
      >
        <div className={cn(
          "mx-auto pointer-events-auto transition-all duration-1000",
          isDesktop ? "max-w-xl px-10 mb-10" : "max-w-md px-6 mb-8"
        )}>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}

/**
 * 🏛️ FINAL APP SHELL WRAPPER
 * Implements the Provider Hierarchy for Hardware Synchronization.
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
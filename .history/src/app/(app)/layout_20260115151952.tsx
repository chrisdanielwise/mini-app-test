"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Providers
import { DeviceProvider, useDeviceContext } from "@/components/providers/device-provider";
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { useLayout } from "@/context/layout-provider"; 

// 🛠️ Atomic UI Components
import { AppNavbar } from "@/components/app/navbar"; // 🛰️ IMPORTED: Desktop Command Membrane
import { BottomNav } from "@/components/app/bottom-nav"; // 📱 Mobile Thumb-Zone
import { Waves } from "lucide-react";

/**
 * 🛰️ APEX_APP_SHELL (Institutional Apex v16.16.30)
 * Architecture: Hardware-Clamped Viewport for TMA Resiliency.
 * Logic: morphology-aware background physics with Water-Ease motion.
 */
function AppShellContent({ children }: { children: React.ReactNode }) {
  const { flavor, mounted } = useLayout();
  
  const { 
    isReady, 
    viewportHeight, 
    viewportWidth, 
    isDesktop, 
    isMobile,
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
      {/* 📡 GLOBAL COMMAND MEMBRANE: Top Navigation (Visible on all tiers) */}
      <AppNavbar />

      {/* --- 🌊 DYNAMIC BACKGROUND AURA --- */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className={cn(
            "absolute rounded-full blur-[140px] opacity-[0.06] transition-all duration-[2000ms] ease-out",
            flavor === "AMBER" ? "bg-amber-500 scale-125" : "bg-primary scale-100"
          )}
          style={{ 
            top: "-10%", 
            left: "-10%", 
            width: `${Math.max(300, viewportWidth * 0.7)}px`, 
            height: `${Math.max(300, viewportHeight * 0.5)}px` 
          }}
        />
        
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/assets/grid.svg')] bg-center transition-opacity duration-1000" />
        
        <Waves className="absolute bottom-0 left-0 w-full opacity-[0.02] text-primary animate-pulse" 
               style={{ height: `${viewportHeight * 0.2}px` }} />
      </div>

      {/* 🚀 PRIMARY INGRESS: Content Node Morphology */}
      <main className={cn(
        "flex-1 w-full mx-auto transition-all duration-1000",
        isDesktop ? "max-w-7xl px-12" : "max-w-3xl px-6",
        // 🕵️ Dynamic Bottom Padding: Extra space if mobile nav is present
        isMobile ? "pb-44" : "pb-24",
        // 🕵️ Dynamic Top Padding: Accommodate the AppNavbar
        "pt-24 md:pt-36"
      )}>
        <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE NAVIGATION ANCHOR: Safe-Area Anchored */}
      {isMobile && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-[100] w-full pointer-events-none"
          style={{ paddingBottom: `${safeArea.bottom}px` }}
        >
          <div className={cn(
            "mx-auto pointer-events-auto transition-all duration-1000",
            "max-w-md px-6 mb-8"
          )}>
            <BottomNav />
          </div>
        </div>
      )}
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
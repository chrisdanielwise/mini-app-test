"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Providers
import { DeviceProvider, useDeviceContext } from "@/components/providers/device-provider";
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { useLayout } from "@/context/layout-provider"; 

// 🛠️ Atomic UI Components
import { AppNavbar } from "@/components/app/navbar"; 
import { BottomNav } from "@/components/app/bottom-nav"; 
import { Waves } from "lucide-react";

/**
 * 🛰️ APEX_APP_SHELL (Institutional Apex v16.16.31)
 * Architecture: Root-Level Membrane Separation.
 * Fix: Separates the Nav Membranes from the Animated Body to prevent scroll-leakage.
 */
function AppShellContent({ children }: { children: React.ReactNode }) {
  const { flavor, mounted } = useLayout();
  const { isReady, viewportHeight, viewportWidth, isMobile, safeArea } = useDeviceContext();
  const [isStable, setIsStable] = useState(false);

  useEffect(() => {
    if (mounted && isReady) setIsStable(true);
  }, [mounted, isReady]);

  if (!isStable) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col bg-background">
      
      {/* 📡 LAYER 1: FIXED TOP NAV (Outside of scrolling/animated containers) */}
      <header className="fixed top-0 left-0 right-0 z-[200] w-full pointer-events-none">
        <div className="pointer-events-auto">
          <AppNavbar />
        </div>
      </header>

      {/* 🚀 LAYER 2: THE SCROLLING VIEWPORT */}
      {/* This container handles the scroll, keeping the 'fixed' headers truly fixed to the screen */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
        <div
          className={cn(
            "min-h-full flex flex-col w-full text-foreground transition-colors duration-1000",
            flavor === "AMBER" ? "theme-staff" : "theme-merchant"
          )}
        >
          {/* Content Indentation: Clears the fixed nav height */}
          <div className={cn(
            "flex-1 w-full mx-auto px-6 md:px-12 max-w-7xl pt-24 md:pt-40",
            isMobile ? "pb-44" : "pb-24"
          )}>
            {/* 🏎️ ANIMATIONS ARE SAFE HERE (Inside the scroll container) */}
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* 📱 LAYER 3: FIXED BOTTOM NAV */}
      {isMobile && (
        <footer 
          className="fixed bottom-0 left-0 right-0 z-[200] w-full pointer-events-none"
          style={{ paddingBottom: `${safeArea.bottom}px` }}
        >
          <div className="mx-auto pointer-events-auto max-w-md px-6 mb-8">
            <BottomNav />
          </div>
        </footer>
      )}

      {/* 🌊 LAYER 4: FIXED BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={cn(
            "absolute rounded-full blur-[140px] opacity-[0.06] transition-all duration-2000",
            flavor === "AMBER" ? "bg-amber-500" : "bg-primary"
          )}
          style={{ top: "-5%", left: "-5%", width: "60vw", height: "40vh" }}
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/assets/grid.svg')] bg-center" />
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
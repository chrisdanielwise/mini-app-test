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
 * 🛰️ APEX_APP_SHELL (Institutional Apex v16.16.30)
 * Architecture: Root-Level Fixed Anchor.
 * Fix: Bypasses parent transforms by moving navigation to the top of the DOM tree.
 */
function AppShellContent({ children }: { children: React.ReactNode }) {
  const { flavor, mounted } = useLayout();
  const { 
    isReady, 
    viewportHeight, 
    viewportWidth, 
    isDesktop, 
    isMobile,
    safeArea 
  } = useDeviceContext();

  const [isStable, setIsStable] = useState(false);

  useEffect(() => {
    if (mounted && isReady) {
      setIsStable(true);
    }
  }, [mounted, isReady]);

  if (!isStable) return null;

  return (
    <div className="relative min-h-screen w-full">
      {/* 📡 ANCHORED TOP MEMBRANE: This stays locked to the pixel-top of the screen */}
      <header className="fixed top-0 left-0 right-0 z-[110] w-full pointer-events-none">
        <div className="pointer-events-auto">
          <AppNavbar />
        </div>
      </header>

      {/* 🚀 THE SCROLLING BODY: No transforms or animations here */}
      <div
        className={cn(
          "flex w-full flex-col bg-background text-foreground transition-colors duration-1000",
          "antialiased selection:bg-primary/20",
          flavor === "AMBER" ? "theme-staff" : "theme-merchant"
        )}
        style={{ minHeight: `calc(var(--vh, 1vh) * 100)` }}
      >
        <main className={cn(
          "flex-1 w-full mx-auto relative z-10",
          isDesktop ? "max-w-7xl px-12" : "max-w-3xl px-6",
          // Indentation to clear the fixed navbar
          "pt-24 md:pt-40",
          isMobile ? "pb-44" : "pb-24"
        )}>
          {/* Internal animations are safe here */}
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {children}
          </div>
        </main>

        {/* 📱 ANCHORED BOTTOM MEMBRANE */}
        {isMobile && (
          <footer 
            className="fixed bottom-0 left-0 right-0 z-[110] w-full pointer-events-none"
            style={{ paddingBottom: `${safeArea.bottom}px` }}
          >
            <div className="mx-auto pointer-events-auto max-w-md px-6 mb-8">
              <BottomNav />
            </div>
          </footer>
        )}
      </div>

      {/* --- 🌊 AMBIENT BACKGROUND: Fixed behind everything --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={cn(
            "absolute rounded-full blur-[140px] opacity-[0.06] transition-all duration-2000",
            flavor === "AMBER" ? "bg-amber-500" : "bg-primary"
          )}
          style={{ 
            top: "-5%", 
            left: "-5%", 
            width: `${Math.max(300, viewportWidth * 0.6)}px`, 
            height: `${Math.max(300, viewportHeight * 0.4)}px` 
          }}
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/assets/grid.svg')] bg-center" />
        <Waves className="absolute bottom-0 left-0 w-full opacity-[0.02] text-primary" 
               style={{ height: `${viewportHeight * 0.15}px` }} />
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
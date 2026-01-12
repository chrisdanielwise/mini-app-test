"use client";

import { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ APP CLIENT PROVIDER
 * Logic: Master Hardware & Identity Handshake.
 * Feature: Syncs Native Telegram UI with internal Flavor Context (Amber/Emerald).
 */
export function AppClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const { flavor } = useLayout();
  const isStaffFlavor = flavor === "AMBER";

  const initTMA = useCallback(() => {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) return;

    const tg = window.Telegram.WebApp;

    // 1. Hardware Handshake
    tg.ready();
    tg.expand(); // Absolute immersion protocol
    
    // 2. Viewport Hardening (v8.0 Protocol)
    // Anti-Bounce: Blocks accidental closure during rapid touch interactions.
    if (tg.isVerticalSwipesEnabled) {
      tg.disableVerticalSwipes();
    }

    // 3. Institutional Haptics
    // Physical pulse confirming the Node cluster is active.
    hapticFeedback("light");

    // 4. Kinetic Theme & Flavor Synchronization
    const theme = tg.themeParams;
    const root = document.documentElement;
    
    // Logic: Map native colors while allowing Zipha flavors to override accent tokens.
    const themeMap = {
      '--tg-bg': theme.bg_color || '#000000',
      '--tg-text': theme.text_color || '#ffffff',
      '--tg-hint': theme.hint_color || '#999999',
      '--tg-link': isStaffFlavor ? '#f59e0b' : (theme.link_color || '#10b981'),
      '--tg-primary': isStaffFlavor ? '#f59e0b' : (theme.button_color || '#10b981'),
      '--tg-secondary-bg': theme.secondary_bg_color || '#0a0a0a',
      // Hardware Safe Zones: Critical for Notch-Parity on iOS/Android nodes
      '--tg-safe-top': 'var(--tg-content-safe-area-inset-top, 0px)',
      '--tg-safe-bottom': 'var(--tg-content-safe-area-inset-bottom, 0px)',
    };

    Object.entries(themeMap).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 5. Native Header Protocol
    // Updates the Telegram Status Bar color to match the Role Flavor (Amber/Emerald).
    const headerHex = isStaffFlavor ? "#0f0f0f" : (theme.secondary_bg_color || "#0a0a0a");
    tg.setHeaderColor(headerHex);
    tg.setBackgroundColor(theme.bg_color || "#000000");

    setIsReady(true);
  }, [isStaffFlavor]);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      initTMA();
    } else {
      // Fallback Polling: Ensures hydration even on slow mobile networks.
      const interval = setInterval(() => {
        if (window.Telegram?.WebApp) {
          initTMA();
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [initTMA]);

  return (
    <>
      <Script 
        src="https://telegram.org/js/telegram-web-app.js" 
        strategy="beforeInteractive" 
      />
      {/* 🚀 RENDER PHYSICS:
          Utilizes 100dvh to prevent the 'Squeeze' effect during virtual keyboard activation.
      */}
      <div 
        className={cn(
          "min-h-[100dvh] w-full flex flex-col transition-opacity duration-1000 ease-in-out antialiased",
          isReady ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {children}
      </div>
    </>
  );
}
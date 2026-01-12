"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ APP CLIENT PROVIDER
 * Logic: Master Hardware Handshake with Loop Protection.
 * Fixed: Infinite 200-status refresh loop resolved via didInit ref anchor.
 */
export function AppClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const { flavor } = useLayout();
  const isStaffFlavor = flavor === "AMBER";
  
  // 🛡️ THE ANCHOR: Prevents the "Initialization Storm"
  const didInit = useRef(false);

  const initTMA = useCallback((force = false) => {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) return false;
    
    // Prevent double-initialization unless forced
    if (didInit.current && !force) return true;

    const tg = window.Telegram.WebApp;

    // 1. Hardware Handshake
    tg.ready();
    tg.expand();
    
    // 2. Viewport Hardening
    if (tg.isVerticalSwipesEnabled) {
      tg.disableVerticalSwipes();
    }

    // 3. Institutional Haptics
    // Only fire on first true initialization to avoid "haptic spam"
    if (!didInit.current) {
      hapticFeedback("light");
    }

    // 4. Kinetic Theme & Flavor Synchronization
    const theme = tg.themeParams;
    const root = document.documentElement;
    
    const themeMap = {
      '--tg-bg': theme.bg_color || '#000000',
      '--tg-text': theme.text_color || '#ffffff',
      '--tg-link': isStaffFlavor ? '#f59e0b' : (theme.link_color || '#10b981'),
      '--tg-primary': isStaffFlavor ? '#f59e0b' : (theme.button_color || '#10b981'),
      '--tg-secondary-bg': theme.secondary_bg_color || '#0a0a0a',
      '--tg-safe-top': 'var(--tg-content-safe-area-inset-top, 0px)',
      '--tg-safe-bottom': 'var(--tg-content-safe-area-inset-bottom, 0px)',
    };

    Object.entries(themeMap).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 5. Native Header Protocol
    const headerHex = isStaffFlavor ? "#0f0f0f" : (theme.secondary_bg_color || "#0a0a0a");
    tg.setHeaderColor(headerHex);
    tg.setBackgroundColor(theme.bg_color || "#000000");

    didInit.current = true;
    setIsReady(true);
    return true;
  }, [isStaffFlavor]);

  // 🔥 EFFECT 1: Immediate Handshake & Polling Escape Hatch
  useEffect(() => {
    if (didInit.current) return;

    // Attempt 1: Immediate sync if SDK is already present
    if (initTMA()) return;

    // Attempt 2: High-frequency polling for slow hydration
    const interval = setInterval(() => {
      if (initTMA()) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [initTMA]);

  // 🔥 EFFECT 2: Live Flavor Transitions (Non-destructive)
  // Re-runs only the UI sync when flavor changes, without re-triggering haptics or ready()
  useEffect(() => {
    if (didInit.current) {
      initTMA(true); 
    }
  }, [isStaffFlavor, initTMA]);

  return (
    <>
      <Script 
        src="https://telegram.org/js/telegram-web-app.js" 
        strategy="beforeInteractive" 
      />
      <div 
        className={cn(
          "min-h-[100dvh] w-full flex flex-col transition-opacity duration-700 ease-in-out antialiased",
          isReady ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {children}
      </div>
    </>
  );
}
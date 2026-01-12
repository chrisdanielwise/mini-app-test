"use client";

import { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ APP CLIENT PROVIDER (Apex Tier)
 * Normalized: 100dvh geometry for zero-jitter viewport scaling.
 * Optimized: Hardware safe-zone injection and institutional haptic handshake.
 */
export function AppClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  const initTMA = useCallback(() => {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) return;

    const tg = window.Telegram.WebApp;

    // 1. Hardware Handshake
    tg.ready();
    tg.expand(); // Force absolute immersion
    
    // 2. Viewport Hardening (v8.0 Protocol)
    // Prevents accidental 'swipe-to-close' during high-velocity interactions.
    if (tg.isVerticalSwipesEnabled) {
      tg.disableVerticalSwipes();
    }

    // 3. Institutional Haptics
    // Physical confirmation that the node is operational.
    hapticFeedback("light");

    // 4. Kinetic Theme Synchronization
    const theme = tg.themeParams;
    const root = document.documentElement;
    
    const themeMap = {
      '--tg-bg': theme.bg_color || '#ffffff',
      '--tg-text': theme.text_color || '#000000',
      '--tg-hint': theme.hint_color || '#999999',
      '--tg-link': theme.link_color || '#2481cc',
      '--tg-primary': theme.button_color || '#2481cc',
      '--tg-primary-text': theme.button_text_color || '#ffffff',
      '--tg-secondary-bg': theme.secondary_bg_color || '#f4f4f5',
      // Hardware Safe Zones: Critical for notch-parity
      '--tg-safe-top': 'var(--tg-content-safe-area-inset-top, 0px)',
      '--tg-safe-bottom': 'var(--tg-content-safe-area-inset-bottom, 0px)',
    };

    Object.entries(themeMap).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 5. System UI Integration
    tg.setHeaderColor(theme.secondary_bg_color || 'secondary_bg_color');
    tg.setBackgroundColor(theme.bg_color || 'bg_color');

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      initTMA();
    } else {
      // Fallback Polling for slow SDK hydration
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
          "min-h-[100dvh] w-full flex flex-col transition-opacity duration-700 ease-in-out antialiased",
          isReady ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {children}
      </div>
    </>
  );
}
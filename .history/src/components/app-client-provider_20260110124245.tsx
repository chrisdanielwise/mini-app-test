"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { cn } from "@/lib/utils";

/**
 * 🛰️ APP CLIENT PROVIDER (Apex Tier)
 * The hardware-to-software bridge for Telegram Mini App (TMA) initialization.
 * Handles viewport expansion, theme-variable injection, and entrance physics.
 */
export function AppClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    /**
     * 🏁 TMA SYNCHRONIZATION PROTOCOL
     * Communicates with the native Telegram kernel to calibrate the UI.
     */
    const initTMA = () => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;

        // 1. Hardware Handshake
        tg.ready();
        tg.expand(); // Absolute immersion: occupy full vertical viewport
        
        // 2. Viewport Hardening (v8.0 Feature)
        // Disables the 'swipe-to-close' gesture which often interrupts financial UX.
        if (tg.isVerticalSwipesEnabled) {
          tg.disableVerticalSwipes();
        }

        // 3. Theme Variable Injection
        // Maps Telegram's dynamic palette to standard CSS variables.
        const theme = tg.themeParams;
        const root = document.documentElement;
        
        const themeMap = {
          '--tg-bg': theme.bg_color,
          '--tg-text': theme.text_color,
          '--tg-hint': theme.hint_color,
          '--tg-link': theme.link_color,
          '--tg-primary': theme.button_color,
          '--tg-primary-text': theme.button_text_color,
          '--tg-secondary-bg': theme.secondary_bg_color,
        };

        Object.entries(themeMap).forEach(([key, value]) => {
          if (value) root.style.setProperty(key, value);
        });

        // 4. Set Header/Bottom Bar Integration
        // Ensures the system UI blends seamlessly with the app's background.
        tg.setHeaderColor(theme.bg_color || 'bg_color');
        tg.setBackgroundColor(theme.bg_color || 'bg_color');

        setIsReady(true);
      }
    };

    // Immediate check or fallback sync
    if (window.Telegram?.WebApp) {
      initTMA();
    } else {
      const interval = setInterval(() => {
        if (window.Telegram?.WebApp) {
          initTMA();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      <Script 
        src="https://telegram.org/js/telegram-web-app.js" 
        strategy="beforeInteractive" 
      />
      {/* 🚀 RENDER PHYSICS: 
          Content remains hidden until the Telegram SDK has calibrated 
          the theme variables to prevent the 'Flash of Unstyled Content' (FOUC).
      */}
      <div 
        className={cn(
          "min-h-screen transition-opacity duration-1000",
          isReady ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {children}
      </div>
    </>
  );
}
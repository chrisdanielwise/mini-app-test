"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ APP CLIENT PROVIDER (Apex Tier)
 * Hardened: Terminate-on-Login protocol to prevent hydration redirect storms.
 * Optimized: Single-shot hardware handshake with kinetic flavor sync.
 */
export function AppClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const { flavor } = useLayout();
  const isStaffFlavor = flavor === "AMBER";
  
  // 🛡️ THE ANCHOR: Prevents the "Initialization Storm" re-renders
  const didInit = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initTMA = useCallback((force = false) => {
    // 🛡️ THE TERMINATOR
    // If we are on the login gate, we mount the UI immediately and STOP checking for Telegram.
    // This allows the Login page to handle its own auth/token logic without hardware interference.
    if (pathname === "/dashboard/login") {
      setIsReady(true);
      didInit.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return true;
    }

    if (typeof window === "undefined" || !window.Telegram?.WebApp) return false;
    
    // Prevent double-initialization unless flavor-sync is forced
    if (didInit.current && !force) return true;

    const tg = window.Telegram.WebApp;

    // 1. Hardware Handshake
    tg.ready();
    tg.expand();
    
    // 2. Viewport Hardening (API 8.0+)
    try {
      if (tg.isVerticalSwipesEnabled) {
        tg.disableVerticalSwipes();
      }
    } catch (e) {
      console.warn("[Hardware_Protocol] Vertical swipe control not supported.");
    }

    // 3. Institutional Haptics
    if (!didInit.current) {
      hapticFeedback("light");
    }

    // 4. Kinetic Theme & Flavor Synchronization
    // Maps native Telegram CSS variables to our Tailwind system
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
    // Enforces the "Amber/Emerald" flavor at the OS level (iOS/Android status bar)
    const headerHex = isStaffFlavor ? "#0f0f0f" : (theme.secondary_bg_color || "#0a0a0a");
    tg.setHeaderColor(headerHex);
    tg.setBackgroundColor(theme.bg_color || "#000000");

    didInit.current = true;
    setIsReady(true);
    return true;
  }, [isStaffFlavor, pathname]);

  // 🔥 EFFECT 1: Single-Shot Hardware Discovery
  useEffect(() => {
    if (didInit.current) return;
    if (initTMA()) return;

    intervalRef.current = setInterval(() => {
      if (initTMA()) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 150); 

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initTMA]);

  // 🔥 EFFECT 2: Live Flavor Sync
  // Re-runs the color injection if the user toggles Staff Oversight mode
  useEffect(() => {
    if (didInit.current && pathname !== "/dashboard/login") {
      initTMA(true); 
    }
  }, [isStaffFlavor, pathname, initTMA]);

  return (
    <>
      {/* 🚀 External Script Ingress */}
      <Script 
        src="https://telegram.org/js/telegram-web-app.js" 
        strategy="beforeInteractive" 
      />
      
      {/* 🎬 Content Node: Fades in only when hardware is synchronized */}
      <div className={cn(
        "min-h-[100dvh] w-full flex flex-col transition-opacity duration-700 ease-in-out antialiased",
        isReady ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {children}
      </div>
    </>
  );
}
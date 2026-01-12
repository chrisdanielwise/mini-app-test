"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ APP CLIENT PROVIDER (Apex Tier)
 * Hardened: Version-Aware initialization to prevent Legacy SDK (6.0) crashes.
 * Optimized: Terminate-on-Login protocol to stop hydration redirect storms.
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
    // If at the gate, we stand down immediately to prevent hydration conflicts.
    if (pathname === "/dashboard/login") {
      setIsReady(true);
      didInit.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return true;
    }

    if (typeof window === "undefined" || !window.Telegram?.WebApp) return false;
    if (didInit.current && !force) return true;

    const tg = window.Telegram.WebApp;

    // 1. Hardware Handshake (Universal)
    tg.ready();
    tg.expand();
    
    // 🛡️ LEGACY GUARD (Critical Fix for Version 6.0 Crashes)
    // APIs like setHeaderColor and disableVerticalSwipes require v6.1+
    const isVersionAtLeast = (ver: string) => {
      try {
        const current = tg.version.split('.').map(Number);
        const target = ver.split('.').map(Number);
        for (let i = 0; i < Math.max(current.length, target.length); i++) {
          if ((current[i] || 0) > (target[i] || 0)) return true;
          if ((current[i] || 0) < (target[i] || 0)) return false;
        }
        return true;
      } catch (e) {
        return false;
      }
    };

    const hasModernApi = isVersionAtLeast("6.1");

    // 2. Viewport Hardening (Conditional)
    if (hasModernApi) {
      try {
        if (tg.isVerticalSwipesEnabled) tg.disableVerticalSwipes();
      } catch (e) {
        console.warn("[Hardware_Protocol] Swipe control restricted.");
      }
    }

    // 3. Institutional Haptics
    if (!didInit.current) hapticFeedback("light");

    // 4. Kinetic Theme Sync (CSS Variables)
    const theme = tg.themeParams;
    const root = document.documentElement;
    const themeMap = {
      '--tg-bg': theme.bg_color || '#000000',
      '--tg-text': theme.text_color || '#ffffff',
      '--tg-link': isStaffFlavor ? '#f59e0b' : (theme.link_color || '#10b981'),
      '--tg-primary': isStaffFlavor ? '#f59e0b' : (theme.button_color || '#10b981'),
      '--tg-secondary-bg': theme.secondary_bg_color || '#0a0a0a',
    };

    Object.entries(themeMap).forEach(([key, value]) => root.style.setProperty(key, value));

    // 5. Native Header Protocol (Conditional)
    // This previously crashed Legacy v6.0 clients, triggering the reload loop.
    if (hasModernApi) {
      try {
        const headerHex = isStaffFlavor ? "#0f0f0f" : (theme.secondary_bg_color || "#0a0a0a");
        tg.setHeaderColor(headerHex);
        tg.setBackgroundColor(theme.bg_color || "#000000");
      } catch (e) {
        console.warn("[Hardware_Protocol] Native color sync failed.");
      }
    }

    didInit.current = true;
    setIsReady(true);
    return true;
  }, [isStaffFlavor, pathname]);

  // 🔥 EFFECT 1: Multi-Shot Hardware Discovery
  useEffect(() => {
    if (didInit.current) return;
    if (initTMA()) return;

    intervalRef.current = setInterval(() => {
      if (initTMA()) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 150); 

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [initTMA]);

  // 🔥 EFFECT 2: Live Flavor Sync
  useEffect(() => {
    if (didInit.current && pathname !== "/dashboard/login") initTMA(true); 
  }, [isStaffFlavor, pathname, initTMA]);

  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      <div className={cn(
        "min-h-[100dvh] w-full flex flex-col transition-opacity duration-700 ease-in-out antialiased",
        isReady ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {children}
      </div>
    </>
  );
}
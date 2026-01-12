"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ APP CLIENT PROVIDER (Apex Tier)
 * Hardened: Version-Aware initialization to prevent Legacy SDK (6.0) crashes.
 * Optimized: Terminate-on-Login protocol with searchParam reason detection.
 */
export function AppClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { flavor } = useLayout();
  const isStaffFlavor = flavor === "AMBER";
  
  // 🛡️ THE ANCHOR: Prevents the "Initialization Storm" re-renders
  const didInit = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initTMA = useCallback((force = false) => {
    // 🛡️ THE TERMINATOR: Stand down if at the gate or if a redirect reason exists.
    // This allows the Login page to mount cleanly without hardware interference.
    const isAtGate = pathname === "/dashboard/login" || searchParams.has('reason');
    
    if (isAtGate || typeof window === "undefined") {
      setIsReady(true);
      didInit.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return true;
    }

    if (!window.Telegram?.WebApp) return false;
    if (didInit.current && !force) return true;

    const tg = window.Telegram.WebApp;

    // 1. Universal Hardware Handshake
    tg.ready();
    tg.expand();
    
    // 🛡️ VERSION GATE (Critical Stability Fix for v6.0 Crashes)
    const isVersionAtLeast = (ver: string) => {
      try {
        const current = tg.version.split('.').map(Number);
        const target = ver.split('.').map(Number);
        for (let i = 0; i < Math.max(current.length, target.length); i++) {
          if ((current[i] || 0) > (target[i] || 0)) return true;
          if ((current[i] || 0) < (target[i] || 0)) return false;
        }
        return true;
      } catch (e) { return false; }
    };

    const hasModernApi = isVersionAtLeast("6.1");

    // 2. Viewport Hardening (6.1+)
    if (hasModernApi) {
      try {
        if (tg.isVerticalSwipesEnabled) tg.disableVerticalSwipes();
      } catch (e) {
        console.warn("[Hardware_Protocol] Swipe lock unsupported on this node.");
      }
    }

    // 3. Institutional Haptics
    if (!didInit.current) hapticFeedback("light");

    // 4. Kinetic Theme Sync (Injecting Telegram CSS Variables)
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

    // 5. Native Header Protocol (6.1+)
    // 🚀 FIXED: This block was crashing v6.0 clients in your logs.
    if (hasModernApi) {
      try {
        const headerHex = isStaffFlavor ? "#0f0f0f" : (theme.secondary_bg_color || "#0a0a0a");
        tg.setHeaderColor(headerHex);
        tg.setBackgroundColor(theme.bg_color || "#000000");
      } catch (e) {
        console.warn("[Hardware_Protocol] Native color-sync failed on legacy node.");
      }
    }

    didInit.current = true;
    setIsReady(true);
    return true;
  }, [isStaffFlavor, pathname, searchParams]);

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

  // 🔥 EFFECT 2: Live Flavor/Theme Sync
  useEffect(() => {
    if (didInit.current && pathname !== "/dashboard/login") {
      initTMA(true); 
    }
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
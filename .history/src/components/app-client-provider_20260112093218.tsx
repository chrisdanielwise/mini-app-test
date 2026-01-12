"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ APP CLIENT PROVIDER (Apex Tier)
 * Hardened: Context-Safe version-aware handshake for Legacy v6.0 support.
 * Optimized: Passive stand-down for Middleware/Proxy redirect reasons.
 */
export function AppClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 🛡️ SAFE CONTEXT CONSUMPTION
  // This now works because LayoutProvider is the parent in RootLayout
  const { flavor } = useLayout();
  const isStaffFlavor = flavor === "AMBER";
  
  const didInit = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initTMA = useCallback((force = false) => {
    // 🛡️ THE TERMINATOR: Stand down at login gate to prevent 302 storms
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
    tg.ready();
    tg.expand();
    
    // 🛡️ LEGACY GUARD (v6.0 Stability)
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

    // 1. Hardware Hardening
    if (hasModernApi) {
      try {
        if (tg.isVerticalSwipesEnabled) tg.disableVerticalSwipes();
      } catch (e) { console.warn("Swipe control restricted."); }
    }

    if (!didInit.current) hapticFeedback("light");

    // 2. Kinetic Theme Sync (CSS Injection)
    const theme = tg.themeParams;
    const root = document.documentElement;
    const themeMap = {
      '--tg-bg': theme.bg_color || '#000000',
      '--tg-text': theme.text_color || '#ffffff',
      '--tg-link': isStaffFlavor ? '#f59e0b' : (theme.link_color || '#10b981'),
      '--tg-primary': isStaffFlavor ? '#f59e0b' : (theme.button_color || '#10b981'),
      '--tg-secondary-bg': theme.secondary_bg_color || '#0a0a0a',
    };

    Object.entries(themeMap).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 3. Native UI Protocol (v6.1+)
    if (hasModernApi) {
      try {
        const headerHex = isStaffFlavor ? "#0f0f0f" : (theme.secondary_bg_color || "#0a0a0a");
        tg.setHeaderColor(headerHex);
        tg.setBackgroundColor(theme.bg_color || "#000000");
      } catch (e) { console.warn("Native UI sync restricted."); }
    }

    didInit.current = true;
    setIsReady(true);
    return true;
  }, [isStaffFlavor, pathname, searchParams]);

  useEffect(() => {
    if (didInit.current) return;
    if (initTMA()) return;

    intervalRef.current = setInterval(() => {
      if (initTMA()) clearInterval(intervalRef.current!);
    }, 150); 

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [initTMA]);

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
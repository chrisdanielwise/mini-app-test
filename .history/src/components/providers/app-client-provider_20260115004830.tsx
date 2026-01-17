"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 APP_CLIENT_PROVIDER (v16.16.12)
 * Logic: Hardware-Handshake with Adaptive Legacy Support.
 * Design: Kinetic Opacity Ingress with CSS-Variable Injection.
 */
export function AppClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { impact } = useHaptics();
  
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";
  
  const didInit = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initTMA = useCallback((force = false) => {
    // 🛡️ THE TERMINATOR: Prevent redirect loops at login or middleware gates
    const isAtGate = pathname.includes("/login") || searchParams.has('reason');
    
    if (isAtGate || typeof window === "undefined") {
      setIsReady(true);
      didInit.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return true;
    }

    if (!window.Telegram?.WebApp) return false;
    if (didInit.current && !force) return true;

    const tg = window.Telegram.WebApp;
    
    // 🏛️ TELEGRAM HANDSHAKE PROTOCOL
    tg.ready();
    tg.expand();
    
    // 🛡️ VERSION-AWARE CAPABILITY CHECK
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

    const hasV61 = isVersionAtLeast("6.1");

    // 1. Hardware Stabilization
    if (hasV61) {
      try {
        if (tg.isVerticalSwipesEnabled) tg.disableVerticalSwipes();
        // Locks the app into a "Hardware Shell" feel
        tg.enableClosingConfirmation(); 
      } catch (e) { console.warn("🛰️ [Hardware_Control] Restricted."); }
    }

    if (!didInit.current) impact("light");

    // 2. CSS Variable Bridge (Syncing Native to Institutional)
    const theme = tg.themeParams;
    const root = document.documentElement;
    
    const themeMap = {
      '--tg-bg': theme.bg_color || '#000000',
      '--tg-secondary-bg': theme.secondary_bg_color || '#0a0a0a',
      '--tg-text': theme.text_color || '#ffffff',
      '--tg-accent': isStaff ? '#f59e0b' : (theme.button_color || '#10b981'),
    };

    Object.entries(themeMap).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 3. Native UI Recalibration
    if (hasV61) {
      try {
        const headerHex = isStaff ? "#0f0f0f" : (theme.secondary_bg_color || "#0a0a0a");
        tg.setHeaderColor(headerHex);
        tg.setBackgroundColor(theme.bg_color || "#000000");
      } catch (e) { console.warn("🛰️ [UI_Sync] Restricted."); }
    }

    didInit.current = true;
    setIsReady(true);
    return true;
  }, [isStaff, pathname, searchParams, impact]);

  useEffect(() => {
    if (didInit.current) return;
    
    // Attempt Immediate Handshake
    if (initTMA()) return;

    // Fallback: Interval Polling for Script Injection
    intervalRef.current = setInterval(() => {
      if (initTMA()) clearInterval(intervalRef.current!);
    }, 150); 

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [initTMA]);

  // Handle Route Shifts & Flavor Changes
  useEffect(() => {
    if (didInit.current) {
      initTMA(true); 
    }
  }, [isStaff, pathname, initTMA]);

  return (
    <>
      <Script 
        src="https://telegram.org/js/telegram-web-app.js" 
        strategy="beforeInteractive" 
      />
      <div className={cn(
        "min-h-[100dvh] w-full flex flex-col transition-all duration-1000 ease-[var(--ease-institutional)] antialiased",
        isReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {children}
      </div>
    </>
  );
}
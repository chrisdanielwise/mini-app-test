"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 APP_CLIENT_PROVIDER (Institutional Apex v16.16.30)
 * Priority: Hardware-Handshake with Morphology-Aware Ingress.
 * Logic: Synchronizing Telegram Native Physics with Apex Device State.
 */
export function AppClientProvider({ children }: { children: React.ReactNode }) {
  const [isClientReady, setIsClientReady] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { impact } = useHaptics();
  const { flavor } = useLayout();
  
  // 🛰️ DEVICE INGRESS: Consuming full morphology physics
  const { 
    isReady: isDeviceReady, 
    viewportHeight, 
    isMobile,
    isPortrait,
    screenSize 
  } = useDeviceContext();

  const isStaff = flavor === "AMBER";
  const didInit = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 🪜 TELEGRAM HANDSHAKE PROTOCOL
   * Logic: Version-aware capability injection.
   */
  const initTMA = useCallback((force = false) => {
    const isAtGate = pathname.includes("/login") || searchParams.has('reason');
    
    if (isAtGate || typeof window === "undefined") {
      setIsClientReady(true);
      didInit.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return true;
    }

    if (!window.Telegram?.WebApp) return false;
    if (didInit.current && !force) return true;

    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
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

    // 1. Hardware Control Sync
    if (hasV61) {
      try {
        if (tg.isVerticalSwipesEnabled) tg.disableVerticalSwipes();
        tg.enableClosingConfirmation(); 
      } catch (e) { console.warn("🛰️ [Hardware_Control] Restricted."); }
    }

    if (!didInit.current) impact("light");

    // 2. Apex Variable Bridge
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

    // 3. Native Chrome Recalibration
    if (hasV61) {
      try {
        const headerHex = isStaff ? "#0f0f0f" : (theme.secondary_bg_color || "#0a0a0a");
        tg.setHeaderColor(headerHex);
        tg.setBackgroundColor(theme.bg_color || "#000000");
      } catch (e) { console.warn("🛰️ [UI_Sync] Restricted."); }
    }

    didInit.current = true;
    setIsClientReady(true);
    return true;
  }, [isStaff, pathname, searchParams, impact]);

  // Handle Polling and Initial Mount
  useEffect(() => {
    if (didInit.current) return;
    if (initTMA()) return;

    intervalRef.current = setInterval(() => {
      if (initTMA()) clearInterval(intervalRef.current!);
    }, 150); 

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [initTMA]);

  // Handle Route Shifts
  useEffect(() => {
    if (didInit.current) initTMA(true); 
  }, [isStaff, pathname, initTMA]);

  // 🛡️ MASTER INGRESS CONDITION: Waits for both SDK and Device Calibration
  const isFullyStabilized = isClientReady && isDeviceReady;

  return (
    <>
      <Script 
        src="https://telegram.org/js/telegram-web-app.js" 
        strategy="beforeInteractive" 
      />
      <div 
        className={cn(
          "w-full flex flex-col antialiased",
          "transition-all duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]", // 🌊 Water-Ease
          isFullyStabilized 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8 pointer-events-none"
        )}
        style={{ 
          minHeight: `calc(var(--vh, 1vh) * 100)`,
          // Scale entrance based on screen size
          transform: !isFullyStabilized ? `translateY(${isMobile ? '2rem' : '4rem'})` : 'none'
        }}
      >
        {children}
      </div>
    </>
  );
}
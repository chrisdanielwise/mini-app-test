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
  
  const didInit = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initTMA = useCallback((force = false) => {
    // 🛡️ THE TERMINATOR: Stop all background checks if at the gate
    if (pathname === "/dashboard/login") {
      setIsReady(true);
      didInit.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return true;
    }

    if (typeof window === "undefined" || !window.Telegram?.WebApp) return false;
    if (didInit.current && !force) return true;

    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    try {
      if (tg.isVerticalSwipesEnabled) tg.disableVerticalSwipes();
    } catch (e) {
      console.warn("[Hardware_Protocol] Swipe control restricted.");
    }

    if (!didInit.current) hapticFeedback("light");

    // 🎨 KINETIC THEME SYNC
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

    const headerHex = isStaffFlavor ? "#0f0f0f" : (theme.secondary_bg_color || "#0a0a0a");
    tg.setHeaderColor(headerHex);
    tg.setBackgroundColor(theme.bg_color || "#000000");

    didInit.current = true;
    setIsReady(true);
    return true;
  }, [isStaffFlavor, pathname]);

  useEffect(() => {
    if (didInit.current) return;
    if (initTMA()) return;

    intervalRef.current = setInterval(() => {
      if (initTMA()) clearInterval(intervalRef.current!);
    }, 150); 

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [initTMA]);

  useEffect(() => {
    if (didInit.current && pathname !== "/dashboard/login") initTMA(true); 
  }, [isStaffFlavor, pathname, initTMA]);

  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      <div className={cn(
        "min-h-[100dvh] w-full flex flex-col transition-opacity duration-700 ease-in-out",
        isReady ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {children}
      </div>
    </>
  );
}
"use client";

import * as React from 'react';

// Institutional 2026 Breakpoints
const MOBILE_BREAKPOINT = 768;

/**
 * 🛰️ ENVIRONMENT SENSOR (v16.16.0)
 * Logic: Hardened against Hydration Mismatches & TMA Platform Ghosting.
 * Feature: Distinguishes between Physical Width and Telegram Platform.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [platform, setPlatform] = React.useState<"mobile" | "desktop" | "web" | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // 🛡️ SSR GUARD: Only executes in browser
    if (typeof window === "undefined") return;

    // 1. Physical Screen Detection
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // 2. Telegram Platform Detection (v8.0+ Logic)
    const tg = (window as any).Telegram?.WebApp;
    const tgPlatform = tg?.platform || "web"; // ios, android, desktop, or web

    const updateState = () => {
      setIsMobile(mql.matches);
      setPlatform(tgPlatform);
      setIsReady(true);
    };
    
    // Initial sync after hydration to prevent 2026 Next.js flicker
    updateState();

    mql.addEventListener('change', updateState);
    return () => mql.removeEventListener('change', updateState);
  }, []);

  /**
   * 🏛️ INSTITUTIONAL RETURN
   * Returns false during server render to prevent hydration mismatches.
   */
  return {
    isMobile: isReady ? isMobile : false,
    // True if the user is actually inside the native Telegram Mobile app
    isNativeMobile: isReady ? (platform === "ios" || platform === "android") : false,
    isDesktopTerminal: isReady ? platform === "desktop" : false,
    isReady
  };
}
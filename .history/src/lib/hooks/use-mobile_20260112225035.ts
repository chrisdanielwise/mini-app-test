\"use client";

import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * 🛰️ ENVIRONMENT SENSOR (v10.7.1)
 * Hardened: Prevents layout flickering in Telegram Desktop vs Mobile.
 * Optimization: Uses matchMedia for hardware-accelerated detection.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useLayoutEffect(() => {
    // 🛡️ SSR GUARD: Standard Next.js Client-Only check
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const updateState = () => setIsMobile(mql.matches);
    
    // ⚡ Initial Sync
    updateState();
    setIsReady(true);

    mql.addEventListener('change', updateState);
    return () => mql.removeEventListener('change', updateState);
  }, []);

  // Return false during server render to prevent hydration mismatches
  return isReady ? isMobile : false;
}
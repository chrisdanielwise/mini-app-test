"use client";

import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * 🛰️ ENVIRONMENT SENSOR: useIsMobile (Apex Tier)
 * Updated: Explicitly handles the SSR-to-Client transition.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false); // Default to desktop-first
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const onChange = () => setIsMobile(mql.matches);
    
    // Set initial state and mark as hydrated
    setIsMobile(mql.matches);
    setIsHydrated(true);

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // 🛡️ Returns false during SSR, then the actual value once client-ready
  return isHydrated ? isMobile : false;
}
"use client";

import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * 🛰️ ENVIRONMENT SENSOR: useIsMobile (Apex Tier)
 * Real-time viewport telemetry for adaptive layout orchestration.
 * Hardened against Next.js hydration flickering.
 */
export function useIsMobile() {
  // 🏁 INITIALIZATION: Default to undefined to detect 'Server' vs 'Client'
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // 📡 TELEMETRY NODE: Define the media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const onChange = () => {
      setIsMobile(mql.matches);
    };

    // Initialize state on mount
    setIsMobile(mql.matches);

    // High-performance listener for viewport scaling
    mql.addEventListener('change', onChange);
    
    return () => mql.removeEventListener('change', onChange);
  }, []);

  /**
   * 🛡️ HYDRATION GUARD
   * Returns 'false' during SSR and initial hydration to prevent 
   * mismatched HTML, then snaps to the correct telemetry value.
   */
  return isMobile ?? false;
}
"use client";

import { useState, useLayoutEffect, useCallback, useRef } from "react";

const BREAKPOINTS = {
  md: 768,
  lg: 1024,
};

/**
 * 🛰️ FLUID ENVIRONMENT SENSOR (Institutional v16.16.12)
 * Logic: Optimized Atomic Handshake with CSS Variable Injection.
 * Performance: Memoized state updates to prevent cascading re-renders.
 */
export function useDeviceContext() {
  const [context, setContext] = useState({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isPortrait: true,
    safeArea: { top: 0, bottom: 0, left: 0, right: 0 },
    isReady: false,
  });

  // 🛡️ Persistence Ref to track changes without triggering re-renders
  const lastState = useRef("");

  const updateEnvironment = useCallback(() => {
    if (typeof window === "undefined") return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const tg = (window as any).Telegram?.WebApp;

    // 1. Fluid Detection
    const isMobile = w < BREAKPOINTS.md;
    const isTablet = w >= BREAKPOINTS.md && w < BREAKPOINTS.lg;
    const isDesktop = w >= BREAKPOINTS.lg;
    const isPortrait = h > w;
    const safeArea = tg?.safeAreaInset || { top: 0, bottom: 0, left: 0, right: 0 };

    // 2. 🚀 Institutional Performance: Atomic State Comparison
    const currentStateKey = `${isMobile}-${isTablet}-${isDesktop}-${isPortrait}-${safeArea.top}`;
    if (lastState.current === currentStateKey) return;
    lastState.current = currentStateKey;

    // 3. 🏛️ CSS Variable Injection (v9.9.1 Hardened)
    // Allows CSS to use var(--tg-viewport-h) for frame-perfect layouts.
    const doc = document.documentElement;
    doc.style.setProperty("--tg-viewport-h", `${tg?.viewportHeight || h}px`);
    doc.style.setProperty("--tg-safe-top", `${safeArea.top}px`);
    doc.style.setProperty("--tg-safe-bottom", `${safeArea.bottom}px`);

    setContext({
      isMobile,
      isTablet,
      isDesktop,
      isPortrait,
      safeArea,
      isReady: true,
    });
  }, []);

  useLayoutEffect(() => {
    updateEnvironment();

    // Debounced Resize Observer for high-density displays
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(updateEnvironment);
    });

    resizeObserver.observe(document.body);
    
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.onEvent("viewportChanged", updateEnvironment);
      tg.onEvent("safeAreaChanged", updateEnvironment);
    }

    return () => {
      resizeObserver.disconnect();
      if (tg) {
        tg.offEvent("viewportChanged", updateEnvironment);
        tg.offEvent("safeAreaChanged", updateEnvironment);
      }
    };
  }, [updateEnvironment]);

  return context;
}
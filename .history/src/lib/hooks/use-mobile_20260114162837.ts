"use client";

import { useState, useLayoutEffect, useEffect } from "react";

// 🏛️ Institutional Breakpoints
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * 🛰️ FLUID ENVIRONMENT SENSOR (v16.16.5)
 * Logic: Combines CSS MatchMedia with TMA v8.0 Viewport API.
 * Feature: Real-time Safe Area & Keyboard detection.
 */
export function useDeviceContext() {
  const [context, setContext] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isPortrait: true,
    // 🛡️ TMA Native Insets (v8.0+)
    safeArea: { top: 0, bottom: 0, left: 0, right: 0 },
    viewportHeight: 0,
    isExpanded: false,
    platform: "web",
    isReady: false,
  });

  const updateContext = () => {
    if (typeof window === "undefined") return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const tg = (window as any).Telegram?.WebApp;

    // 1. Fluid Size Detection
    const isMobile = w < BREAKPOINTS.md;
    const isTablet = w >= BREAKPOINTS.md && w < BREAKPOINTS.lg;
    const isDesktop = w >= BREAKPOINTS.lg;
    const isPortrait = h > w;

    // 2. Safe Area Retrieval (TMA v8.0+)
    const safeArea = tg?.safeAreaInset || { top: 0, bottom: 0, left: 0, right: 0 };

    setContext({
      isMobile,
      isTablet,
      isDesktop,
      isPortrait,
      safeArea,
      viewportHeight: tg?.viewportHeight || h,
      isExpanded: tg?.isExpanded || false,
      platform: tg?.platform || "web",
      isReady: true,
    });
  };

  // ⚡ Sync on mount and resize
  useLayoutEffect(() => {
    updateContext();
    window.addEventListener("resize", updateContext);
    
    // 🚀 TMA Viewport Events
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.onEvent("viewportChanged", updateContext);
    }

    return () => {
      window.removeEventListener("resize", updateContext);
      if (tg) tg.offEvent("viewportChanged", updateContext);
    };
  }, []);

  return context;
}
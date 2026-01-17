"use client";

import React, { 
  createContext, 
  useContext, 
  useState, 
  useLayoutEffect, 
  useCallback, 
  useMemo, 
  useRef 
} from "react";

// 🏛️ INSTITUTIONAL BREAKPOINTS (v9.5.0)
const BREAKPOINTS = {
  md: 768,
  lg: 1024,
};

interface DeviceContextValue {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  safeArea: { top: number; bottom: number; left: number; right: number };
  viewportHeight: number;
  isReady: boolean;
}

const DeviceContext = createContext<DeviceContextValue | null>(null);

/**
 * 🛰️ DEVICE PROVIDER (v16.16.12)
 * Logic: Atomic Viewport Handshake & CSS Variable Injection.
 * Standards: v9.5.8 Fluidity, v9.4.4 Security.
 */
export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DeviceContextValue>({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isPortrait: true,
    safeArea: { top: 0, bottom: 0, left: 0, right: 0 },
    viewportHeight: 0,
    isReady: false,
  });

  const lastStateKey = useRef("");

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
    const viewportHeight = tg?.viewportHeight || h;

    // 2. 🚀 ATOMIC GUARD: Prevents re-renders if size hasn't crossed a breakpoint
    const currentStateKey = `${isMobile}-${isTablet}-${isDesktop}-${isPortrait}-${viewportHeight}`;
    if (lastStateKey.current === currentStateKey) return;
    lastStateKey.current = currentStateKey;

    // 3. 🏛️ CSS VARIABLE INJECTION (v9.9.1 Hardened)
    const doc = document.documentElement;
    doc.style.setProperty("--tg-viewport-h", `${viewportHeight}px`);
    doc.style.setProperty("--tg-safe-top", `${safeArea.top}px`);
    doc.style.setProperty("--tg-safe-bottom", `${safeArea.bottom}px`);

    setState({
      isMobile,
      isTablet,
      isDesktop,
      isPortrait,
      safeArea,
      viewportHeight,
      isReady: true,
    });
  }, []);

  useLayoutEffect(() => {
    updateEnvironment();

    // Debounced Observer for High-Performance Terminals
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

  return (
    <DeviceContext.Provider value={state}>
      {children}
    </DeviceContext.Provider>
  );
}

/**
 * 🛰️ useDeviceContext Hook (Merged Utility)
 */
export const useDeviceContext = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDeviceContext must be used within a DeviceProvider");
  }
  return context;
};
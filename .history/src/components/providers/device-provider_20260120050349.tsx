"use client";

import React, {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
  memo,
} from "react";

const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  isPortrait: boolean;
  safeArea: { top: number; bottom: number; left: number; right: number };
  viewportHeight: number;
  viewportWidth: number;
  isReady: boolean;
}

const DeviceContext = createContext<DeviceState | null>(null);

/**
 * 🛰️ DEVICE_PROVIDER
 * Strategy: Event-Driven Hydration & Forced Delay Check.
 * Mission: Eliminates "Zero-Inch" SafeAreas and "Expected UserRole" UI layout shifts.
 */
export const DeviceProvider = memo(
  ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<DeviceState>({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      screenSize: "xs",
      isPortrait: true,
      safeArea: { top: 0, bottom: 0, left: 0, right: 0 },
      viewportHeight: 0,
      viewportWidth: 0,
      isReady: false,
    });

    const lastKey = useRef("");

    const updateEnvironment = useCallback(() => {
      if (typeof window === "undefined") return;

      const tg = (window as any).Telegram?.WebApp;

      // 🛡️ HARDWARE SNAP: Snapshot physical dimensions
      const w = window.innerWidth;
      const vh = tg?.viewportHeight || window.innerHeight;

      let screenSize: DeviceState["screenSize"] = "xs";
      if (w >= BREAKPOINTS.xxl) screenSize = "xxl";
      else if (w >= BREAKPOINTS.lg) screenSize = "lg";
      else if (w >= BREAKPOINTS.md) screenSize = "md";
      else if (w >= BREAKPOINTS.sm) screenSize = "sm";

      const isMobile = w < BREAKPOINTS.md;
      const isPortrait = vh > w;

      // 🛰️ TMA SAFE-AREA INGRESS: Resolve hardware offsets
      const safeArea = {
        top: tg?.safeAreaInset?.top ?? 0,
        bottom: tg?.safeAreaInset?.bottom ?? 0,
        left: tg?.safeAreaInset?.left ?? 0,
        right: tg?.safeAreaInset?.right ?? 0,
      };

      const currentKey = `${screenSize}-${isPortrait}-${vh}-${safeArea.top}`;
      if (lastKey.current === currentKey) return;
      lastKey.current = currentKey;

      // 🌊 CSS VARIABLE INJECTION: Low-level UI anchor synchronization
      const doc = document.documentElement;
      doc.style.setProperty("--vh", `${vh * 0.01}px`);
      doc.style.setProperty("--tg-viewport-height", `${vh}px`);
      doc.style.setProperty("--tg-safe-top", `${safeArea.top}px`);
      doc.style.setProperty("--tg-safe-bottom", `${safeArea.bottom}px`);

      // 🚩 BASELINE_PROTOCOL: Sheet Close button & scrolling math
      if (!doc.style.getPropertyValue("--emergency-offset")) {
        doc.style.setProperty("--emergency-offset", "0px");
      }

      setState({
        isMobile,
        isTablet: w >= BREAKPOINTS.md && w < BREAKPOINTS.lg,
        isDesktop: w >= BREAKPOINTS.lg,
        screenSize,
        isPortrait,
        safeArea,
        viewportHeight: vh,
        viewportWidth: w,
        isReady: true,
      });
    }, []);

    useLayoutEffect(() => {
      updateEnvironment();

      const tg = (window as any).Telegram?.WebApp;

      if (tg) {
        tg.ready();
        tg.expand();

        // Listen for hardware-level signals
        tg.onEvent("viewportChanged", updateEnvironment);
        tg.onEvent("safeAreaChanged", updateEnvironment);
      }

      // 🏁 RACE_CONDITION_GUARD: Forced re-check for iOS/MacBook window drift
      const timer = setTimeout(updateEnvironment, 400);

      window.addEventListener("resize", updateEnvironment);

      return () => {
        window.removeEventListener("resize", updateEnvironment);
        clearTimeout(timer);
        if (tg) {
          tg.offEvent("viewportChanged", updateEnvironment);
          tg.offEvent("safeAreaChanged", updateEnvironment);
        }
      };
    }, [updateEnvironment]);

    return (
      <DeviceContext.Provider value={state}>{children}</DeviceContext.Provider>
    );
  }
);

export function useDeviceContext() {
  const context = useContext(DeviceContext);
  if (!context) throw new Error("useDevice missing DeviceProvider");
  return context;
}
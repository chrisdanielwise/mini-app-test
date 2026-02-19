"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect, // ✅ Swapped from useLayoutEffect for SSR stability
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
 * 🛰️ DEVICE_PROVIDER (v2026.1.14)
 * Strategy: Hydration Shielding & Fail-Safe Defaults.
 * Fix: Prevents "window is undefined" crashes during Render build/prerender.
 */
export const DeviceProvider = memo(
  ({ children }: { children: React.ReactNode }) => {
    // 🛡️ INITIAL_STATE: Safe for Server-Side Rendering
    const [state, setState] = useState<DeviceState>({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      screenSize: "xs",
      isPortrait: true,
      safeArea: { top: 0, bottom: 0, left: 0, right: 0 },
      viewportHeight: 0,
      viewportWidth: 0,
      isReady: false, // Remains false until client-side mount
    });

    const [mounted, setMounted] = useState(false);
    const lastKey = useRef("");

    const updateEnvironment = useCallback(() => {
      // 🧱 BUILD_SHIELD: Exit if not in browser
      if (typeof window === "undefined") return;

      const tg = (window as any).Telegram?.WebApp;
      const w = window.innerWidth;
      const vh = tg?.viewportHeight || window.innerHeight;

      let screenSize: DeviceState["screenSize"] = "xs";
      if (w >= BREAKPOINTS.xxl) screenSize = "xxl";
      else if (w >= BREAKPOINTS.lg) screenSize = "lg";
      else if (w >= BREAKPOINTS.md) screenSize = "md";
      else if (w >= BREAKPOINTS.sm) screenSize = "sm";

      const isMobile = w < BREAKPOINTS.md;
      const isPortrait = vh > w;

      const safeArea = {
        top: tg?.safeAreaInset?.top ?? 0,
        bottom: tg?.safeAreaInset?.bottom ?? 0,
        left: tg?.safeAreaInset?.left ?? 0,
        right: tg?.safeAreaInset?.right ?? 0,
      };

      const currentKey = `${screenSize}-${isPortrait}-${vh}-${safeArea.top}`;
      if (lastKey.current === currentKey) return;
      lastKey.current = currentKey;

      // 🌊 CSS VARIABLE INJECTION
      const doc = document.documentElement;
      doc.style.setProperty("--vh", `${vh * 0.01}px`);
      doc.style.setProperty("--tg-viewport-height", `${vh}px`);
      doc.style.setProperty("--tg-safe-top", `${safeArea.top}px`);
      doc.style.setProperty("--tg-safe-bottom", `${safeArea.bottom}px`);

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

    useEffect(() => {
      setMounted(true);
      updateEnvironment();

      const tg = (window as any).Telegram?.WebApp;

      if (tg) {
        tg.ready();
        tg.expand();
        tg.onEvent("viewportChanged", updateEnvironment);
        tg.onEvent("safeAreaChanged", updateEnvironment);
      }

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
      <DeviceContext.Provider value={state}>
        {/* 🛡️ Only render children if mounted to prevent context mismatch during build */}
        {mounted ? children : <div className="bg-black min-h-screen" />}
      </DeviceContext.Provider>
    );
  }
);

export function useDeviceContext() {
  const context = useContext(DeviceContext);
  // During build, this might be null. Return a safe partial if needed.
  return context || { isReady: false, safeArea: { top: 0, bottom: 0, left: 0, right: 0 } } as DeviceState;
}
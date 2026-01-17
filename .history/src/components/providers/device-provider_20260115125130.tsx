"use client";

import React, { 
  createContext, 
  useContext, 
  useState, 
  useLayoutEffect, 
  useCallback, 
  useRef, 
  memo 
} from "react";

/**
 * 🏛️ 2026 INSTITUTIONAL BREAKPOINTS (v16.16.29)
 * Standard: Fluid Interpolation across all morphology tiers.
 */
const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

interface DeviceState {
  isMobile: boolean;      // < 768px
  isTablet: boolean;      // 768px - 1024px
  isDesktop: boolean;     // > 1024px
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  isPortrait: boolean;
  safeArea: { top: number; bottom: number; left: number; right: number };
  viewportHeight: number;
  viewportWidth: number;
  isReady: boolean;
}

const DeviceContext = createContext<DeviceState | null>(null);

/**
 * 🛰️ DEVICE_PROVIDER_TERMINAL (Institutional Apex v16.16.29)
 * Logic: Kinetic Viewport Sync with Subsurface Variable Injection.
 * Performance: Optimized requestAnimationFrame for 120Hz TMA Hardware.
 */
export const DeviceProvider = memo(({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<DeviceState>({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    screenSize: 'xs',
    isPortrait: true,
    safeArea: { top: 0, bottom: 0, left: 0, right: 0 },
    viewportHeight: 0,
    viewportWidth: 0,
    isReady: false,
  });

  const lastKey = useRef("");

  const updateEnvironment = useCallback(() => {
    if (typeof window === "undefined") return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const tg = (window as any).Telegram?.WebApp;

    // 🕵️ MORPHOLOGY RESOLUTION
    let screenSize: DeviceState['screenSize'] = 'xs';
    if (w >= BREAKPOINTS.xxl) screenSize = 'xxl';
    else if (w >= BREAKPOINTS.xl) screenSize = 'xl';
    else if (w >= BREAKPOINTS.lg) screenSize = 'lg';
    else if (w >= BREAKPOINTS.md) screenSize = 'md';
    else if (w >= BREAKPOINTS.sm) screenSize = 'sm';

    const isMobile = w < BREAKPOINTS.md;
    const isTablet = w >= BREAKPOINTS.md && w < BREAKPOINTS.lg;
    const isDesktop = w >= BREAKPOINTS.lg;
    const isPortrait = h > w;
    
    // 🛡️ TMA SAFE-AREA INGRESS
    const safeArea = tg?.safeAreaInset || { top: 0, bottom: 0, left: 0, right: 0 };
    const vh = tg?.viewportHeight || h;

    // 🚀 ATOMIC GUARD: Prevents redundant re-renders unless a threshold is crossed
    const currentKey = `${screenSize}-${isPortrait}-${vh}-${safeArea.top}`;
    if (lastKey.current === currentKey) return;
    lastKey.current = currentKey;

    // 🌊 CSS VARIABLE INJECTION: The "Fluid Water" Engine
    const doc = document.documentElement;
    // Standardizing kinetic viewport units
    doc.style.setProperty("--vh", `${vh * 0.01}px`);
    doc.style.setProperty("--vw", `${w * 0.01}px`);
    // Injecting safe area variables for TMA notch-resiliency
    doc.style.setProperty("--tg-safe-top", `${safeArea.top}px`);
    doc.style.setProperty("--tg-safe-bottom", `${safeArea.bottom}px`);
    
    // 🎨 Fluid Scaling Factor: Interpolates typography and spacing
    const fluidBase = Math.min(Math.max(w / 100, 14), 20); 
    doc.style.setProperty("--fluid-base", `${fluidBase}px`);

    setState({
      isMobile,
      isTablet,
      isDesktop,
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

    // 🛰️ SIGNAL STABILIZER: requestAnimationFrame prevents layout thrashing
    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(updateEnvironment);
    });

    observer.observe(document.body);
    
    // 🏁 TELEGRAM MINI APP EVENT ORCHESTRATION
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.onEvent("viewportChanged", updateEnvironment);
      tg.onEvent("safeAreaChanged", updateEnvironment);
    }

    return () => {
      observer.disconnect();
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
});

/**
 * 🕵️ useDevice (Apex Export)
 * Hook used across all Tactical Components for morphology-awareness.
 */
export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) throw new Error("useDevice missing DeviceProvider");
  return context;
}
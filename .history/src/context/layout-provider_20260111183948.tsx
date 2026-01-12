"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { hapticFeedback } from "@/lib/telegram/webapp";

type NavMode = "SIDEBAR" | "TOPBAR" | "BOTTOM";
type ThemeFlavor = "EMERALD" | "AMBER" | "DEFAULT";

type LayoutContextType = {
  isFullSize: boolean;
  navMode: NavMode;
  flavor: ThemeFlavor;
  mounted: boolean; 
  toggleFullSize: (value: boolean) => void;
  setNavMode: (mode: NavMode) => void;
  setThemeFlavor: (flavor: ThemeFlavor) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  // 🛡️ INITIAL STATE: Must match the Server exactly to prevent hydration loops
  const [isFullSize, setIsFullSize] = useState(false);
  const [navMode, setNavModeState] = useState<NavMode>("SIDEBAR");
  const [flavor, setFlavor] = useState<ThemeFlavor>("DEFAULT");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 🛡️ BATCHED TELEGRAM RESTORATION
    // We do all localStorage reads in one go before updating state
    try {
      const savedSize = localStorage.getItem("zipha_full_size") === "true";
      const savedNav = localStorage.getItem("zipha_nav_mode") as NavMode;
      const savedFlavor = localStorage.getItem("zipha_theme_flavor") as ThemeFlavor;
      
      // Update states only if they differ from default to reduce render noise
      if (savedSize) setIsFullSize(true);
      if (savedNav && savedNav !== "SIDEBAR") setNavModeState(savedNav);
      if (savedFlavor && savedFlavor !== "DEFAULT") setFlavor(savedFlavor);
    } catch (err) {
      console.warn("[Layout_Sync] Telemetry node isolated.");
    } finally {
      // 🚩 The most important line: only set mounted to true ONCE
      setMounted(true);
    }
  }, []);

  const toggleFullSize = useCallback((value: boolean) => {
    setIsFullSize(value);
    localStorage.setItem("zipha_full_size", value.toString());
    hapticFeedback("light");
  }, []);

  const setNavMode = useCallback((mode: NavMode) => {
    setNavModeState(mode);
    localStorage.setItem("zipha_nav_mode", mode);
    hapticFeedback("medium");
  }, []);

  const setThemeFlavor = useCallback((newFlavor: ThemeFlavor) => {
    setFlavor(newFlavor);
    localStorage.setItem("zipha_theme_flavor", newFlavor);
  }, []);

  const contextValue = useMemo(() => ({
    isFullSize,
    navMode,
    flavor,
    mounted,
    toggleFullSize,
    setNavMode,
    setThemeFlavor
  }), [isFullSize, navMode, flavor, mounted, toggleFullSize, setNavMode, setThemeFlavor]);

  return (
    <LayoutContext.Provider value={contextValue}>
      {/* 🛡️ HYDRATION PROTECTION: 
          We use a stable div and only apply flavor classes if mounted.
          This prevents the "Flash of Unstyled Content" that triggers Next.js refreshes.
      */}
      <div 
        className={`
          min-h-[100dvh] w-full flex flex-col antialiased 
          selection:bg-primary/20 transition-colors duration-500
          ${mounted && flavor === "AMBER" ? "theme-staff" : ""}
          ${mounted && flavor === "EMERALD" ? "theme-merchant" : ""}
        `}
      >
        {children}
      </div>
    </LayoutContext.Provider>
  );
}

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutProvider");
  return context;
};
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

/**
 * 🛰️ LAYOUT ORCHESTRATOR
 * Optimized: Implements Hydration Guard to prevent infinite redirect loops.
 * Logic: Batches telemetry restoration to ensure single-pass hydration.
 */
export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [navMode, setNavModeState] = useState<NavMode>("SIDEBAR");
  const [flavor, setFlavor] = useState<ThemeFlavor>("DEFAULT");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 🛡️ BATCHED TELEGRAM RESTORATION
    // Executing all reads before state updates to prevent render jitter
    try {
      const savedSize = localStorage.getItem("zipha_full_size") === "true";
      const savedNav = localStorage.getItem("zipha_nav_mode") as NavMode;
      const savedFlavor = localStorage.getItem("zipha_theme_flavor") as ThemeFlavor;
      
      if (savedSize) setIsFullSize(true);
      if (savedNav && savedNav !== "SIDEBAR") setNavModeState(savedNav);
      if (savedFlavor && savedFlavor !== "DEFAULT") setFlavor(savedFlavor);
    } catch (err) {
      console.warn("[Layout_Sync] Telemetry node isolated.");
    } finally {
      // 🚩 The kill-switch for loops: Signal that client is ready
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
      <div 
        className={`
          min-h-[100dvh] w-full flex flex-col antialiased 
          selection:bg-primary/20 transition-colors duration-500
          ${mounted && flavor === "AMBER" ? "theme-staff" : ""}
          ${mounted && flavor === "EMERALD" ? "theme-merchant" : ""}
        `}
      >
        {/* 🛡️ HYDRATION GUARD
            If not mounted, we render nothing (or a shell) to prevent 
            child hooks from triggering redirects during the hydration gap.
        */}
        {mounted ? children : (
          <div className="flex-1 bg-background animate-pulse" />
        )}
      </div>
    </LayoutContext.Provider>
  );
}

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutProvider");
  return context;
};
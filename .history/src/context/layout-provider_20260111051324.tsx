"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { hapticFeedback } from "@/lib/telegram/webapp";

type NavMode = "SIDEBAR" | "TOPBAR" | "BOTTOM";

type LayoutContextType = {
  isFullSize: boolean;
  navMode: NavMode;
  mounted: boolean; 
  toggleFullSize: (value: boolean) => void;
  setNavMode: (mode: NavMode) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

/**
 * 🛰️ LAYOUT ORCHESTRATOR (Apex Tier)
 * Normalized: Strict hydration barrier and persistent viewport calibration.
 * Optimized: Adaptive haptics and institutional state persistence for Merchant viewports.
 */
export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [navMode, setNavModeState] = useState<NavMode>("SIDEBAR");
  const [mounted, setMounted] = useState(false);

  // 🏁 SYNCHRONIZATION: Restore telemetry from local node storage
  useEffect(() => {
    try {
      const savedSize = localStorage.getItem("zipha_full_size") === "true";
      const savedNav = localStorage.getItem("zipha_nav_mode") as NavMode;
      
      if (savedSize !== null) setIsFullSize(savedSize);
      if (savedNav) setNavModeState(savedNav);
    } catch (err) {
      console.warn("[Layout_Sync] Local telemetry access restricted.");
    } finally {
      setMounted(true);
    }
  }, []);

  const toggleFullSize = useCallback((value: boolean) => {
    setIsFullSize(value);
    localStorage.setItem("zipha_full_size", value.toString());
    
    // ⚡ TACTILE HANDSHAKE: Confirmation of geometric expansion
    hapticFeedback("light");
  }, []);

  const setNavMode = useCallback((mode: NavMode) => {
    setNavModeState(mode);
    localStorage.setItem("zipha_nav_mode", mode);
    hapticFeedback("medium");
  }, []);

  // 🛠️ Optimization: Memoized context value to prevent tree-shaking re-renders
  const contextValue = useMemo(() => ({
    isFullSize,
    navMode,
    mounted,
    toggleFullSize,
    setNavMode
  }), [isFullSize, navMode, mounted, toggleFullSize, setNavMode]);

  return (
    <LayoutContext.Provider value={contextValue}>
      {/* 🚀 VIEWPORT SHELL: antialiased ensures crisp institutional typography */}
      <div className="min-h-[100dvh] w-full flex flex-col antialiased selection:bg-primary/20 transition-colors duration-500">
        {children}
      </div>
    </LayoutContext.Provider>
  );
}

/**
 * 🛰️ LAYOUT TELEMETRY HOOK
 */
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutProvider");
  return context;
};
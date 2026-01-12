"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { hapticFeedback } from "@/src/lib/telegram/webapp";

type NavMode = "SIDEBAR" | "TOPBAR" | "BOTTOM";

type LayoutContextType = {
  isFullSize: boolean;
  navMode: NavMode;
  mounted: boolean; // Added for hydration safety
  toggleFullSize: (value: boolean) => void;
  setNavMode: (mode: NavMode) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

/**
 * 🛰️ LAYOUT ORCHESTRATOR (Apex Tier)
 * Manages the geometric state of the Merchant Cluster UI.
 */
export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [navMode, setNavModeState] = useState<NavMode>("SIDEBAR");
  const [mounted, setMounted] = useState(false);

  // 🏁 SYNCHRONIZATION: Restore preferences from local node storage
  useEffect(() => {
    const savedSize = localStorage.getItem("zipha_full_size") === "true";
    const savedNav = localStorage.getItem("zipha_nav_mode") as NavMode;
    
    if (savedSize) setIsFullSize(savedSize);
    if (savedNav) setNavModeState(savedNav);
    
    setMounted(true);
  }, []);

  const toggleFullSize = (value: boolean) => {
    setIsFullSize(value);
    localStorage.setItem("zipha_full_size", value.toString());
    
    // Tactile confirmation of layout shift
    hapticFeedback("light");
  };

  const setNavMode = (mode: NavMode) => {
    setNavModeState(mode);
    localStorage.setItem("zipha_nav_mode", mode);
    hapticFeedback("medium");
  };

  // 🛠️ Optimization: Prevent unnecessary re-renders of the entire layout tree
  const contextValue = useMemo(() => ({
    isFullSize,
    navMode,
    mounted,
    toggleFullSize,
    setNavMode
  }), [isFullSize, navMode, mounted]);

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="antialiased selection:bg-primary/20 transition-colors duration-500">
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
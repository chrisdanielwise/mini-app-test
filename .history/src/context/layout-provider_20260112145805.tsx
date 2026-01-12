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
 * 🛰️ LAYOUT ORCHESTRATOR (v9.2.9)
 * Architecture: Turbopack & Next.js 16 Compatible.
 * Hardened: Critical Hydration Guard to prevent auth-race conditions.
 */
export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [navMode, setNavModeState] = useState<NavMode>("SIDEBAR");
  const [flavor, setFlavor] = useState<ThemeFlavor>("DEFAULT");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    /**
     * 🛡️ TELEMETRY RESTORATION
     * We keep localStorage for UI preferences (NOT for auth tokens).
     */
    try {
      const savedSize = localStorage.getItem("zipha_full_size") === "true";
      const savedNav = localStorage.getItem("zipha_nav_mode") as NavMode;
      const savedFlavor = localStorage.getItem("zipha_theme_flavor") as ThemeFlavor;
      
      if (savedSize) setIsFullSize(true);
      if (savedNav && ["SIDEBAR", "TOPBAR", "BOTTOM"].includes(savedNav)) {
        setNavModeState(savedNav);
      }
      if (savedFlavor && ["EMERALD", "AMBER", "DEFAULT"].includes(savedFlavor)) {
        setFlavor(savedFlavor);
      }
    } catch (err) {
      console.warn("🛰️ [Layout_Sync] Preference node isolated.");
    } finally {
      // 🚩 CRITICAL: Signal that the client-side environment is ready.
      // This allows useAuth to proceed safely with cookie-based verification.
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
        {/**
         * 🛡️ THE PASSIVE HYDRATION SHIELD
         * By delaying children until 'mounted', we ensure that child hooks like useAuth
         * only run once the browser environment (and Cookies) are fully available.
         */}
        {mounted ? children : (
          <div className="fixed inset-0 bg-background flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
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
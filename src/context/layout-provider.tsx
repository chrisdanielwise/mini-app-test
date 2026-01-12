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
 * 🛰️ LAYOUT ORCHESTRATOR (Institutional v9.7.2)
 * Architecture: Turbopack & Next.js 16 Compatible.
 * Hardened: Role-Aware Flavor Injection & Hydration Shield.
 */
export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [navMode, setNavModeState] = useState<NavMode>("SIDEBAR");
  const [flavor, setFlavor] = useState<ThemeFlavor>("DEFAULT");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    /**
     * 🛡️ TELEMETRY RESTORATION
     * Restores UI node preferences from local persistence.
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
    // 🛡️ Safe haptic trigger for theme shifts
    if (newFlavor !== "DEFAULT") hapticFeedback("medium");
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
          selection:bg-primary/20 transition-all duration-700
          ${mounted && flavor === "AMBER" ? "theme-staff" : ""}
          ${mounted && flavor === "EMERALD" ? "theme-merchant" : ""}
        `}
      >
        {/**
         * 🛡️ THE PASSIVE HYDRATION SHIELD
         * Prevents child hooks (useAuth, useApi) from executing before 
         * browser cookies and Telegram SDK are stable.
         */}
        {mounted ? children : (
          <div className="fixed inset-0 bg-background flex items-center justify-center z-[9999]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
                Synchronizing_Node...
              </p>
            </div>
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
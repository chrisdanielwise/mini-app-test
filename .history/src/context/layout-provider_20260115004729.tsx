"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";

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
 * 🌊 LAYOUT ORCHESTRATOR (v16.16.12)
 * Logic: Synchronized Role-Flavors with Telegram SDK Header Handshake.
 * Design: Institutional Hydration Shield with Glass Morphing.
 */
export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [navMode, setNavModeState] = useState<NavMode>("BOTTOM"); // Standardize to BOTTOM for start app
  const [flavor, setFlavor] = useState<ThemeFlavor>("DEFAULT");
  const [mounted, setMounted] = useState(false);

  // 🛡️ TELEMETRY SYNC: Effect 01 - Local Persistence & SDK Handshake
  useEffect(() => {
    try {
      const savedSize = localStorage.getItem("zipha_full_size") === "true";
      const savedNav = localStorage.getItem("zipha_nav_mode") as NavMode;
      const savedFlavor = localStorage.getItem("zipha_theme_flavor") as ThemeFlavor;
      
      if (savedSize) setIsFullSize(true);
      if (savedNav) setNavModeState(savedNav);
      if (savedFlavor) setFlavor(savedFlavor);
    } catch (err) {
      console.warn("🛰️ [Layout_Sync] Preference node isolated.");
    } finally {
      setMounted(true);
    }
  }, []);

  // 🛡️ FLAVOR PROPAGATION: Effect 02 - Syncing colors with Telegram native frame
  useEffect(() => {
    if (!mounted || !window.Telegram?.WebApp) return;

    const webApp = window.Telegram.WebApp;
    // Handshake: Update Telegram header color based on Institutional Flavor
    const headerColor = flavor === "AMBER" ? "#f59e0b" : flavor === "EMERALD" ? "#10b981" : "#000000";
    
    try {
      webApp.setHeaderColor(headerColor as any);
      webApp.setBackgroundColor(flavor === "DEFAULT" ? "#000000" : "#0a0a0a");
    } catch (e) {
      // Fallback for desktop/browser environments
    }
  }, [flavor, mounted]);

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
    hapticFeedback("heavy"); // 🏁 TACTILE SYNC: Feel the system-wide shift
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
        className={cn(
          "min-h-[100dvh] w-full flex flex-col antialiased selection:bg-primary/20 transition-colors duration-1000",
          mounted && flavor === "AMBER" && "theme-staff",
          mounted && flavor === "EMERALD" && "theme-merchant",
          !mounted && "opacity-0"
        )}
      >
        {/**
         * 🛡️ INSTITUTIONAL HYDRATION SHIELD
         * High-fidelity spinner with Water Flow physics.
         */}
        {mounted ? children : (
          <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999] p-10">
            <div className="relative size-20">
              <div className="absolute inset-0 rounded-full border-[3px] border-primary/10" />
              <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
            <div className="mt-8 space-y-2 text-center">
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-foreground italic animate-pulse">
                Zipha_Protocol
              </p>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                Synchronizing_Identity_Nodes...
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
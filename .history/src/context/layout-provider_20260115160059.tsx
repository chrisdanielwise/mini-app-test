"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

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
 * 🌊 LAYOUT_ORCHESTRATOR (Institutional Apex v16.16.31)
 * Priority: Hardware-Fluid Layout Interpolation.
 * Logic: Synchronized Role-Flavors with Device-State morphology.
 */
export function LayoutProvider({ children }: { children: React.ReactNode }) {
  // 🛰️ DEVICE INGRESS: Consuming hardware physics
  const { isMobile, isDesktop, isReady, isPortrait } = useDeviceContext();
  const { impact, hapticFeedback } = useHaptics();

  const [isFullSize, setIsFullSize] = useState(false);
  const [navMode, setNavModeState] = useState<NavMode>("BOTTOM");
  const [flavor, setFlavor] = useState<ThemeFlavor>("DEFAULT");
  const [mounted, setMounted] = useState(false);

  // 🛡️ TELEMETRY SYNC: Preference Handshake
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

  // 🕵️ MORPHOLOGY RESOLUTION: Auto-adjust NavMode based on hardware
  useEffect(() => {
    if (!isReady) return;

    if (isDesktop) {
      setNavModeState("TOPBAR");
    } else if (isMobile) {
      setNavModeState("BOTTOM");
    }
  }, [isDesktop, isMobile, isReady]);

  // 🛡️ FLAVOR PROPAGATION: Telegram SDK Native Handshake
  useEffect(() => {
    if (!mounted || !window.Telegram?.WebApp) return;

    const webApp = window.Telegram.WebApp;
    const headerColor = flavor === "AMBER" ? "#f59e0b" : flavor === "EMERALD" ? "#10b981" : "#000000";
    
    try {
      webApp.setHeaderColor(headerColor as any);
      webApp.setBackgroundColor(flavor === "DEFAULT" ? "#000000" : "#0a0a0a");
      
      // Expand WebApp if fullSize is requested on mobile
      if (isFullSize && isMobile) {
        webApp.expand();
      }
    } catch (e) {
      // Hardware Fallback
    }
  }, [flavor, mounted, isFullSize, isMobile]);

  const toggleFullSize = useCallback((value: boolean) => {
    setIsFullSize(value);
    localStorage.setItem("zipha_full_size", value.toString());
    impact("light");
  }, [impact]);

  const setNavMode = useCallback((mode: NavMode) => {
    setNavModeState(mode);
    localStorage.setItem("zipha_nav_mode", mode);
    impact("medium");
  }, [impact]);

  const setThemeFlavor = useCallback((newFlavor: ThemeFlavor) => {
    setFlavor(newFlavor);
    localStorage.setItem("zipha_theme_flavor", newFlavor);
    impact("heavy"); 
  }, [impact]);

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
          "min-h-screen w-full flex flex-col antialiased transition-colors duration-1000",
          mounted && flavor === "AMBER" && "theme-staff",
          mounted && flavor === "EMERALD" && "theme-merchant",
          !mounted && "opacity-0"
        )}
      >
        {/**
         * 🛡️ INSTITUTIONAL HYDRATION SHIELD
         */}
        {mounted && isReady ? children : (
          <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999] p-10">
            <div className="relative size-20 md:size-24">
              <div className="absolute inset-0 rounded-full border-[3px] border-primary/10" />
              <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
            <div className="mt-8 space-y-3 text-center">
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-foreground italic animate-pulse">
                Zipha_Protocol
              </p>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                Synchronizing_Hardware_Morphology...
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
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type NavMode = "SIDEBAR" | "TOPBAR" | "BOTTOM";

type LayoutContextType = {
  isFullSize: boolean;
  navMode: NavMode;
  toggleFullSize: (value: boolean) => void;
  setNavMode: (mode: NavMode) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [navMode, setNavModeState] = useState<NavMode>("SIDEBAR");

  useEffect(() => {
    const savedSize = localStorage.getItem("zipha_full_size") === "true";
    const savedNav = localStorage.getItem("zipha_nav_mode") as NavMode;
    if (savedSize) setIsFullSize(savedSize);
    if (savedNav) setNavModeState(savedNav);
  }, []);

  const toggleFullSize = (value: boolean) => {
    setIsFullSize(value);
    localStorage.setItem("zipha_full_size", value.toString());
  };

  const setNavMode = (mode: NavMode) => {
    setNavModeState(mode);
    localStorage.setItem("zipha_nav_mode", mode);
  };

  return (
    <LayoutContext.Provider value={{ isFullSize, navMode, toggleFullSize, setNavMode }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutProvider");
  return context;
};
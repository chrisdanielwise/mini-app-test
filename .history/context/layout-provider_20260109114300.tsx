"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type LayoutContextType = {
  isFullSize: boolean;
  toggleFullSize: (value: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isFullSize, setIsFullSize] = useState(false);

  // Load preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("zipha_full_size") === "true";
    setIsFullSize(saved);
  }, []);

  const toggleFullSize = (value: boolean) => {
    setIsFullSize(value);
    localStorage.setItem("zipha_full_size", value.toString());
  };

  return (
    <LayoutContext.Provider value={{ isFullSize, toggleFullSize }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutProvider");
  return context;
};
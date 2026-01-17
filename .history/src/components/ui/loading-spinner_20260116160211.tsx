"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ LOADING_SPINNER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Velocity & Trail Hardening.
 * Fix: Tactical size-5 standard prevents layout blowout.
 */
export function LoadingSpinner({ 
  className, 
  size = "md" 
}: { 
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeMap = {
    // 📐 TACTICAL SCALE: 20% shrunken for HUD density
    sm: "size-3.5 border",
    md: "size-5 border-[1.5px]",
    lg: "size-8 border-2",
    xl: "size-12 border-[3px]",
  };

  return (
    <div
      role="status"
      className={cn(
        "animate-spin rounded-full border-solid border-primary/5 border-t-primary/60",
        "transition-all duration-500",
        sizeMap[size],
        className
      )}
    >
      <span className="sr-only">Hydrating_Node...</span>
    </div>
  );
}

/**
 * 🛰️ LOADING_SCREEN
 * Strategy: Obsidian-OLED Depth & Stationary HUD Ingress.
 */
export function LoadingScreen({ 
  message = "Initializing_Link...",
  subtext = "Syncing_Node_Ledger..." 
}: { 
  message?: string;
  subtext?: string;
}) {
  const { isReady } = useDeviceContext();

  return (
    <div 
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-6 bg-zinc-950/60 backdrop-blur-3xl"
      suppressHydrationWarning
    >
      {/* 🌫️ LAMINAR RADIANCE: Subsurface signal leak */}
      <div className="relative flex items-center justify-center">
        <div className="absolute size-24 animate-pulse rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute size-12 animate-ping rounded-full bg-primary/5 duration-[3000ms]" />
        
        <LoadingSpinner size="lg" className="relative z-10" />
      </div>
      
      <div className="flex flex-col items-center gap-1.5 text-center">
        {/* 🏛️ Branding Hardening: Technical Metadata Standard */}
        <p className="text-[10px] font-black uppercase italic tracking-[0.4em] text-primary/60 animate-pulse">
          {message}
        </p>
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/10">
          {subtext}
        </p>
      </div>

      {/* 📏 STATIONARY GRID ANCHOR */}
      <div className="absolute bottom-16 h-[0.5px] w-16 bg-white/10" />
    </div>
  );
}
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 🌊 FLUID SPINNER (Institutional v16.16.12)
 * Logic: Momentum-based rotation with trail ingress.
 */
export function LoadingSpinner({ 
  className, 
  size = "md" 
}: { 
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeMap = {
    sm: "size-4 border-2",
    md: "size-6 border-2",
    lg: "size-10 border-[3px]",
    xl: "size-16 border-[4px]",
  };

  return (
    <div
      role="status"
      className={cn(
        "animate-spin rounded-full border-solid border-primary/20 border-t-primary",
        "transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]",
        sizeMap[size],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * 🌊 ATMOSPHERIC LOADING SCREEN
 * Logic: Role-aware masking with Institutional v9.5.0 Typography.
 * Standard: v9.9.1 Hardened Glassmorphism.
 */
export function LoadingScreen({ 
  message = "Initializing Secure Link...",
  subtext = "Syncing with Neon Database..." 
}: { 
  message?: string;
  subtext?: string;
}) {
  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background/80 backdrop-blur-xl"
      suppressHydrationWarning
    >
      {/* 🌊 FLUID RADIANCE: Creates a localized light-leak behind the spinner */}
      <div className="relative flex items-center justify-center">
        <div className="absolute size-32 animate-[pulse_3s_infinite] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute size-16 animate-ping rounded-full bg-primary/10 duration-[2000ms]" />
        
        <LoadingSpinner size="lg" className="relative z-10" />
      </div>
      
      <div className="flex flex-col items-center gap-2 text-center">
        {/* 🏛️ Branding Hardening: v9.5.0 Terminal Standard */}
        <p className="text-[11px] font-black uppercase italic tracking-[0.3em] text-primary animate-pulse">
          {message}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          {subtext}
        </p>
      </div>

      {/* 🌊 PROGRESS INDICATOR: Subtle baseline for 2026 aesthetics */}
      <div className="absolute bottom-12 h-px w-24 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
}
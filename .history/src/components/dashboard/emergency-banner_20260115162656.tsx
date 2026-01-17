"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { AlertTriangle, Info, Megaphone, X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface EmergencyBannerProps {
  active: boolean;
  message: string;
  level: "INFO" | "WARN" | "CRITICAL";
}

/**
 * 🌊 EMERGENCY_BANNER (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Level haptics.
 */
export function EmergencyBanner({ active, message, level }: EmergencyBannerProps) {
  const [closed, setClosed] = useState(false);
  const { impact, notification } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Consuming hardware physics for safe-area alignment
  const { isReady, safeArea, screenSize } = useDeviceContext();

  // 🏁 TACTILE SYNC: Trigger hardware feedback based on signal level
  useEffect(() => {
    if (active && !closed && isReady) {
      if (level === "CRITICAL") notification("error");
      else if (level === "WARN") notification("warning");
      else impact("medium");
    }
  }, [active, closed, level, notification, impact, isReady]);

  if (!active || closed || !isReady) return null;

  const styles = {
    INFO: "bg-blue-500/10 border-blue-500/20 text-blue-500 shadow-apex",
    WARN: "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-apex",
    CRITICAL: "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-apex animate-pulse",
  };

  const icons = {
    INFO: <Info className="size-4" />,
    WARN: <AlertTriangle className="size-4" />,
    CRITICAL: <Megaphone className="size-4" />,
  };

  const handleClose = () => {
    impact("light");
    setClosed(true);
  };

  return (
    <div 
      className={cn(
        "w-full border-b backdrop-blur-3xl px-6 flex items-center justify-between z-[200]",
        "transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "animate-in slide-in-from-top-full",
        screenSize === 'xs' ? "py-4" : "py-6",
        styles[level]
      )}
      style={{ paddingTop: `calc(${safeArea.top}px + 0.75rem)` }}
    >
      {/* 🌫️ SUBSURFACE RADIANCE: Kinetic Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

      <div className="flex items-center gap-5 relative z-10">
        <div className="shrink-0 flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
          {icons[level]}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1 opacity-40 italic">
            <Activity className="size-3 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] leading-none">
              {level}_SIGNAL_BROADCAST
            </span>
          </div>
          <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] italic leading-tight truncate pr-4 text-foreground">
            {message}
          </p>
        </div>
      </div>
      
      <button 
        onClick={handleClose}
        className="size-10 md:size-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all active:scale-75 shrink-0 group"
      >
        <X className="size-4 opacity-30 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}
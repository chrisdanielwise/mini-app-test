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
 * 🌊 EMERGENCY_BANNER (Institutional Apex v2026.1.16)
 * Strategy: High-density, low-profile tactical signal.
 * Fix: Clamped vertical footprint to prevent "bogus" layout distortion.
 */
export function EmergencyBanner({ active, message, level }: EmergencyBannerProps) {
  const [closed, setClosed] = useState(false);
  const { impact, notification } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Recalibrated for Tactical Depth
  const { isReady, safeArea, screenSize, isMobile } = useDeviceContext();

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
    INFO: "bg-blue-500/10 border-blue-500/10 text-blue-500 shadow-lg shadow-blue-500/5",
    WARN: "bg-amber-500/10 border-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/5",
    CRITICAL: "bg-rose-500/10 border-rose-500/10 text-rose-500 shadow-lg shadow-rose-500/10 animate-pulse",
  };

  const icons = {
    INFO: <Info className="size-3.5" />,
    WARN: <AlertTriangle className="size-3.5" />,
    CRITICAL: <Megaphone className="size-3.5" />,
  };

  const handleClose = () => {
    impact("light");
    setClosed(true);
  };

  return (
    <div 
      className={cn(
        "w-full border-b backdrop-blur-3xl px-5 flex items-center justify-between z-[200] relative",
        "transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "animate-in slide-in-from-top-full",
        // 🏛️ TACTICAL CLAMPING: Reduced height to prevent pushing content down
        isMobile ? "py-3" : "py-3.5",
        styles[level]
      )}
      style={{ paddingTop: `calc(${safeArea.top}px + 0.5rem)` }}
    >
      {/* 🌫️ TACTICAL RADIANCE: Low-weight background depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10 min-w-0">
        <div className="shrink-0 flex items-center justify-center size-8 rounded-lg bg-black/20 border border-white/5 shadow-inner">
          {icons[level]}
        </div>
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1 opacity-30 italic leading-none">
            <Activity className="size-2.5 animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-[0.4em]">
              {level}_SIGNAL_BROADCAST
            </span>
          </div>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest italic leading-none truncate pr-4 text-foreground/90">
            {message}
          </p>
        </div>
      </div>
      
      <button 
        onClick={handleClose}
        className="size-8 md:size-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all active:scale-90 shrink-0 group"
      >
        <X className="size-3.5 opacity-20 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}
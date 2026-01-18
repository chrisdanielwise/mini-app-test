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
 * 🛰️ EMERGENCY_BANNER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Signal Isolation.
 * Fix: Removed redundant safeArea.top padding to prevent HUD displacement.
 * Fix: High-density py-1.5 keeps the banner at a constant 36px height.
 */
export function EmergencyBanner({ active, message, level }: EmergencyBannerProps) {
  const [closed, setClosed] = useState(false);
  const { impact, notification } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  useEffect(() => {
    if (active && !closed && isReady) {
      if (level === "CRITICAL") notification("error");
      else if (level === "WARN") notification("warning");
      else impact("medium");
    }
  }, [active, closed, level, notification, impact, isReady]);

  if (!active || closed || !isReady) return null;

  const styles = {
    INFO: "bg-blue-500/5 border-blue-500/10 text-blue-500",
    WARN: "bg-amber-500/5 border-amber-500/10 text-amber-500",
    CRITICAL: "bg-rose-500/10 border-rose-500/20 text-rose-500 animate-pulse",
  };

  const icons = {
    INFO: <Info className="size-3" />,
    WARN: <AlertTriangle className="size-3" />,
    CRITICAL: <Megaphone className="size-3" />,
  };

  return (
    <div 
      className={cn(
        "w-full border-b backdrop-blur-3xl px-4 flex items-center justify-between z-[200] relative transition-all duration-500",
        "animate-in slide-in-from-top-full h-10", // 🏁 FIXED HEIGHT: Exactly 40px
        styles[level]
      )}
      /* 🛡️ TACTICAL REMOVAL: 
         We remove safeArea padding here because this banner sits ABOVE the NavGuard.
         The NavGuard is already being pushed down by your RootLayout buffer.
      */
    >
      <div className="flex items-center gap-3 min-w-0 relative z-10">
        <div className="shrink-0 flex items-center justify-center size-6 rounded bg-black/40 border border-white/5 shadow-inner">
          {icons[level]}
        </div>
        
        <div className="flex flex-col min-w-0 leading-none">
          <div className="flex items-center gap-1.5 mb-0.5 opacity-20 italic">
            <Activity className="size-2 animate-pulse" />
            <span className="text-[6px] font-black uppercase tracking-[0.3em]">
              {level}_SIGNAL
            </span>
          </div>
          <p className="text-[8px] font-black uppercase tracking-widest italic truncate pr-4 text-foreground/80">
            {message}
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => { impact("light"); setClosed(true); }}
        className="size-6 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 transition-all active:scale-90 shrink-0"
      >
        <X className="size-3 opacity-30" />
      </button>
    </div>
  );
}
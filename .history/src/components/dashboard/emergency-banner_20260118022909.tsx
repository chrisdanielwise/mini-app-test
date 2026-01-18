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
 * 🛰️ EMERGENCY_BANNER (Hardened v16.16.55)
 * Strategy: Vertical Compression & Signal Isolation.
 * Standard: Institutional Apex v2026.1.20.
 */
export function EmergencyBanner({ active, message, level }: EmergencyBannerProps) {
  const [closed, setClosed] = useState(false);
  const { impact, notification } = useHaptics();
  const { isReady } = useDeviceContext();

  useEffect(() => {
    // 🛡️ DYNAMIC ALIGNMENT BROADCAST (Vital Fix)
    // Synchronizes the TopNav and Sidebar to push down by 40px
    if (active && !closed && isReady) {
      document.documentElement.style.setProperty('--emergency-offset', '40px');
      
      // Hardware-level haptic warning
      if (level === "CRITICAL") notification("error");
      else if (level === "WARN") notification("warning");
      else impact("light");
    } else {
      document.documentElement.style.setProperty('--emergency-offset', '0px');
    }

    return () => {
      document.documentElement.style.setProperty('--emergency-offset', '0px');
    };
  }, [active, closed, level, notification, impact, isReady]);

  if (!active || closed || !isReady) return null;

  const styles = {
    INFO: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    WARN: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    CRITICAL: "bg-rose-500/15 border-rose-500/30 text-rose-500 animate-pulse",
  };

  const icons = {
    INFO: <Info className="size-3.5" />,
    WARN: <AlertTriangle className="size-3.5" />,
    CRITICAL: <Megaphone className="size-3.5" />,
  };

  return (
    <div 
      className={cn(
        "w-full border-b backdrop-blur-3xl px-4 flex items-center justify-between z-[200] relative",
        "h-10 transition-all duration-700 ease-out animate-in slide-in-from-top-full",
        styles[level]
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 size-6 rounded bg-black/40 border border-white/5 flex items-center justify-center">
          {icons[level]}
        </div>
        
        <div className="flex flex-col min-w-0 leading-none">
          <div className="flex items-center gap-1.5 mb-0.5 opacity-30 italic">
            <Activity className="size-2 animate-pulse" />
            <span className="text-[6.5px] font-black uppercase tracking-[0.3em]">
              {level}_BROADCAST
            </span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest italic truncate text-foreground/90">
            {message}
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => { impact("light"); setClosed(true); }}
        className="size-7 flex items-center justify-center rounded-lg bg-white/5 active:scale-90 transition-all hover:bg-white/10"
      >
        <X className="size-3.5 opacity-40" />
      </button>
    </div>
  );
}
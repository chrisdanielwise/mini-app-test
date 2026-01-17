"use client";

import * as React from "react";
import { AlertTriangle, Info, Megaphone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface EmergencyBannerProps {
  active: boolean;
  message: string;
  level: "INFO" | "WARN" | "CRITICAL";
}

/**
 * 🌊 FLUID EMERGENCY BANNER (v16.16.12)
 * Logic: Haptic-synced global signal intercept.
 * Design: v9.9.1 Hardened Glassmorphism with Kinetic Ingress.
 */
export function EmergencyBanner({ active, message, level }: EmergencyBannerProps) {
  const [closed, setClosed] = useState(false);
  const { impact, notification } = useHaptics();

  // 🏁 TACTILE SYNC: Trigger hardware feedback based on signal level
  useEffect(() => {
    if (active && !closed) {
      if (level === "CRITICAL") notification("error");
      else if (level === "WARN") notification("warning");
      else impact("medium");
    }
  }, [active, closed, level, notification, impact]);

  if (!active || closed) return null;

  const styles = {
    INFO: "bg-blue-500/10 border-blue-500/20 text-blue-500 shadow-[0_4px_20px_rgba(59,130,246,0.1)]",
    WARN: "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.1)]",
    CRITICAL: "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-[0_4px_20px_rgba(244,63,94,0.15)] animate-pulse",
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
    <div className={cn(
      "w-full border-b backdrop-blur-xl px-6 py-3 flex items-center justify-between z-[60]",
      "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
      "animate-in slide-in-from-top-full",
      styles[level]
    )}>
      <div className="flex items-center gap-4">
        <div className="shrink-0 animate-in zoom-in-50 duration-500 delay-300">
          {icons[level]}
        </div>
        
        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic leading-none truncate pr-4">
          <span className="opacity-40">{level}_BROADCAST //</span> {message}
        </span>
      </div>
      
      <button 
        onClick={handleClose}
        className="size-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-75 shrink-0"
      >
        <X className="size-3.5 opacity-40 hover:opacity-100" />
      </button>
    </div>
  );
}
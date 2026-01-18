"use client";

import * as React from "react";
import { Bell, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useGlobalSignal } from "@/lib/hooks/use-global-signal";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface NotificationBellProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  hasNew?: boolean;
}

/**
 * 🛰️ NOTIFICATION_BELL (Hardened v16.16.89)
 * Strategy: Tactical Trigger Node & Signal Pulse.
 * Mission: Provide kinetic entry to the Archival Ledger with zero layout jitter.
 */
export function NotificationBell({ onClick, hasNew = false }: NotificationBellProps) {
  const { sendSignal } = useGlobalSignal();
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  // 🛡️ HYDRATION_SHIELD: Prevents layout snap during hardware handshake
  if (!isReady) {
    return (
      <div className={cn(
        "rounded-xl bg-white/5 animate-pulse border border-white/5",
        isMobile ? "size-9" : "size-10"
      )} />
    );
  }

  const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
    impact("medium"); // 🏎️ Physical feedback for trigger ingress
    
    // If used as a standalone trigger (legacy support)
    if (!onClick) {
      sendSignal("Sync_Complete", "All hardware nodes stable.", "SUCCESS");
    } else {
      onClick(e);
    }
  };

  /**
   * 📐 TACTICAL_GEOMETRY
   * Standardized to 36px (mobile) or 40px (desktop) for HUD economy.
   */
  const bellSize = isMobile ? "size-9" : "size-10";
  const iconSize = isMobile ? "size-4" : "size-4.5";

  return (
    <button 
      onClick={handlePress}
      className={cn(
        "relative flex items-center justify-center border transition-all duration-500 active:scale-90 group",
        "rounded-xl bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10 shadow-sm",
        bellSize
      )}
    >
      {/* 🌫️ TACTICAL RADIANCE: Chromatic Bleed on Active State */}
      <div className={cn(
        "absolute inset-0 rounded-xl transition-opacity pointer-events-none duration-700",
        hasNew ? "bg-primary/5 opacity-100" : "bg-transparent opacity-0"
      )} />

      <Bell className={cn(
        "transition-all duration-700 group-hover:rotate-12",
        hasNew 
          ? "text-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
          : "text-muted-foreground/20 group-hover:text-muted-foreground/40",
        iconSize
      )} />

      {/* 💓 MORPHOLOGICAL PULSE: Animated status node */}
      {hasNew && (
        <span className="absolute top-2.5 right-2.5 flex size-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-30" />
          <span className="relative inline-flex rounded-full size-1.5 bg-primary shadow-[0_0_8px_#10b981]" />
        </span>
      )}

      {/* 📊 TELEMETRY BAR: Mobile-optimized status indicator */}
      {isMobile && (
        <div className="absolute -bottom-1.5 flex items-center justify-center w-full">
           <div className={cn(
             "h-[1.5px] rounded-full transition-all duration-700",
             hasNew ? "w-2.5 bg-primary shadow-[0_0_4px_#10b981]" : "w-1 bg-white/10"
           )} />
        </div>
      )}

      {/* 🖥️ DESKTOP SUB-LABEL: Institutional Telemetry */}
      {!isMobile && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-30 transition-all duration-500 flex items-center gap-1.5 leading-none pointer-events-none">
          <Activity className="size-2 text-primary" />
          <span className="text-[6px] font-black uppercase tracking-[0.2em] italic">SIGNAL_STABLE</span>
        </div>
      )}
    </button>
  );
}
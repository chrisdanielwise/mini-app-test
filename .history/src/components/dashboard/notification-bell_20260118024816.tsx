"use client";

import * as React from "react";
import { Bell, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useGlobalSignal } from "@/lib/hooks/use-global-signal";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ NOTIFICATION_BELL (Hardened v16.16.65)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Mission: High-density notification ingress for the Stationary Horizon HUD.
 */
export function NotificationBell() {
  const { sendSignal } = useGlobalSignal();
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();
  const [hasNew, setHasNew] = React.useState(true);

  // 🛡️ HYDRATION SHIELD: Prevents "Layout Jitter" during hardware handshake
  if (!isReady) return (
    <div className="size-9 md:size-10 rounded-xl bg-white/5 animate-pulse border border-white/5" />
  );

  const handleManualCheck = () => {
    impact("medium");
    // 🚀 SIGNAL_BROADCAST: Informs the global ledger of user acknowledgment
    sendSignal("Sync_Complete", "All hardware nodes stable.", "SUCCESS");
    setHasNew(false);
  };

  /**
   * 🕵️ TACTICAL CLAMPING
   * Standardized to 36px (xs) or 40px (default) for header economy.
   */
  const bellSize = isMobile ? "size-9" : "size-10";
  const iconSize = isMobile ? "size-4" : "size-4.5";

  return (
    <button 
      onClick={handleManualCheck}
      className={cn(
        "relative flex items-center justify-center border transition-all duration-500 active:scale-90 group",
        "rounded-xl bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 shadow-sm",
        bellSize
      )}
    >
      {/* 🌫️ TACTICAL RADIANCE: Chromatic Bleed on Active State */}
      <div className={cn(
        "absolute inset-0 rounded-xl transition-opacity pointer-events-none",
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
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-30"></span>
          <span className="relative inline-flex rounded-full size-1.5 bg-primary shadow-[0_0_8px_#10b981]"></span>
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
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-30 transition-all duration-500 flex items-center gap-1.5 leading-none">
          <Activity className="size-2 text-primary" />
          <span className="text-[6px] font-black uppercase tracking-[0.2em] italic">SIGNAL_STABLE</span>
        </div>
      )}
    </button>
  );
}
"use client";

import * as React from "react";
import { Bell, Activity } from "lucide-react";
import { useGlobalSignal } from "@/lib/hooks/use-global-signal";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { cn } from "@/lib/utils";

/**
 * 🛰️ NOTIFICATION_BELL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: Reduced footprint (size-10) and tightened telemetry sub-labels.
 */
export function NotificationBell() {
  const { sendSignal } = useGlobalSignal();
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();
  const [hasNew, setHasNew] = React.useState(true);

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="size-9 md:size-10 rounded-xl bg-white/5 animate-pulse border border-white/5" />;

  const handleManualCheck = () => {
    impact("medium");
    sendSignal("Sync_Complete", "All hardware nodes stable.", "SUCCESS");
    setHasNew(false);
  };

  /**
   * 🕵️ TACTICAL CLAMPING
   * Standardized to h-10 (40px) for high-density header integration.
   */
  const bellSize = screenSize === 'xs' ? "size-9" : "size-10";
  const iconSize = screenSize === 'xs' ? "size-4" : "size-4.5";

  return (
    <button 
      onClick={handleManualCheck}
      className={cn(
        "relative flex items-center justify-center border transition-all duration-500 active:scale-95 group",
        "rounded-xl bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 shadow-sm",
        bellSize
      )}
    >
      {/* 🌫️ TACTICAL RADIANCE */}
      <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <Bell className={cn(
        "transition-all duration-700 group-hover:rotate-12",
        "text-muted-foreground/20 group-hover:text-primary",
        hasNew && "text-primary animate-pulse",
        iconSize
      )} />

      {/* 💓 COMPRESSED PULSE */}
      {hasNew && (
        <span className="absolute top-2.5 right-2.5 flex size-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-30"></span>
          <span className="relative inline-flex rounded-full size-1.5 bg-primary shadow-[0_0_8px_#10b981]"></span>
        </span>
      )}

      {/* 📊 TELEMETRY SUB-LABEL: Institutional Scale */}
      {!isMobile && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-20 transition-all duration-500 flex items-center gap-1.5 leading-none">
          <Activity className="size-2 text-primary" />
          <span className="text-[6px] font-black uppercase tracking-[0.2em] italic">SYNC_OK</span>
        </div>
      )}
    </button>
  );
}
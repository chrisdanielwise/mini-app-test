"use client";

import * as React from "react";
import { Bell, Activity } from "lucide-react";
import { useGlobalSignal } from "@/lib/hooks/use-global-signal";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { cn } from "@/lib/utils";

/**
 * 🛰️ NOTIFICATION_BELL (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Pulse | Vapour-Glass depth.
 * Logic: morphology-aware hitboxes with Manual Telemetry Ingress.
 */
export function NotificationBell() {
  const { sendSignal } = useGlobalSignal();
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();
  const [hasNew, setHasNew] = React.useState(true);

  // 🛡️ HYDRATION SHIELD: Prevent Layout Shifting
  if (!isReady) return <div className="size-12 md:size-14 rounded-2xl bg-card/20 animate-pulse border border-white/5" />;

  const handleManualCheck = () => {
    // 🏁 TACTILE SYNC: Hardware-level feedback
    impact("medium");
    
    // 🌊 SIGNAL INGRESS
    sendSignal(
      "Sync_Complete", 
      "All hardware nodes are currently stable.", 
      "SUCCESS"
    );
    
    setHasNew(false);
  };

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating hit-zone density based on hardware tier.
   */
  const bellSize = screenSize === 'xs' ? "size-12" : "size-14";
  const iconSize = screenSize === 'xs' ? "size-5" : "size-6";

  return (
    <button 
      onClick={handleManualCheck}
      className={cn(
        "relative flex items-center justify-center border transition-all duration-1000 active:scale-95 group",
        "rounded-2xl md:rounded-[1.4rem] shadow-apex",
        "bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/10",
        bellSize
      )}
    >
      {/* 🌫️ SUBSURFACE RADIANCE: Kinetic Hover Aura */}
      <div className="absolute inset-0 rounded-2xl md:rounded-[1.4rem] bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      <Bell className={cn(
        "transition-all duration-1000 group-hover:rotate-12",
        "text-muted-foreground/30 group-hover:text-primary",
        hasNew && "text-primary animate-pulse",
        iconSize
      )} />

      {/* 💓 VAPOUR PULSE: Dual-Stage Visual Signal */}
      {hasNew && (
        <span className="absolute top-3.5 right-3.5 flex size-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40 duration-[2000ms]"></span>
          <span className="relative inline-flex rounded-full size-2.5 bg-primary shadow-[0_0_12px_#10b981]"></span>
        </span>
      )}

      {/* 📊 TELEMETRY SUB-LABEL (Desktop Only) */}
      {!isMobile && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-40 transition-all duration-700 translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
          <Activity className="size-2 text-primary" />
          <span className="text-[7px] font-black uppercase tracking-[0.3em] italic">Sync_Node</span>
        </div>
      )}
    </button>
  );
}
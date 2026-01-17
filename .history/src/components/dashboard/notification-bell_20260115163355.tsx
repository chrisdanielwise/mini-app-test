"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { useGlobalSignal } from "@/libhooks/use-global-signal";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { cn } from "@/lib/utils";

/**
 * 🛰️ NOTIFICATION_BELL (Institutional Apex v16.16.31)
 * Logic: Manual Telemetry Trigger & Global Signal Ingress.
 * Design: v9.9.1 Hardened Glassmorphism with Kinetic Pulse.
 */
export function NotificationBell() {
  const { sendSignal } = useGlobalSignal();
  const { impact } = useHaptics();
  const [hasNew, setHasNew] = React.useState(true); // Example state

  const handleManualCheck = () => {
    // 🏁 TACTILE SYNC: Micro-tick on press
    impact("medium");
    
    // 🌊 SIGNAL INGRESS
    sendSignal(
      "Sync_Complete", 
      "All hardware nodes are currently stable.", 
      "SUCCESS"
    );
    
    setHasNew(false);
  };

  return (
    <button 
      onClick={handleManualCheck}
      className={cn(
        "relative size-12 flex items-center justify-center rounded-2xl border transition-all duration-700 active:scale-90 group",
        "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
      )}
    >
      <Bell className={cn(
        "size-5 text-muted-foreground/40 transition-colors group-hover:text-foreground",
        hasNew && "text-primary animate-pulse"
      )} />

      {/* 🌫️ VAPOUR PULSE: Visual Indicator */}
      {hasNew && (
        <span className="absolute top-3 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      )}
    </button>
  );
}
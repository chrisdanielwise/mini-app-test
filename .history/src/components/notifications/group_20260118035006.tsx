"use client";

import * as React from "react";
import { NotificationBell } from "./bell";
import { NotificationLedger } from "./ledger";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ NOTIFICATION_GROUP (Institutional v16.16.90)
 * Strategy: State Orchestration & Tactile Ingress.
 * Mission: Connect the HUD trigger to the archival Signal Ledger.
 */
export function NotificationGroup() {
  const [open, setOpen] = React.useState(false);
  const [hasNew, setHasNew] = React.useState(false);
  const { selectionChange } = useHaptics();

  // 🛡️ TELEMETRY_INGRESS: Check for unread logs on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const logs = JSON.parse(localStorage.getItem("zipha_logs") || "[]");
      if (logs.length > 0) setHasNew(true);
    }
  }, []);

  // 🏁 INGRESS_HANDSHAKE: Handle Ledger opening
  const handleOpenLedger = () => {
    selectionChange(); // Premium tactile feedback for overlay ingress
    setOpen(true);
    setHasNew(false); // Reset signal pulse once viewed
  };

  return (
    <div className="flex items-center">
      {/* 🔔 THE TRIGGER: Pulsing Bell Node */}
      <NotificationBell 
        onClick={handleOpenLedger} 
        hasNew={hasNew} 
      />

      {/* 💾 THE ARCHIVE: Slide-up Signal Ledger */}
      <NotificationLedger 
        open={open} 
        onOpenChange={setOpen} 
      />
    </div>
  );
}
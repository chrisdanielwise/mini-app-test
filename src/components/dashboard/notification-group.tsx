"use client";

import * as React from "react";
import { useState } from "react";
import { NotificationBell } from "./notification-bell";
import { NotificationLedger } from "./notification-ledger";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ NOTIFICATION_GROUP (Institutional Apex v2026.1.20)
 * Strategy: Component Orchestration & Geometry Lock.
 * Fix: Removed 'relative' flex gaps to ensure a high-density clinical fit.
 */
export function NotificationGroup() {
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const { impact } = useHaptics();

  // 🛡️ PROTOCOL HANDSHAKE: Triggering the Archive
  const handleOpenLedger = () => {
    impact("medium");
    setLedgerOpen(true);
  };

  return (
    <div className="flex items-center justify-center shrink-0">
      {/* 🛰️ THE TRIGGER: High-density h-10 bell */}
      <NotificationBell onClick={handleOpenLedger} />
      
      {/* 💾 THE ARCHIVE: Stationary Portal-based ledger */}
      <NotificationLedger 
        open={ledgerOpen} 
        onOpenChange={(val: boolean) => {
          setLedgerOpen(val);
          if (!val) impact("light");
        }} 
      />
    </div>
  );
}
"use client";

import * as React from "react";
import { useState } from "react";
import { NotificationBell } from "./notification-bell";
import { NotificationLedger } from "./notification-ledger";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ NOTIFICATION_GROUP (Refined v16.16.66)
 * Strategy: Component Orchestration & Geometry Lock.
 * Fix: Synchronized Atomic Trigger for Institutional Ledger ingress.
 */
export function NotificationGroup() {
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const { impact, selectionChange } = useHaptics();

  // 🛡️ ATOMIC INGRESS: Synchronizing feedback with state
  const handleIngress = () => {
    impact("medium");
    setLedgerOpen(true);
  };

  return (
    <div className="flex items-center justify-center shrink-0">
      {/* 🚀 THE TRIGGER 
         Note: NotificationBell must accept an 'onClick' prop 
         to handle the Ingress Handshake.
      */}
      <NotificationBell onClick={handleIngress} />
      
      {/* 💾 THE ARCHIVE 
         Strategy: Portal-based HUD Overlay.
      */}
      <NotificationLedger 
        open={ledgerOpen} 
        onOpenChange={(val: boolean) => {
          if (!val) {
            impact("light");
          } else {
            selectionChange(); // Tactile confirmation for state change
          }
          setLedgerOpen(val);
        }} 
      />
    </div>
  );
}
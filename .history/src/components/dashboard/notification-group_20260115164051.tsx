"use client";

import * as React from "react";
import { useState } from "react";
import { NotificationBell } from "./notification-bell";
import { NotificationLedger } from "./notification-ledger";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 NOTIFICATION_GROUP_CONTROLLER (Institutional Apex v16.16.31)
 * Path: @/components/dashboard/notification-group
 * Logic: Orchestrates the state handshake between Trigger and Archive.
 */
export function NotificationGroup() {
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const { impact } = useHaptics();

  const handleOpenLedger = () => {
    // 🏁 TACTILE SYNC: Hardware confirmation for opening the ledger
    impact("medium");
    setLedgerOpen(true);
  };

  return (
    <div className="relative flex items-center">
      {/* 🛰️ THE TRIGGER */}
      <NotificationBell onClick={handleOpenLedger} />
      
      {/* 💾 THE ARCHIVE (Renders in a Portal) */}
      <NotificationLedger 
        open={ledgerOpen} 
        onOpenChange={(val) => {
          setLedgerOpen(val);
          if (!val) impact("light"); // Light tick on close
        }} 
      />
    </div>
  );
}
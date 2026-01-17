"use client";

import * as React from "react";
import { useEffect } from "react";
import { useGlobalSignal } from "@/hooks/use-global-signal";

/**
 * 📡 AUTO_SIGNAL_LISTENER (Institutional Apex v16.16.31)
 * Logic: Background event-mesh listener.
 * Priority: Bridges real-time backend signals to hardware haptics.
 */
export function AutoSignalListener() {
  const { sendSignal } = useGlobalSignal();

  useEffect(() => {
    // 🛡️ PROTOCOL_CHANNEL: Establish the secure broadcast link
    // This listens for events sent via new BroadcastChannel('zipha_telemetry')
    const telemetryChannel = new BroadcastChannel("zipha_telemetry");

    telemetryChannel.onmessage = (event) => {
      const { title, message, level, type } = event.data;

      // 🌊 AUTO_INGRESS: Staggered delay to prevent UI collision
      setTimeout(() => {
        sendSignal(
          title || "System_Update",
          message || "Telemetry node synchronized.",
          level || "INFO"
        );
        
        // 💾 Optional: Log to local storage for the Ledger history
        const logs = JSON.parse(localStorage.getItem("zipha_logs") || "[]");
        localStorage.setItem("zipha_logs", JSON.stringify([
          { id: Date.now(), title, message, level, timestamp: new Date().toISOString() },
          ...logs.slice(0, 49) // Keep last 50
        ]));
      }, 500);
    };

    return () => telemetryChannel.close();
  }, [sendSignal]);

  return null; // Silent background sentinel
}
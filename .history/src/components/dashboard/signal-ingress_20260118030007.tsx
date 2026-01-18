"use client";

import * as React from "react";
import { useGlobalSignal } from "@/lib/hooks/use-global-signal";
import { useHeartbeat } from "@/lib/hooks/use-heartbeat";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SIGNAL_INGRESS (Institutional v16.16.71)
 * Strategy: Autonomous Telemetry Observation.
 * Mission: Auto-log platform events (Auth, Network, Handshake) into the Ledger.
 */
export function SignalIngress({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { sendSignal } = useGlobalSignal();
  const { status: heartbeatStatus } = useHeartbeat(isAuthenticated);
  const { isReady } = useDeviceContext();
  
  // 🛡️ INTERNAL_REFS: Prevent duplicate signal spam
  const hasBooted = React.useRef(false);
  const lastHeartbeat = React.useRef(heartbeatStatus);

  // 🏁 1. COLD_BOOT_HANDSHAKE
  React.useEffect(() => {
    if (isReady && isAuthenticated && !hasBooted.current) {
      sendSignal(
        "Node_Ingress_Complete", 
        "Identity anchor synchronized with Mesh_Terminal.", 
        "SUCCESS"
      );
      hasBooted.current = true;
    }
  }, [isReady, isAuthenticated, sendSignal]);

  // 💓 2. HEARTBEAT_MONITORING
  React.useEffect(() => {
    if (heartbeatStatus !== lastHeartbeat.current) {
      if (heartbeatStatus === "ERROR") {
        sendSignal(
          "Pulse_Missed", 
          "Connection to platform root latent or unstable.", 
          "WARN"
        );
      }
      if (heartbeatStatus === "ACTIVE" && lastHeartbeat.current === "ERROR") {
        sendSignal(
          "Signal_Restored", 
          "Telemetry link re-established with primary node.", 
          "SUCCESS"
        );
      }
      lastHeartbeat.current = heartbeatStatus;
    }
  }, [heartbeatStatus, sendSignal]);

  // 🌐 3. NETWORK_OFFLINE_DETECTION
  React.useEffect(() => {
    const handleOffline = () => sendSignal("Hardware_Offline", "Local network adapter disconnected.", "ERROR");
    const handleOnline = () => sendSignal("Hardware_Online", "Network restoration detected.", "INFO");

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [sendSignal]);

  return null; // Logic-only component (Sentinel)
}
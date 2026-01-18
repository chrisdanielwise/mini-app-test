"use client";

import * as React from "react";
import { useGlobalSignal } from "@/lib/hooks/use-global-signal";
import { useHeartbeat } from "@/lib/hooks/use-heartbeat";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SIGNAL_INGRESS (Institutional v2026.1.18)
 * Strategy: Autonomous Telemetry & Frictionless Logging.
 * Mission: Auto-log hardware, network, and heartbeat events into the Audit Ledger.
 */
export function SignalIngress({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { sendSignal } = useGlobalSignal();
  const { status: heartbeatStatus } = useHeartbeat(isAuthenticated);
  const { isReady } = useDeviceContext();
  
  // 🛡️ INTERNAL_REFS: State tracking for stability
  const hasBooted = React.useRef(false);
  const lastHeartbeat = React.useRef(heartbeatStatus);
  const signalCooldown = React.useRef<Record<string, number>>({});

  /**
   * 🛠️ THROTLED_SIGNAL: Prevents "Log Storms" during rapid state toggles.
   * Standard Cooldown: 3000ms per event type.
   */
  const throttledSignal = React.useCallback((type: string, message: string, severity: "SUCCESS" | "WARN" | "ERROR" | "INFO") => {
    const now = Date.now();
    if (signalCooldown.current[type] && now - signalCooldown.current[type] < 3000) return;
    
    sendSignal(type, message, severity);
    signalCooldown.current[type] = now;
  }, [sendSignal]);

  // 🏁 1. COLD_BOOT_HANDSHAKE
  React.useEffect(() => {
    if (isReady && isAuthenticated && !hasBooted.current) {
      throttledSignal(
        "Node_Ingress_Complete", 
        "Identity anchor synchronized with Mesh_Terminal.", 
        "SUCCESS"
      );
      hasBooted.current = true;
    }
  }, [isReady, isAuthenticated, throttledSignal]);

  // 💓 2. HEARTBEAT_MONITORING
  React.useEffect(() => {
    if (heartbeatStatus !== lastHeartbeat.current) {
      if (heartbeatStatus === "ERROR") {
        throttledSignal(
          "Pulse_Missed", 
          "Connection to platform root latent or unstable.", 
          "WARN"
        );
      }
      if (heartbeatStatus === "ACTIVE" && lastHeartbeat.current === "ERROR") {
        throttledSignal(
          "Signal_Restored", 
          "Telemetry link re-established with primary node.", 
          "SUCCESS"
        );
      }
      lastHeartbeat.current = heartbeatStatus;
    }
  }, [heartbeatStatus, throttledSignal]);

  // 🌐 3. NETWORK & VISIBILITY PROTOCOLS
  React.useEffect(() => {
    const handleOffline = () => throttledSignal("Hardware_Offline", "Local network adapter disconnected.", "ERROR");
    const handleOnline = () => throttledSignal("Hardware_Online", "Network restoration detected.", "INFO");
    
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        throttledSignal("Node_Backgrounded", "Terminal entering dormant state.", "INFO");
      } else {
        throttledSignal("Node_Foreground", "Terminal re-establishing visual link.", "INFO");
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [throttledSignal]);

  return null; // Logic-only component (Sentinel)
}
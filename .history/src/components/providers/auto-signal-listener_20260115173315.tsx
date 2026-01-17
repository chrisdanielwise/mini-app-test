"use client";

import * as React from "react";
import { useEffect, useCallback } from "react";

// 🏛️ Institutional Contexts & Hooks
import { useGlobalSignal } from "@lib/hooks/use-global-signal";
import { useHaptics } from "@lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 📡 AUTO_SIGNAL_LISTENER (Institutional Apex v2026.1.15)
 * Aesthetics: Silent Background Mesh | Vapour-Phase Execution.
 * Logic: morphology-aware background ingress with hardware haptic bridging.
 */
export function AutoSignalListener() {
  const { sendSignal } = useGlobalSignal();
  const { notification } = useHaptics();
  const { isReady } = useDeviceContext();

  /**
   * 🌊 LAMINAR_INGRESS_PROTOCOL
   * Logic: Decouples the raw message arrival from the UI update cycle.
   */
  const processIngress = useCallback((data: any) => {
    const { title, message, level = "INFO" } = data;

    // 🏁 TACTILE BRIDGE: Trigger physical response for priority nodes
    if (level === "CRITICAL" || level === "ERROR") {
      notification("error");
    } else if (level === "WARN") {
      notification("warning");
    }

    // 🌊 UI SYNCHRONIZATION: Push to the global signal stack
    sendSignal(
      title || "System_Update",
      message || "Telemetry node synchronized.",
      level
    );

    // 💾 LEDGER PERSISTENCE: Record to institutional memory
    try {
      const logs = JSON.parse(localStorage.getItem("zipha_logs") || "[]");
      const newNode = {
        id: `LOG_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title: title || "Signal_Ingress",
        message: message || "Protocol link stable.",
        level,
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem("zipha_logs", JSON.stringify([newNode, ...logs.slice(0, 49)]));
    } catch (err) {
      console.warn("🛰️ [Ledger_Sync_Isolated]: Persistence layer full or unreachable.");
    }
  }, [sendSignal, notification]);

  useEffect(() => {
    // 🛡️ HYDRATION GUARD: Wait for hardware readiness
    if (!isReady) return;

    // 🚀 PROTOCOL_CHANNEL: Establish the multi-tab broadcast link
    const telemetryChannel = new BroadcastChannel("zipha_telemetry");

    telemetryChannel.onmessage = (event) => {
      // 🧪 VAPOUR_DELAY: Staggered ingress to prevent frame dropping
      // This ensures 60FPS smoothness if multiple signals arrive during a transition.
      requestAnimationFrame(() => {
        processIngress(event.data);
      });
    };

    return () => {
      telemetryChannel.close();
    };
  }, [isReady, processIngress]);

  return null; // Silent sentinel remains invisible to the HUD
}
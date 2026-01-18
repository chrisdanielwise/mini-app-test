"use client";

import { toast } from "sonner";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

export type SignalLevel = "SUCCESS" | "WARN" | "ERROR" | "INFO";

/**
 * 🛰️ USE_GLOBAL_SIGNAL (Hardened v16.16.70)
 * Strategy: Tactile Synchronization & Archive Ingress.
 * Mission: Broadcast UI alerts and persist them to the Node Ledger.
 */
export const useGlobalSignal = () => {
  const { notification, impact } = useHaptics();

  const sendSignal = useCallback((
    title: string, 
    description: string, 
    level: SignalLevel = "INFO"
  ) => {
    // 🏁 1. TACTILE_SYNC: Hardware-level feedback mapping
    switch (level) {
      case "SUCCESS": notification("success"); break;
      case "ERROR": notification("error"); break;
      case "WARN": notification("warning"); break;
      default: impact("medium");
    }

    // 💾 2. ARCHIVE_INGRESS: Commit to Local Node Ledger
    if (typeof window !== "undefined") {
      try {
        const existingLogs = JSON.parse(localStorage.getItem("zipha_logs") || "[]");
        const newLog = {
          id: `SIG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: title.toUpperCase(),
          message: description,
          level,
          timestamp: new Date().toISOString(),
        };
        
        // Maintain a rolling buffer of 50 logs to prevent memory bloat
        const updatedLogs = [newLog, ...existingLogs].slice(0, 50);
        localStorage.setItem("zipha_logs", JSON.stringify(updatedLogs));
      } catch (err) {
        console.warn("🛰️ [Signal_Ingress_Fault]: Buffer write failed.");
      }
    }

    // 🌊 3. UI_SYNC: Vapour-Glass Toast Rendering
    toast(title, {
      description: `[TELEMETRY_LOG]: ${description.toUpperCase()}`,
      className: cn(
        "group border-white/5 bg-zinc-950/90 backdrop-blur-3xl rounded-2xl", 
        level === "ERROR" && "border-rose-500/20 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
        level === "WARN" && "border-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
        level === "SUCCESS" && "border-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
      ),
    });
  }, [notification, impact]);

  return { sendSignal };
};
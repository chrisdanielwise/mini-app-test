"use client";

import * as React from "react";
import { useEffect } from "react";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ AUTH_SYNC_PROVIDER (Institutional Apex v2026.1.20)
 * Strategy: Cross-Tab Broadcast Sentinel & Tactical State Lock.
 * Fix: Standardized hardware-haptic mapping and clinical expulsion delays.
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { notification, impact } = useHaptics();
  const { isReady, isMobile, screenSize } = useDeviceContext();

  useEffect(() => {
    if (!isReady) return;

    // 🛡️ PROTOCOL_CHANNEL: Secure Identity Broadcast Link
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    authChannel.onmessage = (event) => {
      const { action, target } = event.data;

      // 🟢 SIGNAL: SESSION_ANCHOR (Successful Login Ingress)
      if (action === "RELOAD_SESSION") {
        // TACTILE_SYNC: Adaptation to hardware tier
        impact(isMobile ? "heavy" : "medium");
        
        toast.success("IDENTITY_SYNCHRONIZED", {
          description: "Node anchoring successful. Refreshing terminal...",
          duration: 3000,
          position: isMobile ? "top-center" : "bottom-right",
        });

        // 🌊 LAMINAR FLOW: Clinical refresh delay
        setTimeout(() => {
          window.location.href = target || "/dashboard";
        }, 1200);
      }

      // 🔴 SIGNAL: GLOBAL_REVOCATION (Security Termination)
      const isRevocation = ["GLOBAL_REVOCATION", "TERMINATE_SESSION"].includes(action);

      if (isRevocation) {
        notification("error");

        toast.error("SECURITY_REVOCATION", {
          description: `Global wipe detected on ${screenSize.toUpperCase()} hardware.`,
          duration: 5000,
          position: "top-center",
        });

        // 🛡️ HARDENED EXPULSION: Immediate State Liquidation
        setTimeout(() => {
          window.location.replace("/login?reason=identity_revoked");
        }, 1500);
      }
    };

    return () => authChannel.close();
  }, [notification, impact, isReady, isMobile, screenSize]);

  return <>{children}</>;
}
"use client";

import * as React from "react";
import { useEffect } from "react";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { cn } from "@/lib/utils";

/**
 * 🌊 AUTH_SYNC_PROVIDER (Institutional Apex v16.16.31)
 * Logic: Cross-Tab Broadcast Sentinel with Morphology-Aware Feedback.
 * Priority: Secure Identity Handover & Hardware Signal Synchronization.
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { notification, impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Detecting hardware physics for tactile response
  const { isReady, isMobile, screenSize } = useDeviceContext();

  useEffect(() => {
    if (!isReady) return;

    // 🛡️ PROTOCOL_CHANNEL: Establish the Secure Broadcast Link
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    authChannel.onmessage = (event) => {
      const { action, target, timestamp } = event.data;

      // 🟢 SIGNAL: SESSION_ANCHOR (Login Success in another tab)
      if (action === "RELOAD_SESSION") {
        // Adapt haptic intensity to device tier
        impact(isMobile ? "heavy" : "medium");
        
        toast.success("Identity Synchronized", {
          description: "Terminal anchoring successful. Refreshing node...",
          duration: 3000,
          position: isMobile ? "top-center" : "bottom-right", // 🕵️ Morphology-aware placement
        });

        // 🌊 Water Flow: 1s delay to allow toast visual to land
        setTimeout(() => {
          window.location.href = target || "/home";
        }, 1200);
      }

      // 🔴 SIGNAL: GLOBAL_REVOCATION (Logout or Security Ban)
      const isRevocation = [
        "GLOBAL_REVOCATION", 
        "TERMINATE_SESSION"
      ].includes(action);

      if (isRevocation) {
        // 🏁 TACTILE: Critical notification pattern
        notification("error");

        toast.error("Security_Revocation", {
          description: `Global wipe signal detected on ${screenSize} tier hardware.`,
          duration: 5000,
          position: "top-center",
        });

        // 🛡️ HARDENED EXPULSION: Wipe the browser and bounce to gateway
        setTimeout(() => {
          // Force a full clean redirect to clear all states
          window.location.replace("/login?reason=identity_revoked");
        }, 1500);
      }
    };

    return () => authChannel.close();
  }, [notification, impact, isReady, isMobile, screenSize]);

  return <>{children}</>;
}
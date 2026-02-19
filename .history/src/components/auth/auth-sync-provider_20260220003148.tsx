"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ AUTH_SYNC_PROVIDER (Institutional Apex v2026.1.21)
 * Strategy: Cross-Tab Broadcast Sentinel & Tactical State Lock.
 * Fix: Added Hydration Guard to prevent 'BroadcastChannel is not defined' during Render build.
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  // 🛡️ HYDRATION GUARD
  const [mounted, setMounted] = useState(false);
  
  const { notification, impact } = useHaptics();
  const { isReady, isMobile, screenSize } = useDeviceContext();

  // Set mounted true once we are safely in the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 🧱 BUILD_SHIELD: Exit if server-side or hardware context isn't ready
    if (!mounted || !isReady || typeof window === "undefined") return;

    // 🛡️ PROTOCOL_CHANNEL: Secure Identity Broadcast Link
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    authChannel.onmessage = (event) => {
      const { action, target } = event.data;

      // 🟢 SIGNAL: SESSION_ANCHOR (Successful Login Ingress)
      if (action === "RELOAD_SESSION") {
        if (impact) impact(isMobile ? "heavy" : "medium");
        
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
        if (notification) notification("error");

        toast.error("SECURITY_REVOCATION", {
          description: `Global wipe detected on ${screenSize?.toUpperCase() || 'UNKNOWN'} hardware.`,
          duration: 5000,
          position: "top-center",
        });

        // 🛡️ HARDENED EXPULSION: Immediate State Liquidation
        setTimeout(() => {
          window.location.replace("/login?reason=identity_revoked");
        }, 1500);
      }
    };

    return () => {
      if (authChannel) authChannel.close();
    };
  }, [notification, impact, isReady, isMobile, screenSize, mounted]);

  return <>{children}</>;
}
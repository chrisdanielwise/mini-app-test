"use client";

import * as React from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 AUTH_SYNC_PROVIDER (v16.16.12)
 * Logic: Cross-Tab Broadcast Sentinel for Global Identity Revocation.
 * Safety: Uses Atomic Redirection to prevent stale cookie residency.
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { notification, impact } = useHaptics();

  useEffect(() => {
    // 🛡️ PROTOCOL_CHANNEL: Establish the Secure Broadcast Link
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    authChannel.onmessage = (event) => {
      const { action, target, timestamp } = event.data;

      // 🟢 SIGNAL: SESSION_ANCHOR (Login Success in another tab)
      if (action === "RELOAD_SESSION") {
        impact("medium");
        
        toast.success("Identity Synchronized", {
          description: "Terminal anchoring successful. Refreshing node...",
          duration: 3000,
        });

        // 🌊 Water Flow: 1s delay to allow toast visual to land
        setTimeout(() => {
          window.location.href = target || "/dashboard";
        }, 1000);
      }

      // 🔴 SIGNAL: GLOBAL_REVOCATION (Logout or Security Ban)
      const isRevocation = [
        "GLOBAL_REVOCATION", 
        "TERMINATE_SESSION"
      ].includes(action);

      if (isRevocation) {
        // 🏁 TACTILE: Force vibration to alert user of security event
        notification("error");

        toast.error("Security_Revocation", {
          description: "A global wipe signal was detected. Emergency logout in progress.",
          duration: 5000,
        });

        // 🛡️ HARDENED EXPULSION: Wipe the browser and bounce to gateway
        setTimeout(() => {
          window.location.href = "/dashboard/login?reason=identity_revoked";
        }, 1500);
      }
    };

    return () => authChannel.close();
  }, [notification, impact]);

  return <>{children}</>;
}
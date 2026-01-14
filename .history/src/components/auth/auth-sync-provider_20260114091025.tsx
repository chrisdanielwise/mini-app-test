"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * 🛰️ AUTH_SYNC_PROVIDER (v14.90.0)
 * Logic: Global Broadcast Listener for Cross-Tab Identity Anchoring & Revocation.
 * Standard: 2026 Institutional Handshake Protocol.
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // 1. 🛰️ INITIALIZE THE SECURE CHANNEL
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    // 2. 👂 DEFINE THE SIGNAL HANDLER
    authChannel.onmessage = (event) => {
      const { action, target, timestamp } = event.data;

      // 🟢 SCENARIO: SUCCESSFUL LOGIN / IDENTITY ANCHOR
      if (action === "RELOAD_SESSION") {
        console.log(`✅ [Sync_Node]: Identity signal received at ${timestamp}`);
        
        toast.success("Identity Synchronized", {
          description: "Session anchored. Refreshing secure terminal...",
          duration: 3000,
        });

        // Atomic Reload to pick up new HttpOnly cookies via Middleware
        setTimeout(() => {
          window.location.href = target || "/dashboard";
        }, 1000);
      }

      // 🔴 SCENARIO: REMOTE WIPE / GLOBAL REVOCATION
      if (action === "GLOBAL_REVOCATION" || action === "TERMINATE_SESSION") {
        console.warn(`🚨 [Security_Sentinel]: Revocation signal detected.`);

        toast.error("Security Protocol Triggered", {
          description: "All active sessions have been force-disconnected.",
          duration: 5000,
        });

        // Force immediate expulsion to the login gateway
        setTimeout(() => {
          window.location.href = "/dashboard/login?reason=identity_revoked";
        }, 1500);
      }
    };

    // 🧹 CLEANUP: Terminate channel on unmount
    return () => authChannel.close();
  }, [router]);

  return <>{children}</>;
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Or your preferred toast library

/**
 * 🛰️ AUTH_SYNC_PROVIDER (v14.70.0)
 * Logic: Global Broadcast Listener for Cross-Tab Identity Anchoring.
 * Standard: 2026 Institutional Handshake.
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // 1. Initialize the Secure Channel
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    // 2. Define the Sync Handler
    authChannel.onmessage = (event) => {
      const { action, target, timestamp } = event.data;

      if (action === "RELOAD_SESSION") {
        console.log(`✅ [Sync_Node]: Identity signal received at ${timestamp}`);
        
        // 🚀 TACTILE FEEDBACK
        toast.success("Identity Synchronized", {
          description: "Your session is now active. Refreshing terminal...",
          duration: 2000,
        });

        // 🚀 ATOMIC RELOAD
        // We use window.location.href to force a hard reload of the 
        // middleware/session, ensuring the new cookie is read correctly.
        setTimeout(() => {
          window.location.href = target || window.location.pathname;
        }, 800);
      }
    };

    return () => authChannel.close();
  }, [router]);

  return <>{children}</>;
}
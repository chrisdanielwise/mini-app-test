"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 

/**
 * 🛰️ AUTH_SYNC_PROVIDER (v14.75.0)
 * Logic: Global Broadcast Listener for Cross-Tab Identity Anchoring.
 * Purpose: Ensures Tab A (original tab) automatically logs in when Tab B (Telegram tab) finishes.
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // 1. 🛰️ INITIALIZE THE SECURE CHANNEL
    // This name MUST match the BroadcastChannel in your Callback Page exactly.
    const authChannel = new BroadcastChannel("zipha_auth_sync");

    // 2. 👂 DEFINE THE SIGNAL HANDLER
    authChannel.onmessage = (event) => {
      const { action, target, timestamp } = event.data;

      if (action === "RELOAD_SESSION") {
        console.log(`✅ [Sync_Node]: Identity signal received at ${timestamp}`);
        
        // 🚀 TACTILE FEEDBACK: Alert the user the login succeeded in the background.
        toast.success("Identity Synchronized", {
          description: "Session anchored. Refreshing secure terminal...",
          duration: 3000,
        });

        // 🚀 ATOMIC RELOAD
        // We use window.location.href instead of router.push.
        // WHY? A hard reload ensures the browser sends the NEW cookies to the server,
        // allowing the Middleware to verify your role and grant access to /dashboard.
        setTimeout(() => {
          window.location.href = target || "/dashboard";
        }, 1000);
      }
    };

    // 🧹 CLEANUP: Close the channel when the component unmounts.
    return () => authChannel.close();
  }, [router]);

  return <>{children}</>;
}
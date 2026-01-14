"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type HeartbeatStatus = "ACTIVE" | "SYNCING" | "ERROR";

/**
 * 💓 SLIDING SESSION HEARTBEAT (v15.9.8)
 * Logic: Extends session window and provides live health status to the NavGuard.
 * Termination: If Security Stamp mismatches, it triggers a hard logout.
 */
export function useHeartbeat(isAuthenticated: boolean) {
  const router = useRouter();
  const [status, setStatus] = useState<HeartbeatStatus>("SYNCING");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus("ERROR");
      return;
    }

    const performHeartbeat = async () => {
      setStatus("SYNCING"); // Indicate an active check is in progress

      try {
        const res = await fetch("/api/auth/heartbeat", { 
          method: "POST",
          headers: { "Cache-Control": "no-cache" }
        });

        if (res.ok) {
          // ✅ HEARTBEAT SUCCESSFUL
          setStatus("ACTIVE");
          console.log("💓 [Heartbeat]: Security stamp verified.");
        } else if (res.status === 401 || res.status === 403) {
          // 🚨 IDENTITY REVOKED OR EXPIRED
          setStatus("ERROR");
          toast.error("SESSION_TERMINATED: Identity node de-synchronized.", {
            description: "Security stamp mismatch. Please re-authenticate."
          });
          
          // Force back to login
          router.replace("/dashboard/login?reason=session_expired");
          router.refresh();
        } else {
          setStatus("ERROR");
        }
      } catch (err) {
        // Network congestion shouldn't necessarily kill the session immediately
        console.warn("💓 [Heartbeat_Missed]: Network congestion or node timeout.");
        setStatus("ERROR");
      }
    };

    // 1. Initial pulse on mount
    performHeartbeat();

    // 2. Set 15-minute cycle (900,000ms)
    intervalRef.current = setInterval(performHeartbeat, 15 * 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, router]);

  // Return the status so components can react to it
  return { status };
}
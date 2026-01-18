"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type HeartbeatStatus = "ACTIVE" | "SYNCING" | "ERROR";

/**
 * 💓 SLIDING SESSION HEARTBEAT (Institutional v16.16.62)
 * Strategy: Security Stamp Validation & Linear Back-off.
 * Mission: Identity Anchor preservation and Remote Wipe capability.
 */
export function useHeartbeat(isAuthenticated: boolean) {
  const router = useRouter();
  const [status, setStatus] = useState<HeartbeatStatus>("SYNCING");
  const retryCount = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const performHeartbeat = useCallback(async () => {
    // 🛡️ AUTH_SHIELD: Prevent unnecessary signal noise if unauthenticated
    if (!isAuthenticated) return;
    
    setStatus("SYNCING");

    try {
      const res = await fetch("/api/auth/heartbeat", { 
        method: "POST",
        headers: { 
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "X-Telemetry-Pulse": Date.now().toString()
        }
      });

      if (res.ok) {
        setStatus("ACTIVE");
        retryCount.current = 0; // 🔄 RESET: Clear back-off on successful handshake
      } else if (res.status === 401 || res.status === 403) {
        // 🚨 CRITICAL: Identity Anchor Revoked (Security Handshake Failed)
        setStatus("ERROR");
        toast.error("IDENTITY_REVOKED", {
          description: "Security stamp mismatch. Voiding all active nodes."
        });
        
        // 🏁 REMOTE_WIPE: Clear local state and force hardware redirection
        window.location.replace("/login?reason=session_expired");
      } else {
        throw new Error("NODE_UNREACHABLE");
      }
    } catch (err) {
      console.warn("💓 [Heartbeat]: Pulse missed. Engaging back-off protocol.");
      setStatus("ERROR");
      
      // 🚀 FLUID RECOVERY: Retry logic for network instability
      if (retryCount.current < 3) {
        retryCount.current += 1;
        const backoffDelay = retryCount.current * 30000; // Linear back-off (30s, 60s, 90s)
        setTimeout(performHeartbeat, backoffDelay);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus("ERROR");
      return;
    }

    // 🏎️ INITIAL INGRESS
    performHeartbeat();

    // ⏲️ EPOCH_INTERVAL: 15-minute rotation for standard security stamps
    intervalRef.current = setInterval(performHeartbeat, 15 * 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, performHeartbeat]);

  return { status };
}
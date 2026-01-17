"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";

export type HeartbeatStatus = "ACTIVE" | "SYNCING" | "ERROR";

/**
 * 💓 SLIDING SESSION HEARTBEAT (Institutional v16.16.12)
 * Logic: Security Stamp Validation with Linear Back-off.
 * Standards: v9.4.4 Security (Handshake), v9.5.8 (Fluid Recovery).
 */
export function useHeartbeat(isAuthenticated: boolean) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<HeartbeatStatus>("SYNCING");
  const retryCount = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const performHeartbeat = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setStatus("SYNCING");

    try {
      const res = await fetch("/api/auth/heartbeat", { 
        method: "POST",
        headers: { 
          "Cache-Control": "no-cache",
          "Pragma": "no-cache" 
        }
      });

      if (res.ok) {
        setStatus("ACTIVE");
        retryCount.current = 0; // Reset back-off on success
      } else if (res.status === 401 || res.status === 403) {
        // 🚨 CRITICAL: Identity Anchor Revoked (Remote Wipe Triggered)
        setStatus("ERROR");
        toast({
          variant: "destructive",
          title: "IDENTITY_REVOKED",
          description: "Security stamp mismatch. Voiding all active nodes."
        });
        
        // Hard Reset: Clears React state and redirects
        window.location.replace("/login?reason=session_expired");
      } else {
        throw new Error("NODE_UNREACHABLE");
      }
    } catch (err) {
      console.warn("💓 [Heartbeat]: Pulse missed. Engaging back-off.");
      setStatus("ERROR");
      
      // 🚀 FLUID RECOVERY: Retry sooner if it's a network glitch
      if (retryCount.current < 3) {
        retryCount.current += 1;
        setTimeout(performHeartbeat, 30000); // Retry in 30s
      }
    }
  }, [isAuthenticated, toast]);

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus("ERROR");
      return;
    }

    performHeartbeat();
    intervalRef.current = setInterval(performHeartbeat, 15 * 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, performHeartbeat]);

  return { status };
}
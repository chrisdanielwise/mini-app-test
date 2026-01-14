"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * 💓 SLIDING SESSION HEARTBEAT
 * Logic: Extends session window every 15 mins while user is active.
 * Termination: If Security Stamp mismatches, it nukes the local state.
 */
export function useHeartbeat(isAuthenticated: boolean) {
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const performHeartbeat = async () => {
      try {
        const res = await fetch("/api/auth/heartbeat", { 
          method: "POST",
          headers: { "Cache-Control": "no-cache" }
        });

        if (res.status === 401 || res.status === 403) {
          // 🚨 IDENTITY REVOKED OR EXPIRED
          toast.error("SESSION_TERMINATED: Identity node de-synchronized.");
          router.replace("/dashboard/login");
          router.refresh();
        }
      } catch (err) {
        console.warn("💓 [Heartbeat_Missed]: Network congestion or node timeout.");
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
}
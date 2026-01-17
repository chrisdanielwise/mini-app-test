"use client";

import useSWR, { type SWRConfiguration, mutate as globalMutate } from "swr";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useCallback } from "react";

/**
 * 🛰️ INSTITUTIONAL FETCHER (v16.16.12)
 * Logic: Universal Ingress with Maintenance & RBAC Gating.
 */
const institutionalFetcher = async (url: string, securityStamp: string) => {
  const res = await fetch(url, {
    headers: { 
      "Content-Type": "application/json",
      "x-security-stamp": securityStamp || "" // 🛡️ v9.4.4 Guard
    },
  });

  // 🛠️ 503 MAINTENANCE CIRCUIT BREAKER
  if (res.status === 503) {
    const data = await res.json();
    window.location.replace(`/maintenance?message=${encodeURIComponent(data.message || "Node_Offline")}`);
    throw new Error("MAINTENANCE");
  }

  // 🔐 401 UNAUTHORIZED / WIPED
  if (res.status === 401) {
    window.location.replace(`/login?reason=session_expired&redirect=${encodeURIComponent(window.location.pathname)}`);
    throw new Error("UNAUTHORIZED");
  }

  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(result.error || "FETCH_FAILED");
  
  return result.data;
};

/**
 * 🎣 useTelemetry (Atomic SWR)
 * Optimized for Dashboard Stats and Real-time Telemetry.
 */
export function useTelemetry<T>(url: string | null, config?: SWRConfiguration) {
  const { auth } = useTelegramContext();
  
  const { data, error, mutate, isLoading } = useSWR<T>(
    url ? [url, auth.user?.securityStamp] : null,
    ([u, s]: [string, string]) => institutionalFetcher(u, s),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      shouldRetryOnError: (err) => !["UNAUTHORIZED", "MAINTENANCE"].includes(err.message),
      ...config,
    }
  );

  return { data, error, isLoading, refresh: mutate };
}

/**
 * 🚀 TACTICAL MUTATOR
 * Merged Mutation Protocol with Unified Haptics.
 */
export function useMutation() {
  const { auth } = useTelegramContext();
  const { notification, impact } = useHaptics();

  const trigger = useCallback(async (
    url: string, 
    method: "POST" | "PUT" | "DELETE" = "POST", 
    body?: object
  ) => {
    impact("light");

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "x-security-stamp": auth.user?.securityStamp || "" 
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.status === 401) {
        notification("error");
        window.location.replace("/login?reason=session_expired");
        return;
      }

      const result = await res.json();
      if (!res.ok || result.success === false) {
        notification("error");
        throw new Error(result.error || "ACTION_FAILED");
      }

      notification("success");
      return result.data;
    } catch (err: any) {
      console.error("🔥 [Mutation_Crash]:", err.message);
      throw err;
    }
  }, [auth.user?.securityStamp, notification, impact]);

  return { trigger };
}
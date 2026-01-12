"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ IDENTITY RECOVERY: getToken
 * Hardened: Strictly returns Bearer JWT from LocalNode.
 */
const getToken = () => {
  if (typeof window === "undefined") return null;
  const jwt = localStorage.getItem("auth_token");
  if (jwt) return { type: "Bearer", value: jwt };
  return null;
};

/**
 * 🛰️ TELEMETRY FETCHER
 * Logic: Implements a "Silent Stand-down" protocol.
 * Fixed: Removed hard redirects to prevent Next.js 15 Hydration Storms.
 */
async function fetcher<T>(url: string): Promise<T | null> {
  const auth = getToken();
  
  // 🛡️ PASSIVE GUARD: If no JWT exists, we return null immediately.
  // This prevents SWR from entering an error/retry loop while the 
  // TelegramProvider is still conducting the initial handshake.
  if (!auth?.value) return null;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${auth.type} ${auth.value}`,
      },
    });

    // 🛡️ 401 RECOVERY: SILENT EVIVAL
    // We clear the token but DO NOT redirect here. 
    // The 'TelegramProvider' or 'NavGuard' will detect the lack of state 
    // and handle the UI transition safely after hydration is complete.
    if (response.status === 401) {
      console.warn("🛰️ [API] Node Unauthorized. Evicting JWT.");
      localStorage.removeItem("auth_token");
      return null; 
    }

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "FETCH_FAILED");
    }

    return result.data;
  } catch (err) {
    console.error("🔥 [Fetcher_Crash]:", err);
    throw err;
  }
}

/**
 * 🛰️ useApi HOOK (Apex Tier)
 * Logic: Key is set to null if no token exists, preventing early execution.
 * Scaling: 10s deduplication protects Neon database from 1M-user fetch storms.
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  // Check token existence to prevent SWR from even attempting a call
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem("auth_token");

  const { data, error, mutate, isLoading, isValidating } = useSWR<T | null>(
    hasToken ? url : null, 
    fetcher, 
    {
      revalidateOnFocus: false, // Prevents battery drain in Telegram
      shouldRetryOnError: false, // Prevents infinite loop on network failure
      dedupingInterval: 10000,   // ⚡ 10s cache for 1M user scale
      ...config,
    }
  );

  return {
    data,
    error,
    isLoading: isLoading || (!data && !error && hasToken),
    isValidating,
    refresh: () => mutate(),
  };
}

/**
 * 🛰️ MUTATION PROTOCOL: apiMutation
 * Tactile-aware state updates with multi-stage haptic confirmation.
 */
async function apiMutation<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: object
): Promise<T> {
  const auth = getToken();
  
  // Tactical Handshake: Visual/Physical feedback
  hapticFeedback("light"); 

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: `${auth.type} ${auth.value}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    localStorage.removeItem("auth_token");
    // Mutations are user-triggered (not auto-triggered), 
    // so a hard refresh here is safer than in a GET fetcher.
    if (typeof window !== "undefined") window.location.reload();
    throw new Error("UNAUTHORIZED");
  }

  const result = await response.json();
  if (!response.ok || !result.success) {
    hapticFeedback("error");
    throw new Error(result.error || `${method}_FAILED`);
  }

  hapticFeedback("success"); 
  return result.data;
}

export const apiPost = <T>(url: string, body: object) => apiMutation<T>(url, "POST", body);
export const apiPut = <T>(url: string, body: object) => apiMutation<T>(url, "PUT", body);
export const apiDelete = <T>(url: string) => apiMutation<T>(url, "DELETE");
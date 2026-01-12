"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ IDENTITY RECOVERY: getToken
 * Hardened: Strictly returns Bearer JWT. 
 * We leave the Telegram InitData exchange to the TelegramProvider 
 * to ensure we never hammer the API with un-exchanged raw data.
 */
const getToken = () => {
  if (typeof window === "undefined") return null;
  const jwt = localStorage.getItem("auth_token");
  if (jwt) return { type: "Bearer", value: jwt };
  return null;
};

/**
 * 🛰️ TELEMETRY FETCHER
 * Logic: Implements a "Silent Stand-down" to prevent 401 refresh storms.
 */
async function fetcher<T>(url: string): Promise<T> {
  const auth = getToken();
  
  // 🛡️ AUTH GUARD: If no JWT exists, we return a pending promise.
  // This keeps SWR in 'loading' state instead of 'error' state, 
  // preventing the retry loop while the Telegram Handshake is in progress.
  if (!auth?.value) {
    return new Promise(() => {}); 
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${auth.type} ${auth.value}`,
    },
  });

  // 🛡️ 401 RECOVERY: Only clear and redirect if the session is genuinely dead
  if (response.status === 401) {
    console.warn("🛰️ [API] Session Unauthorized. Evicting node.");
    localStorage.removeItem("auth_token");
    // Redirect to login to force a fresh Telegram Handshake
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard/login?reason=session_expired";
    }
    throw new Error("UNAUTHORIZED");
  }

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "FETCH_FAILED");
  }

  return result.data;
}

/**
 * 🛰️ useApi HOOK (Hardened)
 * Logic: Key is set to null if no token exists, preventing SWR from 
 * triggering before the user identity is established.
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  const tokenExists = typeof window !== 'undefined' && !!localStorage.getItem("auth_token");

  const { data, error, mutate, isLoading, isValidating } = useSWR<T>(
    tokenExists ? url : null, // 🛡️ CONDITIONAL KEYING
    fetcher, 
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      dedupingInterval: 10000, // ⚡ 10s deduplication for stability
      ...config,
    }
  );

  return {
    data,
    error,
    isLoading: isLoading || (!data && !error),
    isValidating,
    refresh: () => mutate(),
  };
}

/**
 * 🛰️ MUTATION PROTOCOL: apiMutation
 * Tactile-aware state updates with internal haptic triggers.
 */
async function apiMutation<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: object
): Promise<T> {
  const auth = getToken();
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
    window.location.href = "/dashboard/login?reason=session_expired";
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
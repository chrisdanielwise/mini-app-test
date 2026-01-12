"use client";

import useSWR, { type SWRConfiguration, mutate } from "swr";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ IDENTITY RECOVERY: getToken
 * Priority 1: Secure LocalStorage JWT (Staff/Session)
 * Priority 2: Telegram Native InitData (Silent Handshake)
 */
const getToken = () => {
  if (typeof window === "undefined") return null;
  const jwt = localStorage.getItem("auth_token");
  if (jwt) return { type: "Bearer", value: jwt };
  
  const tgData = window.Telegram?.WebApp?.initData;
  if (tgData) return { type: "tma", value: tgData };
  
  return null;
};

/**
 * 🛰️ TELEMETRY FETCHER
 * Optimized for high-fidelity JSON parsing and 401 recovery.
 */
async function fetcher<T>(url: string): Promise<T> {
  const auth = getToken();
  if (!auth?.value) throw new Error("WAITING_FOR_AUTH");

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${auth.type} ${auth.value}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("auth_token");
    throw new Error("UNAUTHORIZED");
  }

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "FETCH_FAILED");
  }

  return result.data;
}

/**
 * 🛰️ useApi HOOK (Apex Tier)
 * Global state management for data fetching.
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  const { data, error, mutate, isLoading, isValidating } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 5000, // ⚡ Prevents redundant cluster calls
    ...config,
  });

  return {
    data,
    error,
    isLoading,
    isValidating,
    refresh: () => mutate(), // Manual node refresh
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
  hapticFeedback("light"); // ⚡ Physical feedback on intent

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
    throw new Error("UNAUTHORIZED");
  }

  const result = await response.json();
  if (!response.ok || !result.success) {
    hapticFeedback("error");
    throw new Error(result.error || `${method}_FAILED`);
  }

  hapticFeedback("success"); // ⚡ Physical feedback on commit
  return result.data;
}

export const apiPost = <T>(url: string, body: object) => apiMutation<T>(url, "POST", body);
export const apiPut = <T>(url: string, body: object) => apiMutation<T>(url, "PUT", body);
export const apiDelete = <T>(url: string) => apiMutation<T>(url, "DELETE");
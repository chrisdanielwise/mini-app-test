"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ TELEMETRY FETCHER
 * Logic: Relies on browser-managed Cookies (auth_token).
 * Hardened: No manual JWT attachment needed for internal proxy routes.
 */
async function fetcher<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      // 🚀 IMPORTANT: Cookies are sent automatically if same-origin
    });

    if (response.status === 401) {
      console.warn("🛰️ [API] Session Unauthorized or Expired.");
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

export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  const { data, error, mutate, isLoading, isValidating } = useSWR<T | null>(
    url, 
    fetcher, 
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      dedupingInterval: 10000,
      ...config,
    }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    refresh: () => mutate(),
  };
}

/**
 * 🛰️ MUTATION PROTOCOL: apiMutation
 */
async function apiMutation<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: object
): Promise<T> {
  hapticFeedback("light"); 

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    // Force a reload so the proxy.ts can handle the redirect to login
    if (typeof window !== "undefined") window.location.href = "/dashboard/login?reason=session_expired";
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
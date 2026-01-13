"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ TELEMETRY FETCHER (Institutional v13.5.0)
 * Standard: Relies on HttpOnly Cookies for automatic credential injection.
 * Logic: Returns null on 401 to prevent SWR from retrying dead sessions.
 */
async function fetcher<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      // 🚀 2026 Standard: 'include' credentials ensures cookies are sent 
      // even if the Telegram Mini App is running on a different subdomain.
      credentials: "include", 
    });

    if (response.status === 401) {
      console.warn("🛰️ [Telemetry] Ingress Denied: Session Expired.");
      throw new Error("UNAUTHORIZED");
    }

    const result = await response.json();
    
    // Support for standard API response wrapping
    if (!response.ok || (result.success === false)) {
      throw new Error(result.error || "FETCH_FAILED");
    }

    // Return result.data if it exists, otherwise return the whole object
    return result.data !== undefined ? result.data : result;
  } catch (err) {
    console.error("🔥 [Telemetry_Crash]:", err);
    throw err;
  }
}

/**
 * 🎣 USE_API HOOK
 * Optimized for Next.js 16 / TMA Hybrid Environments.
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  const { data, error, mutate, isLoading, isValidating } = useSWR<T | null>(
    url, 
    fetcher, 
    {
      revalidateOnFocus: false, // Prevents focus-loops in Telegram frames
      shouldRetryOnError: (err) => err.message !== "UNAUTHORIZED", 
      dedupingInterval: 5000,
      ...config,
    }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    refresh: () => mutate(),
    isUnauthorized: error?.message === "UNAUTHORIZED",
  };
}

/**
 * 🛰️ MUTATION PROTOCOL: apiMutation
 * Logic: Unified Haptic Feedback & Redirect on Auth Failure.
 */
async function apiMutation<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: object
): Promise<T> {
  // 📳 Haptic trigger for tactile confirmation
  hapticFeedback("impact", "light"); 

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include", // 🚀 Required for Cookie injection
    });

    if (response.status === 401) {
      hapticFeedback("notification", "error");
      
      // 🛡️ SECURITY: Hard redirect for browser users if session dies
      if (typeof window !== "undefined") {
        window.location.href = "/login?reason=session_expired";
      }
      throw new Error("UNAUTHORIZED");
    }

    const result = await response.json();
    if (!response.ok || (result.success === false)) {
      hapticFeedback("notification", "error");
      throw new Error(result.error || `${method}_FAILED`);
    }

    hapticFeedback("notification", "success"); 
    return result.data !== undefined ? result.data : result;
  } catch (err) {
    console.error(`🔥 [Mutation_Crash] ${method} ${url}:`, err);
    throw err;
  }
}

export const apiPost = <T>(url: string, body: object) => apiMutation<T>(url, "POST", body);
export const apiPut = <T>(url: string, body: object) => apiMutation<T>(url, "PUT", body);
export const apiDelete = <T>(url: string) => apiMutation<T>(url, "DELETE");
"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ TELEMETRY FETCHER
 * Standard: Relies on HttpOnly Cookies for automatic credential injection.
 * Logic: Returns null on 401 to prevent SWR from retrying dead sessions.
 */
async function fetcher<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      // 🚀 Standard: Cookies are sent automatically if same-origin.
      // No manual 'Bearer' token attachment required.
    });

    if (response.status === 401) {
      console.warn("🛰️ [Telemetry] Ingress Denied: Session Expired.");
      // We throw a specific error string so the hook can catch it.
      throw new Error("UNAUTHORIZED");
    }

    const result = await response.json();
    
    // Check for both HTTP status and API-level success flag
    if (!response.ok || !result.success) {
      throw new Error(result.error || "FETCH_FAILED");
    }

    return result.data;
  } catch (err) {
    console.error("🔥 [Telemetry_Crash]:", err);
    throw err;
  }
}

/**
 * 🎣 USE_API HOOK
 * Optimized for Next.js 16 / Turbopack environments.
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  const { data, error, mutate, isLoading, isValidating } = useSWR<T | null>(
    url, 
    fetcher, 
    {
      revalidateOnFocus: false, // Standard for Mini Apps (focus is unreliable in frames)
      shouldRetryOnError: (err) => err.message !== "UNAUTHORIZED", // Stop retrying if logged out
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
    isUnauthorized: error?.message === "UNAUTHORIZED",
  };
}

/**
 * 🛰️ MUTATION PROTOCOL: apiMutation
 * Logic: Triggers Haptic Feedback for physical interaction confirmation.
 */
async function apiMutation<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: object
): Promise<T> {
  // 📳 Impact feedback as soon as the user taps the action
  hapticFeedback("impact", "light"); 

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      hapticFeedback("notification", "error");
      // Hard redirect to clear the UI state and let proxy.ts take control
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard/login?reason=session_expired";
      }
      throw new Error("UNAUTHORIZED");
    }

    const result = await response.json();
    if (!response.ok || !result.success) {
      hapticFeedback("notification", "error");
      throw new Error(result.error || `${method}_FAILED`);
    }

    // 📳 Confirmation feedback on successful network commit
    hapticFeedback("notification", "success"); 
    return result.data;
  } catch (err) {
    console.error(`🔥 [Mutation_Crash] ${method} ${url}:`, err);
    throw err;
  }
}

export const apiPost = <T>(url: string, body: object) => apiMutation<T>(url, "POST", body);
export const apiPut = <T>(url: string, body: object) => apiMutation<T>(url, "PUT", body);
export const apiDelete = <T>(url: string) => apiMutation<T>(url, "DELETE");
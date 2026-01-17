"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ TELEMETRY FETCHER (Institutional v16.16.0)
 * Logic: Handles 401 (Auth), 503 (Maintenance), and Standard Data Egress.
 */
async function fetcher<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
    });

    // 🛠️ MAINTENANCE INTERCEPTOR
    if (response.status === 503) {
      const data = await response.json();
      if (typeof window !== "undefined") {
        window.location.href = `/maintenance?message=${encodeURIComponent(data.message || "Node offline.")}`;
      }
      throw new Error("MAINTENANCE");
    }

    if (response.status === 401) {
      console.warn("🛰️ [Telemetry] Ingress Denied: Session Expired.");
      throw new Error("UNAUTHORIZED");
    }

    const result = await response.json();
    
    // Support for institutional success/error wrapping
    if (!response.ok || (result.success === false)) {
      throw new Error(result.error || "FETCH_FAILED");
    }

    return result.data !== undefined ? result.data : result;
  } catch (err) {
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
      revalidateOnFocus: false, 
      // 🚀 Only retry if it's a network error, not a security/maintenance block
      shouldRetryOnError: (err) => !["UNAUTHORIZED", "MAINTENANCE"].includes(err.message), 
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
    isMaintenance: error?.message === "MAINTENANCE",
  };
}

/**
 * 🛰️ MUTATION PROTOCOL
 * Logic: Unified Haptic Feedback & Precision Redirects.
 */
async function apiMutation<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: object
): Promise<T> {
  hapticFeedback("impact", "light"); 

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (response.status === 401) {
      hapticFeedback("notification", "error");
      
      if (typeof window !== "undefined") {
        // 🚀 PRECISION: Capture current path for the redirect loop
        const currentPath = window.location.pathname;
        window.location.href = `/login?reason=session_expired&redirect=${encodeURIComponent(currentPath)}`;
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
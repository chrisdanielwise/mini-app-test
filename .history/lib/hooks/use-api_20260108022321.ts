"use client";

import useSWR, { type SWRConfiguration } from "swr";

/**
 * Retrieves the authentication token.
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
 * Standard fetcher for SWR
 */
async function fetcher<T>(url: string): Promise<T> {
  const auth = getToken();

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: `${auth.type} ${auth.value}` }),
    },
  });

  // Handle Session Expiry (401)
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      // Clear the stale JWT
      localStorage.removeItem("auth_token");
      console.warn("[API] Bearer token expired. System will attempt TMA fallback.");
    }
    
    // We throw a specific string to let SWR know this is an auth failure
    throw new Error("UNAUTHORIZED");
  }

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error("Failed to parse server response");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data.data;
}

/**
 * Hook for GET requests using SWR
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false, 
    errorRetryCount: 1,
    // FIX: This stops the infinite refresh loop
    shouldRetryOnError: (err) => {
      if (err.message === "UNAUTHORIZED") return false;
      return true;
    },
    ...config,
  });
}

[Image of OAuth 2.0 flow with JWT]

/**
 * Generic Fetch Wrapper for Mutations
 */
async function apiMutation<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: object
): Promise<T> {
  const auth = getToken();

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: `${auth.type} ${auth.value}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") localStorage.removeItem("auth_token");
    throw new Error("UNAUTHORIZED");
  }

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || `${method} request failed`);
  }

  return data.data;
}

export const apiPost = <T>(url: string, body: object) =>
  apiMutation<T>(url, "POST", body);

export const apiPut = <T>(url: string, body: object) =>
  apiMutation<T>(url, "PUT", body);

export const apiDelete = <T>(url: string) => apiMutation<T>(url, "DELETE");
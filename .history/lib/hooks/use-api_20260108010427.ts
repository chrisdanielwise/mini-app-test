"use client";

import useSWR, { type SWRConfiguration } from "swr";

/**
 * Retrieves the authentication token.
 * Preference:
 * 1. Stored JWT (auth_token)
 * 2. Raw Telegram InitData (if no JWT yet)
 */
const getToken = () => {
  if (typeof window === "undefined") return null;

  // Try to get the session JWT first
  const jwt = localStorage.getItem("auth_token");
  if (jwt) return { type: "Bearer", value: jwt };

  // Fallback to raw Telegram data if JWT isn't set yet (initial login)
  const tgData = window.Telegram?.WebApp?.initData;
  if (tgData) return { type: "tma", value: tgData };

  return null;
};

async function fetcher<T>(url: string): Promise<T> {
  const auth = getToken();

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: `${auth.type} ${auth.value}` }),
    },
  });

  // Handle common status codes before parsing JSON
  if (response.status === 401) {
    // Optional: redirect to login or trigger refresh logic
    console.error("[API] Session expired or unauthorized");
  }

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data.data;
}

export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false, // Prevents infinite loops on 401s
    ...config,
  });
}

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

"use client";

import useSWR, { type SWRConfiguration } from "swr";

/**
 * Retrieves the authentication token.
 * We prioritize the JWT for performance, falling back to InitData for the initial login.
 */
const getToken = () => {
  if (typeof window === "undefined") return null;

  // Try to get the session JWT first
  const jwt = localStorage.getItem("auth_token");
  if (jwt) return { type: "Bearer", value: jwt };

  // Fallback to raw Telegram data if JWT isn't set yet (initial login/handshake)
  const tgData = window.Telegram?.WebApp?.initData;
  if (tgData) return { type: "tma", value: tgData };

  return null;
};

/**
 * Image of the Telegram Mini App Authentication flow showing initData verification between Telegram Client and Backend
 */


/**
 * Standard fetcher for SWR
 * Handles 401 Unauthorized by clearing stale sessions and throwing specific errors
 */
async function fetcher<T>(url: string): Promise<T> {
  const auth = getToken();

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: `${auth.type} ${auth.value}` }),
    },
  });

  // Handle Session Expiry or Unauthorized Access
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    console.error("[API] Session expired or unauthorized");
    throw new Error("UNAUTHORIZED");
  }

  // PRISMA 7 Serialization Safety:
  // We parse the response as text first to handle empty responses or invalid JSON
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

  // Our standardized API format returns data inside a 'data' property
  return data.data;
}

/**
 * Hook for GET requests using SWR
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false, // Recommended for TMA to prevent flicker on chat switches
    shouldRetryOnError: false, // Prevents infinite loops on 401s
    errorRetryCount: 1,
    ...config,
  });
}

/**
 * Image of OAuth 2.0 flow with JWT
 */


/**
 * Generic Fetch Wrapper for Mutations (POST, PUT, DELETE)
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

  // Consistent 401 handling for mutations
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    console.error("[API] Session expired or unauthorized");
    throw new Error("UNAUTHORIZED");
  }

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || `${method} request failed`);
  }

  return data.data;
}

// Exported mutation helpers
export const apiPost = <T>(url: string, body: object) =>
  apiMutation<T>(url, "POST", body);

export const apiPut = <T>(url: string, body: object) =>
  apiMutation<T>(url, "PUT", body);

export const apiDelete = <T>(url: string) => 
  apiMutation<T>(url, "DELETE");
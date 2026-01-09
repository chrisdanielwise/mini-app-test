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

  // Fallback to raw Telegram data if JWT isn't set yet (initial login)
  const tgData = window.Telegram?.WebApp?.initData;
  if (tgData) return { type: "tma", value: tgData };

  return null;
};



/**
 * Standard fetcher for SWR
 * Includes specific handling for Prisma 7 Decimal/BigInt string serialization
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
      localStorage.removeItem("auth_token");
      // Force a reload to trigger the TelegramProvider re-auth logic
      window.location.reload(); 
    }
    console.error("[API] Session expired or unauthorized");
    throw new Error("UNAUTHORIZED");
  }

  // Parse response safely
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

  // Returns the 'data' property from our standardized API response
  return data.data;
}

/**
 * Hook for GET requests using SWR
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false, // Prevents excessive re-fetching on TMA tab switching
    shouldRetryOnError: false, // Prevents infinite loops on 401 errors
    errorRetryCount: 1,
    ...config,
  });
}



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

export const apiDelete = <T>(url: string) => 
  apiMutation<T>(url, "DELETE");
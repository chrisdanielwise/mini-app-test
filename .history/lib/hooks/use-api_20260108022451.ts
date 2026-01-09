"use client";

import useSWR, { type SWRConfiguration } from "swr";

/**
 * Retrieves the authentication token.
 * Prioritizes JWT for speed, falls back to Telegram InitData for initial handshake.
 */
const getToken = () => {
  if (typeof window === "undefined") return null;

  // 1. Check for existing session token
  const jwt = localStorage.getItem("auth_token");
  if (jwt) return { type: "Bearer", value: jwt };

  // 2. Fallback to raw Telegram data (initial load or expired session)
  const tgData = window.Telegram?.WebApp?.initData;
  if (tgData) return { type: "tma", value: tgData };

  return null;
};

/**
 * Standard fetcher for SWR
 * Safely handles Prisma 7 string-serialization for Decimals and BigInts
 */
async function fetcher<T>(url: string): Promise<T> {
  const auth = getToken();

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: `${auth.type} ${auth.value}` }),
    },
  });

  // Handle Unauthorized (401)
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      // Remove stale token so getToken() will use fresh TMA data on next try
      localStorage.removeItem("auth_token");
    }
    console.error("[API] Session unauthorized. Clearing token.");
    throw new Error("UNAUTHORIZED");
  }

  // Handle standard errors and parsing
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error("Invalid server response format");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data.data;
}

/**
 * useApi Hook
 * Configuration optimized to prevent infinite refresh loops in Telegram
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false, // Prevents re-fetch every time user returns to the bot
    shouldRetryOnError: (err) => {
      // STOP retrying if the error is 401. This kills the refresh loop.
      if (err.message === "UNAUTHORIZED") return false;
      return true;
    },
    ...config,
  });
}

/**
 * Mutation Wrapper for POST, PUT, DELETE
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

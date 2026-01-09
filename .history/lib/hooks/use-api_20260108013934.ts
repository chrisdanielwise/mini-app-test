"use client";

import useSWR, { type SWRConfiguration } from "swr";

/**
 * Retrieves the authentication token.
 * We prioritize the JWT for performance, falling back to InitData for the initial login.
 */
const getToken = () => {
  if (typeof window === "undefined") return null;

  const jwt = localStorage.getItem("auth_token");
  if (jwt) return { type: "Bearer", value: jwt };

  // Access the native Telegram WebApp object
  const tgData = window.Telegram?.WebApp?.initData;
  if (tgData) return { type: "tma", value: tgData };

  return null;
};

/**
 * Image of the HTTP Authorization header flow for Telegram Mini Apps
 * showing the transition from InitData to JWT.
 */

async function fetcher<T>(url: string): Promise<T> {
  const auth = getToken();

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(auth && { Authorization: `${auth.type} ${auth.value}` }),
    },
  });

  // Handle Session Expiry
  if (response.status === 401) {
    // If unauthorized, clear the stale token and notify the system
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    console.error("[API] Session expired or unauthorized");
    throw new Error("UNAUTHORIZED");
  }

  // Handle Prisma 7 / Decimal serialization safely
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

export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false, // Recommended for TMA to avoid unnecessary flickering
    shouldRetryOnError: false,
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

  // Consistent 401 handling for mutations
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

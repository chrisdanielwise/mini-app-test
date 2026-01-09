"use client";

import useSWR, { type SWRConfiguration } from "swr";

/**
 * Retrieves the authentication token from LocalStorage or Telegram SDK.
 */
const getToken = () => {
  if (typeof window === "undefined") return null;

  // 1. Try JWT first (Performance)
  const jwt = localStorage.getItem("auth_token");
  if (jwt) return { type: "Bearer", value: jwt };

  // 2. Fallback to Telegram InitData (Authentication)
  const tgData = window.Telegram?.WebApp?.initData;
  if (tgData) return { type: "tma", value: tgData };

  return null;
};

/**
 * Standard fetcher for SWR
 * Correctly handles Prisma 7 string-serialization for financial Decimals
 */
async function fetcher<T>(url: string): Promise<T> {
  const auth = getToken();

  // If no authentication is possible yet, delay the request
  if (!auth || !auth.value) {
    throw new Error("WAITING_FOR_AUTH");
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${auth.type} ${auth.value}`,
    },
  });

  // Handle 401 Session Expiry
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    console.warn("[API] 401 Unauthorized: Token cleared for background re-auth.");
    throw new Error("UNAUTHORIZED");
  }

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error("MALFORMED_JSON");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || "FETCH_ERROR");
  }

  return data.data;
}

/**
 * useApi Hook
 * shouldRetryOnError: false is critical to prevent infinite loading loops.
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false, 
    errorRetryCount: 0,
    ...config,
  });
}

/**
 * Mutation Wrapper (POST, PUT, DELETE)
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
    throw new Error(data.error || data.message || `${method}_FAILED`);
  }

  return data.data;
}

export const apiPost = <T>(url: string, body: object) => apiMutation<T>(url, "POST", body);
export const apiPut = <T>(url: string, body: object) => apiMutation<T>(url, "PUT", body);
export const apiDelete = <T>(url: string) => apiMutation<T>(url, "DELETE");
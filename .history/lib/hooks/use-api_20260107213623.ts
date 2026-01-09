"use client"

import useSWR, { type SWRConfiguration } from "swr"

const getToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

async function fetcher<T>(url: string): Promise<T> {
  const token = getToken()

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Request failed")
  }

  return data.data
}

export function useApi<T>(url: string | null, config?: SWRConfiguration) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    ...config,
  })
}

export async function apiPost<T>(url: string, body: object): Promise<T> {
  const token = getToken()

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Request failed")
  }

  return data.data
}

export async function apiPut<T>(url: string, body: object): Promise<T> {
  const token = getToken()

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Request failed")
  }

  return data.data
}

export async function apiDelete<T>(url: string): Promise<T> {
  const token = getToken()

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Request failed")
  }

  return data.data
}

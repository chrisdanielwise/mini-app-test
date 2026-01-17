"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useInstitutionalAuth } from "./use-institutional-auth";

interface FetchOptions {
  limit?: number;
  dependencies?: any[];
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  isPaging?: boolean;
  manual?: boolean; // Set to true for POST/PATCH actions
}

/**
 * 🛰️ useInstitutionalFetch (Institutional Apex v16.16.29)
 * Logic: Kinetic Ingress + Atomic Signal Guard.
 * Standard: v9.9.8 Security Header Injection with Abort Signal Stabilizer.
 */
export function useInstitutionalFetch<T>(
  endpointOrFn: string | (() => Promise<any>) | null, 
  options: FetchOptions = {}
) {
  const { isAuthenticated, user } = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  const [data, setData] = useState<T | any>(null);
  const [loading, setLoading] = useState(!options.manual);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const page = useRef(1);
  const isFetching = useRef(false);
  const abortController = useRef<AbortController | null>(null);

  const limit = options.limit || 20;

  /**
   * 🪜 ATOMIC EXECUTION (Apex Ingress)
   * This handles both automatic GET syncing and manual POST/PATCH actions.
   */
  const execute = useCallback(async (isInitial = true, payload?: any) => {
    if (isFetching.current) return;
    
    // 🛡️ SECURITY GATE
    if (!isAuthenticated) return;

    isFetching.current = true;
    if (isInitial) {
      setLoading(true);
      page.current = 1;
    }

    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    try {
      let result;

      // 🕵️ RESOLVE INGRESS METHOD
      if (typeof endpointOrFn === 'function') {
        result = await endpointOrFn();
      } else if (typeof endpointOrFn === 'string') {
        const url = new URL(endpointOrFn, window.location.origin);
        if (!options.manual) {
          url.searchParams.set("limit", limit.toString());
          url.searchParams.set("offset", ((page.current - 1) * limit).toString());
        }

        const response = await fetch(url.toString(), {
          signal: abortController.current.signal,
          method: payload ? "POST" : "GET",
          headers: {
            "Content-Type": "application/json",
            "x-security-stamp": user?.securityStamp || "",
          },
          body: payload ? JSON.stringify(payload) : undefined
        });

        if (response.status === 401) {
          window.location.replace("/login?reason=session_expired");
          return;
        }

        result = await response.json();
      }

      const newData = result?.data || result;

      // 🌊 WATER-FLUID DATA HYDRATION
      setData((prev: any) => {
        if (!options.isPaging || isInitial) return newData;
        return Array.isArray(prev) ? [...prev, ...newData] : newData;
      });

      if (Array.isArray(newData)) {
        setHasMore(newData.length === limit);
      }
      
      if (options.onSuccess) options.onSuccess(result);
      page.current += 1;
      
      return result;
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message);
        if (options.onError) options.onError(err);
        console.error("🔥 [Fetch_Node_Failure]:", err.message);
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [endpointOrFn, isAuthenticated, user?.securityStamp, limit, options.isPaging]);

  // 🔄 AUTOMATIC SYNC: Triggers only if not manual
  useEffect(() => {
    if (endpointOrFn && !options.manual) {
      execute(true);
    }
    return () => abortController.current?.abort();
  }, [endpointOrFn, options.manual, ...(options.dependencies || [])]);

  return useMemo(() => ({
    data,
    loading,
    error,
    hasMore,
    execute, // Manual trigger for actions like handleWithdrawal or handleSubscribe
    refresh: () => {
      impact("light");
      return execute(true);
    },
    fetchNext: () => {
      if (!hasMore || loading) return;
      return execute(false);
    }
  }), [data, loading, error, hasMore, execute, impact]);
}
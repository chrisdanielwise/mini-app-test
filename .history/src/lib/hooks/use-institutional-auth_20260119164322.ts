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
  manual?: boolean;
}

/**
 * 🛰️ useInstitutionalFetch (Institutional Apex v16.16.29)
 * Fix: Added P (Payload) generic to support typed 'execute' calls.
 * Fix: Resolved TS2558 by supporting dual generics <T, P>.
 */
export function useInstitutionalFetch<T, P = any>(
  endpointOrFn: string | ((payload?: P) => Promise<any>) | null, 
  options: FetchOptions = {}
) {
  const { isAuthenticated, user } = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options.manual);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const page = useRef(1);
  const isFetching = useRef(false);
  const abortController = useRef<AbortController | null>(null);

  const limit = options.limit || 20;

  /**
   * 🪜 ATOMIC EXECUTION
   * Fix: 'payload' is now typed as 'P' to satisfy TS7006.
   */
  const execute = useCallback(async (isInitial = true, payload?: P) => {
    if (isFetching.current) return;
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

      if (typeof endpointOrFn === 'function') {
        // ✅ Pass the typed payload to the custom function
        result = await endpointOrFn(payload);
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
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [endpointOrFn, isAuthenticated, user?.securityStamp, limit, options.isPaging, options.onSuccess, options.onError]);

  useEffect(() => {
    if (endpointOrFn && !options.manual) {
      execute(true);
    }
    return () => abortController.current?.abort();
  }, [endpointOrFn, options.manual, execute, options.dependencies]);

  return useMemo(() => ({
    data,
    loading,
    error,
    hasMore,
    execute,
    refresh: () => {
      if (impact) impact("light");
      return execute(true);
    },
    fetchNext: () => {
      if (!hasMore || loading) return;
      return execute(false);
    }
  }), [data, loading, error, hasMore, execute, impact]);
}
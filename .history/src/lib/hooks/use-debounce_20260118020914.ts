"use client";

import { useEffect, useState } from "react";

/**
 * 🛰️ USE_DEBOUNCE (Institutional v16.16.40)
 * Strategy: Signal Stabilization.
 * Mission: Prevents database thrashing during rapid user ingress.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // ⏲️ Start the stabilization timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 🛡️ Cleanup: Cancel the timer if value changes before delay is met
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
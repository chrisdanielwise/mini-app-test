"use client";

import { useEffect, useState } from 'react';

/**
 * 🛰️ SIGNAL STABILIZER: useDebounce (Apex Tier)
 * Groups high-frequency updates into a single execution node.
 * Essential for Search Ingress and Real-time Telemetry Filtering.
 * * @param value - The high-frequency signal (input, slider, etc.)
 * @param delay - The stabilization window in milliseconds (default: 500ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 1. Initialize the stabilization timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. Cleanup Protocol: 
    // Immediately terminates the previous timer if the value or delay 
    // changes before the window closes.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
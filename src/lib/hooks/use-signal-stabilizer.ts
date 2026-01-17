"use client";

import { useEffect, useState, useRef } from 'react';

/**
 * 🛰️ SIGNAL STABILIZER (Institutional v16.16.12)
 * Logic: Grouped Execution Node for high-frequency ingress.
 * Standards: v9.5.8 (Fluid Interactions), v9.4.4 (Memory Protection).
 */
export function useSignalStabilizer<T>(value: T, delay: number = 500): T {
  const [stabilizedValue, setStabilizedValue] = useState<T>(value);
  
  // 🛡️ Persistence Ref: Tracks the latest signal to prevent stale closures
  const signalRef = useRef(value);

  useEffect(() => {
    signalRef.current = value;

    // 🚀 THE FIX: Immediate return for zero-delay (bypass overhead)
    if (delay === 0) {
      setStabilizedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      setStabilizedValue(signalRef.current);
    }, delay);

    // 🧹 CLEANUP PROTOCOL: Absolute termination on unmount or re-signal
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return stabilizedValue;
}
"use client";

import { useCallback, useMemo } from "react";
import { useTelegramContext } from "@/components/providers/telegram-provider";

/**
 * 🛰️ TACTICAL HAPTIC ENGINE (Institutional v16.16.12)
 * Logic: Merged Hardware Bridge with Atomic Preference Gating.
 * Standards: v9.5.8 Fluid Interaction, v9.4.4 Security (Preference Protection).
 */
export function useHaptics() {
  const { hapticFeedback, isTelegram, webApp } = useTelegramContext();

  // 🛡️ MEMOIZED PREFERENCE: Prevents repeated localStorage hits during fluid scrolls
  const canVibrate = useMemo(() => {
    if (typeof window === 'undefined' || !isTelegram) return false;
    // v9.4.4: Default to true unless explicitly disabled by operator
    return localStorage.getItem('node_haptics_enabled') !== 'false';
  }, [isTelegram]);

  // 🖱️ IMPACT: Tactile acknowledgement for UI nodes
  const impact = useCallback((style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (canVibrate) hapticFeedback(style);
  }, [canVibrate, hapticFeedback]);

  // 🔔 NOTIFICATION: Hardware alerts for logic results
  const notification = useCallback((type: 'success' | 'warning' | 'error') => {
    if (canVibrate) hapticFeedback(type);
  }, [canVibrate, hapticFeedback]);

  // 📏 SELECTION: High-frequency "Tick" feedback for financial wheels/scrollers
  const selectionChange = useCallback(() => {
    if (canVibrate && webApp?.HapticFeedback) {
      webApp.HapticFeedback.selectionChanged();
    }
  }, [canVibrate, webApp]);

  return useMemo(() => ({ 
    impact, 
    notification, 
    selectionChange 
  }), [impact, notification, selectionChange]);
}
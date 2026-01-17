"use client";

import { useCallback, useMemo } from "react";
import { useTelegramContext } from "@/components/providers/telegram-provider";

/**
 * 🛰️ TACTICAL HAPTIC ENGINE (Institutional v16.16.14)
 * Logic: Guarded Native Access with Atomic Preference Gating.
 * Fix: Resolves "hapticFeedback is not a function" via direct bridge verification.
 */
export function useHaptics() {
  const context = useTelegramContext();
  
  // 🛡️ HARDWARE MAPPING: Direct access to native Telegram bridge
  const haptic = context?.webApp?.HapticFeedback;
  const isTelegram = context?.isTelegram;

  // 🛡️ MEMOIZED PREFERENCE: Institutional v9.4.4 Standard
  const canVibrate = useMemo(() => {
    if (typeof window === 'undefined' || !isTelegram || !haptic) return false;
    return localStorage.getItem('node_haptics_enabled') !== 'false';
  }, [isTelegram, haptic]);

  // 🖱️ IMPACT: Tactile acknowledgement for UI nodes
  const impact = useCallback((style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!canVibrate) return;
    try {
      if (typeof haptic?.impactOccurred === 'function') {
        haptic.impactOccurred(style);
      }
    } catch (e) {
      console.warn("HAPTIC_IMPACT_FAULT:", e);
    }
  }, [canVibrate, haptic]);

  // 🔔 NOTIFICATION: Hardware alerts for logic results
  const notification = useCallback((type: 'success' | 'warning' | 'error') => {
    if (!canVibrate) return;
    try {
      if (typeof haptic?.notificationOccurred === 'function') {
        haptic.notificationOccurred(type);
      }
    } catch (e) {
      console.warn("HAPTIC_NOTIFY_FAULT:", e);
    }
  }, [canVibrate, haptic]);

  // 📏 SELECTION: High-frequency "Tick" feedback
  const selectionChange = useCallback(() => {
    if (!canVibrate) return;
    try {
      if (typeof haptic?.selectionChanged === 'function') {
        haptic.selectionChanged();
      }
    } catch (e) {
      console.warn("HAPTIC_SELECTION_FAULT:", e);
    }
  }, [canVibrate, haptic]);

  return useMemo(() => ({ 
    impact, 
    notification, 
    selectionChange,
    isSupported: !!haptic
  }), [impact, notification, selectionChange, haptic]);
}
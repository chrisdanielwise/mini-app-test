"use client";

import { useCallback, useMemo } from "react";
import { useTelegramContext } from "@/components/providers/telegram-provider";

/**
 * 🛰️ TACTICAL HAPTIC ENGINE (Institutional Apex v2026.1.20 - HARDENED)
 * Fix: Added 'hapticFeedback' alias to resolve TS2339 errors across 64 files.
 */
export function useHaptics() {
  const context = useTelegramContext();
  
  // 🛡️ HARDWARE MAPPING
  const haptic = context?.webApp?.HapticFeedback;
  const isTelegram = context?.isTelegram;

  // 🛡️ MEMOIZED PREFERENCE
  const canVibrate = useMemo(() => {
    if (typeof window === 'undefined' || !isTelegram || !haptic) return false;
    return localStorage.getItem('zipha_haptics_enabled') !== 'false';
  }, [isTelegram, haptic]);

  /**
   * 🖱️ IMPACT: Tactile acknowledgement for button nodes
   */
  const impact = useCallback((style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!canVibrate) return;
    try {
      if (typeof haptic?.impactOccurred === 'function') {
        haptic.impactOccurred(style);
      }
    } catch (e) {
      console.warn("🛰️ [Haptic_Impact_Fault]: Bridge unreachable.");
    }
  }, [canVibrate, haptic]);

  /**
   * 🔔 NOTIFICATION: Hardware alerts for asynchronous results
   */
  const notification = useCallback((type: 'success' | 'warning' | 'error') => {
    if (!canVibrate) return;
    try {
      if (typeof haptic?.notificationOccurred === 'function') {
        haptic.notificationOccurred(type);
      }
    } catch (e) {
      console.warn("🛰️ [Haptic_Notify_Fault]: Bridge unreachable.");
    }
  }, [canVibrate, haptic]);

  /**
   * 📏 SELECTION: High-frequency "Tick" feedback
   */
  const selectionChange = useCallback(() => {
    if (!canVibrate) return;
    try {
      if (typeof haptic?.selectionChanged === 'function') {
        haptic.selectionChanged();
      }
    } catch (e) {
      console.warn("🛰️ [Haptic_Selection_Fault]: Bridge unreachable.");
    }
  }, [canVibrate, haptic]);

  /**
   * 🚀 HAPTIC_FEEDBACK ALIAS
   * Fix for: "Property 'hapticFeedback' does not exist on type..."
   * Logic: Map to 'impact' to satisfy the dashboard destructuring.
   */
  const hapticFeedback = useCallback((style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    if (['success', 'warning', 'error'].includes(style)) {
      notification(style as 'success' | 'warning' | 'error');
    } else {
      impact(style as 'light' | 'medium' | 'heavy');
    }
  }, [impact, notification]);

  return useMemo(() => ({ 
    impact, 
    notification, 
    selectionChange,
    hapticFeedback, // ✅ THIS RESOLVES THE TS ERRORS
    isSupported: !!haptic
  }), [impact, notification, selectionChange, hapticFeedback, haptic]);
}
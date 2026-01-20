"use client";

import { useCallback, useMemo } from "react";
import { useTelegramContext } from "@/components/providers/telegram-provider";

/**
 * 🛰️ UNIVERSAL_HAPTIC_TYPES
 * Standard: v2026.1.20 - Unified tactile styles for the Zipha ecosystem.
 */
export type HapticImpactStyle = 'light' | 'medium' | 'heavy';
export type HapticNotificationStyle = 'success' | 'warning' | 'error';
export type HapticStyle = HapticImpactStyle | HapticNotificationStyle;

/**
 * 🛰️ TACTICAL HAPTIC ENGINE (Hardened)
 * Logic: Polymorphic bridge to Telegram's hardware feedback layer.
 * Fix: Standardized 'HapticStyle' across all internal callbacks.
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
   * 🖱️ IMPACT: Tactile acknowledgement for button/node interactions
   */
  const impact = useCallback((style: HapticImpactStyle = 'light') => {
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
   * 🔔 NOTIFICATION: Hardware alerts for asynchronous process results
   */
  const notification = useCallback((type: HapticNotificationStyle) => {
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
   * 📏 SELECTION: High-frequency feedback for list/picker scrolling
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
   * 🚀 HAPTIC_FEEDBACK POLYMORPHIC ALIAS
   * Logic: Intelligent routing based on the unified HapticStyle.
   * Fix for: Global TS2339 / TS2345 errors.
   */
  const hapticFeedback = useCallback((style: HapticStyle = 'light') => {
    const notifications: HapticStyle[] = ['success', 'warning', 'error'];
    
    if (notifications.includes(style)) {
      notification(style as HapticNotificationStyle);
    } else {
      impact(style as HapticImpactStyle);
    }
  }, [impact, notification]);

  return useMemo(() => ({ 
    impact, 
    notification, 
    selectionChange,
    hapticFeedback, 
    isSupported: !!haptic
  }), [impact, notification, selectionChange, hapticFeedback, haptic]);
}
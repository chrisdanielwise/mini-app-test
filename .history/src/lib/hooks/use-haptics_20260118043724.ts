"use client";

import { useCallback, useMemo } from "react";
import { useTelegramContext } from "@/components/providers/telegram-provider";

/**
 * 🛰️ TACTICAL HAPTIC ENGINE (Institutional v16.16.20)
 * Logic: Guarded Native Access with Atomic Preference Gating.
 * Mission: Provide physical confirmation for portal entries and logic results.
 */
export function useHaptics() {
  const context = useTelegramContext();
  
  // 🛡️ HARDWARE MAPPING: Direct access to native Telegram bridge node
  const haptic = context?.webApp?.HapticFeedback;
  const isTelegram = context?.isTelegram;

  // 🛡️ MEMOIZED PREFERENCE: Institutional v2026 Standard
  const canVibrate = useMemo(() => {
    if (typeof window === 'undefined' || !isTelegram || !haptic) return false;
    return localStorage.getItem('zipha_haptics_enabled') !== 'false';
  }, [isTelegram, haptic]);

  /**
   * 🖱️ IMPACT: Tactile acknowledgement for button nodes
   * Standard: Use 'light' for navigation, 'medium' for actions.
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
   * Standard: Use 'success' for sync, 'warning' for destructive actions.
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
   * Standard: Mandatory for portal entries (Drawers/Sheets).
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

  return useMemo(() => ({ 
    impact, 
    notification, 
    selectionChange,
    isSupported: !!haptic
  }), [impact, notification, selectionChange, haptic]);
}
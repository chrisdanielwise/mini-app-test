"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { useCallback } from "react";

/**
 * 🛰️ HAPTIC INTERFACE CONTROLLER (v10.6.1)
 * Purpose: Provides tactile feedback for critical UI interactions.
 * Security: Gated by user preferences to prevent 'Vibration Fatigue'.
 */
export function useHaptics() {
  const { hapticFeedback, isTelegram } = useTelegramContext();

  const isEnabled = useCallback(() => {
    if (typeof window === 'undefined' || !isTelegram) return false;
    return localStorage.getItem('user_haptics_enabled') !== 'false';
  }, [isTelegram]);

  // 🖱️ Impact: For button taps, toggle switches, and tab changes
  const impact = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (isEnabled()) {
      hapticFeedback(style);
    }
  };

  // 🔔 Notification: For transaction results and security alerts
  const notification = (type: 'success' | 'warning' | 'error') => {
    if (isEnabled()) {
      hapticFeedback(type);
    }
  };

  // 📏 Selection: For "ticking" through list items or wheel pickers
  const selectionChange = () => {
    if (isEnabled()) {
      try {
        window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
      } catch (e) {
        // Silent fail for unsupported browsers
      }
    }
  };

  return { impact, notification, selectionChange };
}
"use client";

import { useTelegramContext } from "@/components/telegram/telegram-provider";

export function useHaptics() {
  const { hapticFeedback } = useTelegramContext();

  // Helper to check if haptics are globally enabled by the user
  const isEnabled = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('user_haptics_enabled') !== 'false';
  }, []);

  const impact = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (isEnabled()) hapticFeedback(style);
  };

  const notification = (type: 'success' | 'warning' | 'error') => {
    if (isEnabled()) hapticFeedback(type);
  };

  const selectionChange = () => {
    if (isEnabled()) {
      // 🛡️ Safe check for the Telegram selectionChanged event
      try {
        window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
      } catch (e) {
        console.warn("[Haptics] Selection vibration not supported.");
      }
    }
  };

  return { impact, notification, selectionChange };
}
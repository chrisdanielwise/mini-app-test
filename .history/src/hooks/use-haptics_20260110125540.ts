"use client";

// import { useTelegramContext } from "@/components/telegram/telegram-provider";

/**
 * 🛰️ TACTILE COMMAND: useHaptics (Apex Tier)
 * Provides physical interface feedback via the Telegram Native Bridge.
 * Essential for 2026 Mobile UX Immersion.
 */
export function useHaptics() {
  const { hapticFeedback } = useTelegramContext();

  /**
   * ⚡ IMPACT TRIGGER
   * Used for tactile clicks, button presses, and physical interaction.
   */
  const impact = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    const isEnabled = typeof window !== 'undefined' && localStorage.getItem('user_haptics_enabled') !== 'false';
    
    if (isEnabled) {
      hapticFeedback(style);
    }
  };

  /**
   * 🔔 NOTIFICATION TRIGGER
   * Used for system alerts, successful payments, and protocol errors.
   */
  const notification = (type: 'success' | 'warning' | 'error') => {
    const isEnabled = typeof window !== 'undefined' && localStorage.getItem('user_haptics_enabled') !== 'false';
    
    if (isEnabled) {
      hapticFeedback(type);
    }
  };

  /**
   * 🎯 SELECTION TRIGGER
   * Optimized for scrolling through lists or toggling small switches.
   */
  const selectionChange = () => {
    const isEnabled = typeof window !== 'undefined' && localStorage.getItem('user_haptics_enabled') !== 'false';
    
    if (isEnabled) {
      // Direct call to the specific selection vibration
      if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
         window.Telegram.WebApp.HapticFeedback.selectionChanged();
      }
    }
  };

  return { impact, notification, selectionChange };
}
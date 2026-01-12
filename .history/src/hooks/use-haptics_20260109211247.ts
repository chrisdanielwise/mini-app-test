"use client"

import { useTelegramContext } from "@/components/telegram/telegram-provider"

export function useHaptics() {
  const { webApp } = useTelegramContext();

  const trigger = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    // Check if user has haptics enabled in localStorage (we'll set this in the settings)
    const isEnabled = localStorage.getItem('user_haptics_enabled') !== 'false';
    
    if (isEnabled && webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(style);
    }
  };

  return { trigger };
}
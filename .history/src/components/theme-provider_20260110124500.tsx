"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useTheme } from "next-themes";

/**
 * 🛰️ TELEGRAM THEME SYNC (Internal Node)
 * Listens to the Telegram WebApp color scheme changes in real-time.
 */
function TelegramThemeSync() {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const syncTheme = () => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tgScheme = window.Telegram.WebApp.colorScheme; // 'dark' or 'light'
        setTheme(tgScheme);
      }
    };

    // 🏁 Initial Sync
    syncTheme();

    // 📡 Event Listener for Live Theme Changes (e.g., sunset/sunrise scheduling)
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.onEvent("themeChanged", syncTheme);
      return () => window.Telegram.WebApp.offEvent("themeChanged", syncTheme);
    }
  }, [setTheme]);

  return null;
}

/**
 * 🛰️ THEME PROVIDER (Apex Tier)
 * Refined for Tailwind CSS v4 and Telegram Native Immersion.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark" // 🌑 Dark is the institutional standard for 2026 Dashboards
      enableSystem={false} // 🚫 Disable system sync to prioritize Telegram's scheme
      disableTransitionOnChange
      {...props}
    >
      <TelegramThemeSync />
      {children}
    </NextThemesProvider>
  );
}
"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useTheme } from "next-themes";

/**
 * 🛰️ TELEGRAM THEME SYNC
 * Logic: Bi-directional handshake with Telegram API 8.0.
 * Feature: Forces internal React state to mirror hardware-level color schemes.
 */
function TelegramThemeSync() {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const syncTheme = () => {
      if (window.Telegram?.WebApp) {
        const tgScheme = window.Telegram.WebApp.colorScheme; // 'dark' | 'light'
        
        // 🛡️ Hardened check to prevent hydration mismatch loops
        setTheme(tgScheme === "dark" ? "dark" : "light");
      }
    };

    // 🏁 Initial Handshake
    syncTheme();

    // 📡 Event Listener for Live Theme Changes (Native system-level triggers)
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.onEvent("themeChanged", syncTheme);
      return () => {
        window.Telegram.WebApp.offEvent("themeChanged", syncTheme);
      };
    }
  }, [setTheme]);

  return null;
}

/**
 * 🛰️ THEME PROVIDER
 * Refined: Tailwind CSS v4 & Native Immersion Layer.
 * Note: defaultTheme is set to 'dark' to maintain the 2026 tactical aesthetic.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark" 
      enableSystem={false} 
      disableTransitionOnChange
      {...props}
    >
      {/* 🚀 Internal Sync Node must stay within Provider context */}
      <TelegramThemeSync />
      <div className="min-h-screen bg-background text-foreground antialiased transition-colors duration-500">
        {children}
      </div>
    </NextThemesProvider>
  );
}
"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useTheme } from "next-themes";

/**
 * 🛰️ TELEGRAM THEME SYNC
 * Fixed: Infinite re-render loop resolved via Equivalence Guard.
 * Logic: Bi-directional handshake with Telegram API 8.0.
 */
function TelegramThemeSync() {
  const { setTheme, theme } = useTheme();
  const isSyncing = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) return;

    const tg = window.Telegram.WebApp;

    const syncTheme = () => {
      // 🛡️ EQUIVALENCE GUARD: Prevents infinite state-update loops
      const tgScheme = tg.colorScheme; // 'dark' | 'light'
      
      if (theme !== tgScheme && !isSyncing.current) {
        isSyncing.current = true;
        setTheme(tgScheme);
        
        // Release lock after a short delay to allow React to process the state
        setTimeout(() => {
          isSyncing.current = false;
        }, 100);
      }
    };

    // 🏁 Initial Handshake
    syncTheme();

    // 📡 Native Event Listener
    tg.onEvent("themeChanged", syncTheme);
    return () => {
      tg.offEvent("themeChanged", syncTheme);
    };
  }, [setTheme, theme]);

  return null;
}

/**
 * 🛰️ THEME PROVIDER
 * Optimized: Native Immersion Layer with 2026 tactical defaults.
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
      <TelegramThemeSync />
      {/* 🚀 FIXED: Added min-h-screen wrapper to ensure background parity */}
      <div className="min-h-[100dvh] bg-background text-foreground antialiased transition-colors duration-500">
        {children}
      </div>
    </NextThemesProvider>
  );
}
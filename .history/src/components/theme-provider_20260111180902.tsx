"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
import { useTheme } from "next-themes";

/**
 * 🛰️ TELEGRAM THEME SYNC
 * Logic: Equivalence-checked handshake.
 * Fixed: Does not fire on Login route to prevent hydration mismatches.
 */
function TelegramThemeSync() {
  const { setTheme, theme } = useTheme();
  const isSyncing = React.useRef(false);

  React.useEffect(() => {
    // 🛡️ PASSIVE MODE: If on login page or server, do nothing.
    if (typeof window === "undefined" || window.location.pathname === "/dashboard/login") return;
    if (!window.Telegram?.WebApp) return;

    const tg = window.Telegram.WebApp;

    const syncTheme = () => {
      const tgScheme = tg.colorScheme === "dark" ? "dark" : "light";
      
      // 🛡️ EQUIVALENCE GUARD: Only update if strictly necessary
      if (theme !== tgScheme && !isSyncing.current) {
        isSyncing.current = true;
        setTheme(tgScheme);
        setTimeout(() => { isSyncing.current = false; }, 200);
      }
    };

    syncTheme();
    tg.onEvent("themeChanged", syncTheme);
    return () => tg.offEvent("themeChanged", syncTheme);
  }, [setTheme, theme]);

  return null;
}

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
      <div className="min-h-[100dvh] bg-background text-foreground antialiased transition-colors duration-500">
        {children}
      </div>
    </NextThemesProvider>
  );
}
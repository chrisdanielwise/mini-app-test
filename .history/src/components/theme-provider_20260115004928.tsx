"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

/**
 * 🌊 TELEGRAM THEME SYNC (v16.16.12)
 * Logic: Bi-directional parity check with Hydration Shield.
 * Security: Isolated from login gates to prevent state leakage.
 */
function TelegramThemeSync() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const isSyncing = React.useRef(false);

  React.useEffect(() => {
    // 🛡️ SECURITY STAND-DOWN: Do not sync at sensitive ingress gates
    if (typeof window === "undefined" || pathname.includes("/login")) return;
    if (!window.Telegram?.WebApp) return;

    const tg = window.Telegram.WebApp;

    const syncTheme = () => {
      // 🏛️ Institutional Logic: Default to Dark if scheme is ambiguous
      const tgScheme = tg.colorScheme === "dark" ? "dark" : "light";
      
      if (theme !== tgScheme && !isSyncing.current) {
        isSyncing.current = true;
        setTheme(tgScheme);
        // Momentum Delay: Prevents "Double-Toggle" in legacy v6.0 clients
        setTimeout(() => { isSyncing.current = false; }, 300);
      }
    };

    // Initial Handshake
    syncTheme();
    
    // Live Pulse: React to system-level theme shifts
    tg.onEvent("themeChanged", syncTheme);
    return () => tg.offEvent("themeChanged", syncTheme);
  }, [setTheme, theme, pathname]);

  return null;
}

/**
 * 🏛️ INSTITUTIONAL THEME PROVIDER
 * Optimized: Controlled hydration to prevent FOUC (Flash of Unstyled Content).
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark" 
      enableSystem={false} 
      disableTransitionOnChange={false} // Enabled for institutional momentum
      {...props}
    >
      <TelegramThemeSync />
      <div className={`
        min-h-[100dvh] w-full bg-background text-foreground antialiased
        transition-colors duration-700 ease-[var(--ease-institutional)]
        ${!mounted ? "opacity-0" : "opacity-100"}
      `}>
        {children}
      </div>
    </NextThemesProvider>
  );
}
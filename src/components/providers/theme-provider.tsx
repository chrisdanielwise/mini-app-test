"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { cn } from "@/lib/utils";

/**
 * 🛰️ TELEGRAM_THEME_SYNC (Institutional Apex v2026.1.16)
 * Strategy: Hardware-Handshake & Momentum Isolation.
 * Fix: Standardized 300ms debounced sync prevents rapid-fire theme flickering.
 */
function TelegramThemeSync() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const { isReady } = useDeviceContext(); 
  const isSyncing = React.useRef(false);

  React.useEffect(() => {
    // 🛡️ SECURITY STAND-DOWN: Bypass logic for login gates
    if (typeof window === "undefined" || pathname.includes("/login") || !isReady) return;
    
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    const syncTheme = () => {
      // 🏛️ Institutional Logic: Default to Dark protocol
      const tgScheme = tg.colorScheme === "dark" ? "dark" : "light";
      
      if (theme !== tgScheme && !isSyncing.current) {
        isSyncing.current = true;
        setTheme(tgScheme);
        // Momentum Delay: Balanced for high-refresh hardware
        setTimeout(() => { isSyncing.current = false; }, 300);
      }
    };

    syncTheme();
    
    if (tg.onEvent) tg.onEvent("themeChanged", syncTheme);
    
    return () => {
      if (tg.offEvent) tg.offEvent("themeChanged", syncTheme);
    };
  }, [setTheme, theme, pathname, isReady]);

  return null;
}

/**
 * 🏛️ INSTITUTIONAL_THEME_PROVIDER
 * Priority: Device-Aware Hydration & Momentum Sync.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const { isReady, isMobile } = useDeviceContext();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🛡️ STABILIZATION GATE: Wait for hardware calibration
  const isFullyStabilized = isMounted && isReady;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark" 
      enableSystem={false} 
      disableTransitionOnChange={false} 
      {...props}
    >
      <TelegramThemeSync />
      <div 
        className={cn(
          "w-full bg-background text-foreground antialiased",
          "transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]", 
          isFullyStabilized ? "opacity-100 scale-100" : "opacity-0 scale-[0.99] pointer-events-none"
        )}
        style={{ 
          minHeight: `calc(var(--vh, 1vh) * 100)`,
          perspective: isMobile ? "1000px" : "none"
        }}
      >
        {children}
      </div>
    </NextThemesProvider>
  );
}
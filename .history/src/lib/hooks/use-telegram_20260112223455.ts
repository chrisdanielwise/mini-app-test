"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getTelegramWebApp,
  isTelegramWebApp,
  getTelegramUser,
  getStartParam,
  getInitData,
  setBackButton,
  setMainButton,
  hapticFeedback,
  type TelegramWebApp,
} from "@/lib/telegram/webapp";

/**
 * 🛰️ useTelegram HOOK (Institutional v10.3.0)
 * Hardened: Viewport stabilization and strict environment gating.
 * Protection: Explicitly handles the 2026 'Expanded Viewport' protocol.
 */
export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [webapp, setWebapp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    // 🛡️ SSR GUARD: Standard Next.js 16 Client-Only check
    if (typeof window === "undefined") return;

    const initWebapp = async () => {
      const tg = getTelegramWebApp();
      
      if (tg) {
        // 🚀 1. HANDSHAKE: Signal Telegram that the app is interactive
        tg.ready();
        
        // 🚀 2. VIEWPORT: Force full height to prevent 'Swipe-to-Close' interference
        tg.expand();

        // 🚀 3. THEME SYNC: Apply institutional dark-mode defaults
        try {
          tg.setHeaderColor("#000000"); // Standard Black for 2026 Terminals
          tg.setBackgroundColor("#000000");
        } catch (err) {
          console.warn("🛰️ [Telegram_SDK] Theming rejected by host.");
        }

        setWebapp(tg);
      }
      setIsReady(true);
    };

    initWebapp();
  }, []);

  // 🛠️ TACTICAL HELPERS
  const expand = useCallback(() => webapp?.expand(), [webapp]);
  const close = useCallback(() => webapp?.close(), [webapp]);

  return useMemo(
    () => ({
      webapp,
      /**
       * 🛡️ ZERO-FLICKER IDENTITY
       * We use a dual-gate (window + isReady) to ensure identity is only
       * accessed once the DOM is stable.
       */
      user: isReady && typeof window !== "undefined" ? getTelegramUser() : null,
      startParam: isReady && typeof window !== "undefined" ? getStartParam() : null,
      getInitData, 
      
      // STATUS NODES
      isReady,
      isTelegram: isReady && typeof window !== "undefined" ? isTelegramWebApp() : false,
      platform: webapp?.platform || "web",
      colorScheme: webapp?.colorScheme || "dark",
      
      // SDK WRAPPERS
      setBackButton,
      setMainButton,
      hapticFeedback,
      expand,
      close,
    }),
    [webapp, isReady, expand, close]
  );
}
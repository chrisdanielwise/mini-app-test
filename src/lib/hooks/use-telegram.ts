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

export interface UseTelegramReturn {
  webapp: TelegramWebApp | null;
  user: ReturnType<typeof getTelegramUser>;
  startParam: string | null;
  isReady: boolean;
  isTelegram: boolean;
  getInitData: typeof getInitData; // 🛡️ Added to prevent Provider crashes
  platform: string;
  colorScheme: "light" | "dark";
  setBackButton: typeof setBackButton;
  setMainButton: typeof setMainButton;
  hapticFeedback: typeof hapticFeedback;
  expand: () => void;
  close: () => void;
}

/**
 * 🛰️ useTelegram HOOK (Apex Tier)
 * Fixed: Explicitly exports getInitData to resolve the 200/302 redirect storm.
 * Optimized: Prevents hydration mismatches by gating browser-only calls.
 */
export function useTelegram(): UseTelegramReturn {
  const [isReady, setIsReady] = useState(false);
  const [webapp, setWebapp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    // 🛡️ BROWSER GUARD: Only execute on the client
    if (typeof window === "undefined") return;

    const tgWebapp = getTelegramWebApp();

    if (tgWebapp) {
      // 🚀 INITIALIZATION HANDSHAKE
      tgWebapp.ready();
      
      // Expand immediately to prevent the 'Half-Sheet' viewport bug
      tgWebapp.expand();

      // 🎨 TACTICAL THEMING
      try {
        tgWebapp.setHeaderColor("#121212");
        tgWebapp.setBackgroundColor("#121212");
      } catch (e) {
        console.warn("[Telegram_SDK] Theming params not supported in this version.");
      }

      setWebapp(tgWebapp);
    }

    setIsReady(true);
  }, []);

  const expand = useCallback(() => {
    if (webapp) webapp.expand();
  }, [webapp]);

  const close = useCallback(() => {
    if (webapp) webapp.close();
  }, [webapp]);

  // 🛡️ IDENTITY MEMOIZATION
  return useMemo(
    () => ({
      webapp,
      user: typeof window !== "undefined" ? getTelegramUser() : null,
      startParam: typeof window !== "undefined" ? getStartParam() : null,
      isReady,
      isTelegram: typeof window !== "undefined" ? isTelegramWebApp() : false,
      getInitData, // 🛡️ CRITICAL: Exported to satisfy TelegramProvider requirements
      platform: webapp?.platform || "unknown",
      colorScheme: webapp?.colorScheme || "dark",
      setBackButton,
      setMainButton,
      hapticFeedback,
      expand,
      close,
    }),
    [webapp, isReady, expand, close]
  );
}
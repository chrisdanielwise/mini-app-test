"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
 * 🛰️ useTelegram HOOK (Institutional v16.16.12)
 * Logic: Synchronous Handshake + Viewport Locking.
 * Standards: v9.5.8 (Fluid), v9.4.4 (Identity Protection).
 */
export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [webapp, setWebapp] = useState<TelegramWebApp | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || isInitialized.current) return;

    // 1. 🚀 SYNCHRONOUS BOOT: Lock hardware settings immediately
    const tg = getTelegramWebApp();
    
    if (tg) {
      tg.ready();
      tg.expand(); // Force full-screen to prevent swipe-to-close gestures

      // 🏛️ INSTITUTIONAL THEME LOCK (v9.5.0)
      tg.setHeaderColor("#000000");
      tg.setBackgroundColor("#000000");

      setWebapp(tg);
      isInitialized.current = true;
    }
    
    setIsReady(true);
  }, []);

  /**
   * 🛡️ IDENTITY RESOLUTION (Memoized)
   * Prevents re-fetching the user object on every re-render.
   */
  const user = useMemo(() => {
    if (!isReady || typeof window === "undefined") return null;
    return getTelegramUser();
  }, [isReady]);

  const startParam = useMemo(() => {
    if (!isReady || typeof window === "undefined") return null;
    return getStartParam();
  }, [isReady]);

  // 🛠️ TACTICAL ACTIONS
  const expand = useCallback(() => webapp?.expand(), [webapp]);
  const close = useCallback(() => webapp?.close(), [webapp]);

  return useMemo(
    () => ({
      webapp,
      user,
      startParam,
      getInitData, 
      
      // 🛰️ STATUS NODES
      isReady,
      isTelegram: isReady && isTelegramWebApp(),
      platform: webapp?.platform || "web",
      version: webapp?.version || "0.0",
      
      // 🛠️ HARDWARE BRIDGES
      setBackButton,
      setMainButton,
      hapticFeedback,
      expand,
      close,
    }),
    [webapp, isReady, user, startParam, expand, close]
  );
}
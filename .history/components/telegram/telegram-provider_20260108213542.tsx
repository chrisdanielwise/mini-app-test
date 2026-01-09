"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useTelegram } from "@/lib/hooks/use-telegram";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/lib/telegram/webapp";

/**
 * 🚀 EXPLICIT INTERFACE EXPORT
 */
export interface TelegramContextValue {
  auth: ReturnType<typeof useAuth>;
  isReady: boolean;
  isTelegram: boolean;
  user: any;
  getInitData: () => string | null;
  setBackButton: (visible: boolean, onClick?: () => void) => void;
  setMainButton: (params: any) => void;
  hapticFeedback: (
    type: "light" | "medium" | "heavy" | "success" | "warning" | "error"
  ) => void;
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

/**
 * 🚀 EXPLICIT PROVIDER EXPORT
 * Manages native app immersion and browser-to-app redirects.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();

  /**
   * 🛡️ THE TELEGRAM GUARD & IMMERSION TRIGGER
   * 1. Bounces browser users back to the bot link.
   * 2. Requests Full-Screen mode (v8.0) for native immersion.
   */
  useEffect(() => {
    // A. Browser Redirect: If opened outside Telegram, bounce to the bot app link
    if (typeof window !== "undefined" && !telegram.isTelegram && telegram.isReady) {
      // Replace 'BxJS_Bot' with your actual bot username if different
      window.location.href = "https://t.me/BxJS_Bot/app";
      return;
    }

    // B. Native Immersion: Trigger Full-Screen resize and swipe locks
    if (telegram.isReady && telegram.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram.isReady, telegram.isTelegram]);

  // Handle Silent Re-authentication (Stateless Handshake)
  useEffect(() => {
    const performHandshake = async () => {
      if (telegram.isReady && !auth.isAuthenticated && !auth.isLoading) {
        const initData = telegram.getInitData();
        if (initData) {
          try {
            await auth.login(initData);
          } catch (err) {
            console.error("[Telegram] Re-authentication handshake failed.");
          }
        }
      }
    };
    performHandshake();
  }, [telegram.isReady, auth.isAuthenticated, auth.isLoading, telegram, auth]);

  const value: TelegramContextValue = {
    ...telegram,
    auth,
  };

  // Prevent UI flicker while the Telegram SDK is initializing
  if (!telegram.isReady && telegram.isTelegram) {
    return <LoadingScreen message="Securing Telegram Session..." />;
  }

  return (
    <TelegramContext.Provider value={value}>
      {/* 🏁 THE RESIZE GUARD: 
          min-h-screen ensures the background stretches to fill the 
          area vacated by the Telegram top-bar in fullscreen mode.
      */}
      <div className="flex min-h-screen w-full flex-col bg-background selection:bg-primary/30">
        {children}
      </div>
    </TelegramContext.Provider>
  );
}

/**
 * 🚀 EXPLICIT HOOK EXPORT
 */
export function useTelegramContext() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error(
      "useTelegramContext must be used within a TelegramProvider"
    );
  }
  return context;
}
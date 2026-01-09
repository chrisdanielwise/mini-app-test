"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useTelegram } from "@/lib/hooks/use-telegram";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { WebApp, initializeNativeAppMode } from "@/lib/telegram/webapp";

interface TelegramContextValue {
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

export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();

  /**
   * 🛡️ THE TELEGRAM GUARD & IMMERSION TRIGGER
   * 1. Redirects browser users to the Telegram Bot.
   * 2. Triggers Full-Screen mode for native immersion.
   */
  useEffect(() => {
    // A. Browser Redirect: If opened outside Telegram, bounce to the bot
    if (typeof window !== "undefined" && !telegram.isTelegram && telegram.isReady) {
      // Replace 'BxJS_Bot' with your actual bot username if different
      window.location.href = "https://t.me/BxJS_Bot/app";
      return;
    }

    // B. Native Immersion: Trigger Full-Screen and Swipe Locks
    if (telegram.isReady && telegram.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram.isReady, telegram.isTelegram]);

  // Detect session loss and trigger silent re-authentication
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

  // Prevent UI flicker before Telegram SDK is ready
  if (!telegram.isReady && telegram.isTelegram) {
    return <LoadingScreen message="Securing Telegram Session..." />;
  }

  return (
    <TelegramContext.Provider value={value}>
      <div 
        className="w-full min-h-screen bg-background selection:bg-primary/30"
        /** * 🚀 RESIZE SAFETY: 
         * Ensures the root container is ready for Telegram's viewport resize.
         */
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </div>
    </TelegramContext.Provider>
  );
}

export function useTelegramContext() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error(
      "useTelegramContext must be used within a TelegramProvider"
    );
  }
  return context;
}
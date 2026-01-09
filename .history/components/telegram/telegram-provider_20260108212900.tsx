"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useTelegram } from "@/lib/hooks/use-telegram";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/lib/telegram/webapp";

/**
 * 🚀 EXPLICIT INTERFACE EXPORT
 * Defining the shape of the context values for TypeScript safety.
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

// Internal context instance
const TelegramContext = createContext<TelegramContextValue | null>(null);

/**
 * 🚀 EXPLICIT PROVIDER EXPORT
 * This handles the native app immersion and re-authentication handshake.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();

  /**
   * 🛡️ THE TELEGRAM GUARD & IMMERSION TRIGGER
   * Redirects browser users to the bot and triggers v8.0 Full-Screen mode.
   */
  useEffect(() => {
    // 1. Browser Redirect: If initData is missing, bounce to the bot link
    if (typeof window !== "undefined" && !telegram.isTelegram && telegram.isReady) {
      // Ensure BxJS_Bot matches your BotFather username
      window.location.href = "https://t.me/BxJS_Bot/app";
      return;
    }

    // 2. Native Immersion: Trigger Full-Screen resize and swipe locks
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
      {/* Root container styled for full-screen resize handling */}
      <div className="flex min-h-screen w-full flex-col bg-background">
        {children}
      </div>
    </TelegramContext.Provider>
  );
}

/**
 * 🚀 EXPLICIT HOOK EXPORT
 * This is the function your other files are importing. 
 * It must be at the bottom and use the 'export' keyword.
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
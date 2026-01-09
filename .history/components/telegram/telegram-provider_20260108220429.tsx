"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useTelegram } from "@/lib/hooks/use-telegram";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/lib/telegram/webapp";

/**
 * 🚀 EXPLICIT INTERFACE EXPORT
 * Defines the shape of the global Telegram context.
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
 * Handles browser-to-app redirects, native app immersion, and auth handshakes.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  
  // 🏁 HYDRATION GUARD: Ensures the server and client render the same tree initially.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // A. Browser Redirect: If opened outside Telegram, bounce to the native bot link.
    // Replace 'BxJS_Bot' with your exact BotFather username.
    if (!telegram.isTelegram && telegram.isReady) {
      window.location.href = "https://t.me/BxJS_Bot/app";
      return;
    }

    // B. Native Immersion: Trigger Full-Screen (v8.0) and Swipe Locks.
    if (telegram.isReady && telegram.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram.isReady, telegram.isTelegram]);

  /**
   * 🔐 SILENT RE-AUTHENTICATION
   * Automatically attempts to restore the merchant session if the JWT expires.
   */
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

  // 🏁 THE RENDER SAFETY LOCK
  // Prevents the "Hydration failed" error by delaying complex UI until after mount.
  if (!mounted || (!telegram.isReady && telegram.isTelegram)) {
    return <LoadingScreen message="Securing Telegram Session..." />;
  }

  return (
    <TelegramContext.Provider value={{ ...telegram, auth }}>
      {/* 🚀 VIEWPORT RESIZE GUARD
          Using 'min-h-screen' and 'w-full' allows the background to stretch 
          instantly when the Telegram header slides away in fullscreen mode.
      */}
      <div className="flex min-h-screen w-full flex-col bg-background selection:bg-primary/30">
        {children}
      </div>
    </TelegramContext.Provider>
  );
}

/**
 * 🚀 EXPLICIT HOOK EXPORT
 * Standard named export for Next.js static analysis compatibility.
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
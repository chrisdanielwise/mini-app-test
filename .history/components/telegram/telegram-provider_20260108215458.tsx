"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  
  // 🏁 HYDRATION FIX: Ensures SSR matches Client initial render
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // A. Browser Redirect: If opened outside Telegram, bounce to the bot app link
    if (!telegram.isTelegram && telegram.isReady) {
      window.location.href = "https://t.me/BxJS_Bot/app";
      return;
    }

    // B. Native Immersion: Trigger Full-Screen (v8.0) and Swipe Locks
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

  // 🏁 HYDRATION & LOADING GUARD
  // Only show the loading screen after mounting to prevent tree mismatch
  if (!mounted || (!telegram.isReady && telegram.isTelegram)) {
    return <LoadingScreen message="Securing Telegram Session..." />;
  }

  return (
    <TelegramContext.Provider value={{ ...telegram, auth }}>
      {/* 🏁 THE RESIZE GUARD: 
          min-h-screen allows the background to stretch instantly 
          when the Telegram top-bar disappears in fullscreen mode.
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
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useTelegram } from "@/lib/hooks/use-telegram";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/lib/telegram/webapp";

/**
 * 🛰️ TELEGRAM CONTEXT VALUE
 * The global telemetry and identity object shared across the entire cluster.
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
 * 🛰️ TELEGRAM PROVIDER (Apex Tier)
 * Orchestrates browser-to-native redirects and the secure JWT handshake.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();

  // 🏁 HYDRATION GUARD: Prevents server/client mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // A. Institutional Redirect Node:
    // Ensures the app is only accessible within the authorized Telegram environment.
    if (!telegram.isTelegram && telegram.isReady) {
      window.location.href = "https://t.me/BxJS_Bot/app";
      return;
    }

    // B. Native App Calibration (v8.0+):
    // Triggers full-screen expansion and native gesture locking.
    if (telegram.isReady && telegram.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram.isReady, telegram.isTelegram]);

  /**
   * 🔐 CRYPTOGRAPHIC HANDSHAKE
   * Automatically synchronizes Telegram initData with the backend Ledger.
   */
  useEffect(() => {
    const performHandshake = async () => {
      // Only trigger if Telegram is ready and user is not yet authenticated
      if (telegram.isReady && !auth.isAuthenticated && !auth.isLoading) {
        const initData = telegram.getInitData();
        if (initData) {
          try {
            await auth.login(initData);
          } catch (err) {
            console.error("[Handshake_Error] Identity synchronization failed.");
          }
        }
      }
    };
    performHandshake();
  }, [telegram.isReady, auth.isAuthenticated, auth.isLoading, telegram, auth]);

  // 🏁 THE SECURITY RENDER LOCK
  // Masks the initialization phase with an institutional loading state.
  if (!mounted || (!telegram.isReady && telegram.isTelegram)) {
    return <LoadingScreen message="Establishing Identity Link..." />;
  }

  return (
    <TelegramContext.Provider value={{ ...telegram, auth }}>
      {/* 🚀 VIEWPORT HARDENING: 
          'selection:bg-primary/30' provides high-fidelity tactile feedback for text.
      */}
      <div className="flex min-h-screen w-full flex-col bg-background selection:bg-primary/30 antialiased">
        {children}
      </div>
    </TelegramContext.Provider>
  );
}

/**
 * 🛰️ TELEGRAM IDENTITY HOOK
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
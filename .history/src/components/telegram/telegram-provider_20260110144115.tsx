"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useTelegram } from "@/src/lib/hooks/use-telegram";
import { useAuth } from "@/src/lib/hooks/use-auth";
import { LoadingScreen } from "@/src/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/src/lib/telegram/webapp";

/**
 * 🛰️ TELEGRAM CONTEXT VALUE
 * The unified telemetry object for the entire Zipha V2 ecosystem.
 */
export interface TelegramContextValue {
  auth: ReturnType<typeof useAuth>;
  isReady: boolean;
  isTelegram: boolean;
  user: any; // The authenticated Database User node
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
 * Orchestrates the secure JWT handshake and native hardware calibration.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();

  // 🏁 HYDRATION GUARD: Prevents SSR/Client mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // A. Institutional Environment Guard
    // Blocks standard web browsers in production to prevent unauthorized probing.
    const isProd = process.env.NODE_ENV === "production";
    if (isProd && !telegram.isTelegram && telegram.isReady) {
      window.location.href = "https://t.me/BxJS_Bot/app";
      return;
    }

    // B. Native Hardware Calibration
    // Activates full-screen mode, native gestures, and secondary header colors.
    if (telegram.isReady && telegram.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram.isReady, telegram.isTelegram]);

  /**
   * 🔐 CRYPTOGRAPHIC HANDSHAKE
   * Resolves the 'demo-merchant' 400 error by fetching real UUIDs from the Ledger.
   */
  useEffect(() => {
    const performHandshake = async () => {
      // Trigger login only if SDK is ready and no session exists
      if (telegram.isReady && !auth.isAuthenticated && !auth.isLoading) {
        const initData = telegram.getInitData();
        if (initData) {
          try {
            const session = await auth.login(initData);
            console.log(`[Identity_Sync] Session verified: ${session.user.id}`);
          } catch (err) {
            console.error("[Handshake_Error] Secure identity link failed.");
          }
        }
      }
    };
    performHandshake();
  }, [telegram.isReady, auth.isAuthenticated, auth.isLoading, telegram, auth]);

  // 🏁 SECURITY RENDER LOCK
  // Ensures the UI remains masked until the hardware link is established.
  if (!mounted || (telegram.isTelegram && !telegram.isReady)) {
    return <LoadingScreen message="Synchronizing Identity Node..." />;
  }

  return (
    <TelegramContext.Provider 
      value={{ 
        ...telegram, 
        auth, 
        user: auth.user // 🚀 Provides the REAL user (with merchantId) to all children
      }}
    >
      {/* 🏛️ INSTITUTIONAL VIEWPORT
          'antialiased' for clean typography on mobile OLED screens.
      */}
      <div className="flex min-h-screen w-full flex-col bg-background selection:bg-primary/30 antialiased">
        {children}
      </div>
    </TelegramContext.Provider>
  );
}

/**
 * 🛰️ TELEGRAM IDENTITY HOOK
 * Allows any component to instantly access the authenticated Merchant/User session.
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
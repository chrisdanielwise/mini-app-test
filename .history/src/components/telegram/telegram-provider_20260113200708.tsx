"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTelegram } from "@/lib/hooks/use-telegram";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/lib/telegram/webapp";

export interface TelegramContextValue {
  auth: ReturnType<typeof useAuth>;
  isReady: boolean;
  mounted: boolean; 
  isTelegram: boolean;
  webApp: any;
  user: any; 
  getInitData: () => string | null;
  setBackButton: (visible: boolean, onClick?: () => void) => void;
  setMainButton: (params: any) => void;
  hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "warning" | "error") => void;
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

/**
 * 🛰️ TELEGRAM IDENTITY ENGINE (Institutional v13.0.10)
 * Logic: Dual-Path Authentication (Mini App InitData + Browser Magic Link Cookies).
 * Update: Removed login-page gate to allow auto-authentication inside the bot.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const handshakeLock = useRef(false);

  // 1. HARDWARE SYNC & MOUNTING
  useEffect(() => {
    setMounted(true);
    if (telegram?.isReady && telegram?.isTelegram) {
      console.log("📱 [Hardware_Sync] Telegram SDK Ready.");
      initializeNativeAppMode();
    }
  }, [telegram?.isReady, telegram?.isTelegram]);

 

  // 2. TRIGGER SYNC ON MOUNT OR AUTH CHANGE
  useEffect(() => {
    if (mounted && !auth.isAuthenticated && !auth.isLoading) {
      performHandshake();
    }
  }, [mounted, auth.isAuthenticated, auth.isLoading, performHandshake]);

  // --- RENDERING BARRIER ---
  if (!mounted) return null;

  // Loader prevents UI flicker during redirection or while Telegram is booting
  if (isRedirecting || (telegram?.isTelegram && !telegram?.isReady)) {
    return <LoadingScreen message="Establishing Secure Node Link..." subtext="VERIFYING PROTOCOL PERMISSIONS" />;
  }

  const safeWebApp = telegram?.webApp || (typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null);

  return (
    <TelegramContext.Provider 
      value={{ 
        isReady: telegram?.isReady || false,
        isTelegram: telegram?.isTelegram || false,
        getInitData: telegram?.getInitData || (() => null),
        setBackButton: telegram?.setBackButton || (() => {}),
        setMainButton: telegram?.setMainButton || (() => {}),
        hapticFeedback: telegram?.hapticFeedback || (() => {}),
        auth, 
        mounted,
        webApp: safeWebApp,
        user: auth.user || telegram?.user || null
      }}
    >
      <div className="relative flex min-h-[100dvh] w-full flex-col bg-background selection:bg-primary/30 antialiased overflow-x-hidden">
        {children}
        {/* Institutional Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>
    </TelegramContext.Provider>
  );
}

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) throw new Error("useTelegramContext missing");
  return context;
};
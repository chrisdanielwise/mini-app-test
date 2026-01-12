"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTelegram } from "@/lib/hooks/use-telegram";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/lib/telegram/webapp";

export interface TelegramContextValue {
  auth: ReturnType<typeof useAuth>;
  isReady: boolean;
  isTelegram: boolean;
  user: any; 
  getInitData: () => string | null;
  setBackButton: (visible: boolean, onClick?: () => void) => void;
  setMainButton: (params: any) => void;
  hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "warning" | "error") => void;
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

/**
 * 🛰️ TELEGRAM IDENTITY ENGINE (Apex Tier)
 * Normalized: Strict hydration barrier for zero-FOUC Telegram initialization.
 * Optimized: Kinetic handshake logic with role-based dashboard fast-tracking.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 🛡️ INITIALIZATION SYNC
  useEffect(() => {
    setMounted(true);
    if (telegram.isReady && telegram.isTelegram) {
      // API 8.0+: Synchronize native colors and disable elastic scroll
      initializeNativeAppMode();
    }
  }, [telegram.isReady, telegram.isTelegram]);

  /**
   * 🔐 IDENTITY HANDSHAKE PROTOCOL
   * Purpose: Exchanges Telegram initData for a secure JWT session.
   * Pathing: Fast-tracks institutional staff to the Command Center.
   */
  const performHandshake = useCallback(async () => {
    if (telegram.isReady && !auth.isAuthenticated && !auth.isLoading) {
      const initData = telegram.getInitData();
      if (!initData) return;

      try {
        const session = await auth.login(initData);
        
        // 🏛️ INSTITUTIONAL ROLE AUDIT
        const isStaff = ["MERCHANT", "PLATFORM_MANAGER", "SUPER_ADMIN", "STAFF"].includes(session.user.role);

        if (isStaff && (pathname === "/" || pathname === "/login")) {
          setIsRedirecting(true);
          telegram.hapticFeedback("success");
          router.replace("/dashboard");
        } else if (pathname === "/") {
          setIsRedirecting(true);
          router.replace("/home");
        }
      } catch (err) {
        console.error("[Handshake_Failure] Identity link rejected.");
        telegram.hapticFeedback("error");
      }
    }
  }, [telegram, auth, router, pathname]);

  useEffect(() => {
    performHandshake();
  }, [performHandshake]);

  // --- RENDERING BARRIER ---
  // Prevents unstyled content or partial renders during the security handshake
  if (!mounted || (telegram.isTelegram && !telegram.isReady) || isRedirecting) {
    return <LoadingScreen message="Establishing Secure Node Link..." />;
  }

  return (
    <TelegramContext.Provider value={{ ...telegram, auth, user: auth.user }}>
      {/* 🌌 GLOBAL VIEWPORT SHELL */}
      <div className="relative flex min-h-[100dvh] w-full flex-col bg-background selection:bg-primary/30 antialiased overflow-x-hidden">
        {children}
        
        {/* Kinetic Ambience Aura (Global Layer) */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>
    </TelegramContext.Provider>
  );
}

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) throw new Error("useTelegramContext must be used within a TelegramProvider");
  return context;
};
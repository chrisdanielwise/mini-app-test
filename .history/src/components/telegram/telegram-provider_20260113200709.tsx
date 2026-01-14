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

 /**
 * 🔐 OPTIMIZED IDENTITY HANDSHAKE (Institutional v13.0.15)
 * Logic: Prioritize existing session cookies to eliminate redundant handshakes.
 */
const performHandshake = useCallback(async () => {
  // 🛡️ GATE 1: CHECK LOCKS & AUTH STATUS
  // If auth.isAuthenticated is already true (from a cookie), the server already knows us.
  if (auth.isAuthenticated || auth.isLoading || handshakeLock.current) {
    return;
  }

  const initData = telegram.getInitData?.();

  // 📱 PATH A: TELEGRAM MINI APP HANDSHAKE
  if (initData) {
    try {
      handshakeLock.current = true;
      
      // OPTIMIZATION: Small delay to let the UI breathe, or remove if you want instant.
      console.log("🔐 [Handshake_Start] Synchronizing Identity...");
      
      const session = await auth.authenticate(); 
      
      if (!session) {
        handshakeLock.current = false;
        return;
      }

      console.log("✅ [Handshake_Success] Node Verified.");
      telegram.hapticFeedback?.("success");

      const role = session.role?.toUpperCase();
      const isPrivileged = ["MERCHANT", "PLATFORM_MANAGER", "SUPER_ADMIN", "PLATFORM_SUPPORT"].includes(role);

      if (isPrivileged) {
        setIsRedirecting(true);
        router.replace("/dashboard");
      } else {
        setIsRedirecting(true);
        router.replace("/home");
      }
    } catch (err: any) {
      handshakeLock.current = false;
      console.error("❌ [Handshake_Error]", err.message);
      telegram.hapticFeedback?.("error");
    }
  } 
  else {
    console.log("🌐 [Browser_Mode] Awaiting cookie or manual entry.");
  }
}, [telegram, auth, router]);

// 🏁 THE FAST-PATH TRIGGER
useEffect(() => {
  // If we have a valid cookie session already, don't even show the sync screen.
  // We go straight to where we belong.
  if (mounted && auth.isAuthenticated && !auth.isLoading) {
    const role = auth.user?.role?.toUpperCase();
    const isPrivileged = ["MERCHANT", "PLATFORM_MANAGER", "SUPER_ADMIN", "PLATFORM_SUPPORT"].includes(role);
    router.replace(isPrivileged ? "/dashboard" : "/home");
    return;
  }

  if (mounted && !auth.isAuthenticated && !auth.isLoading) {
    performHandshake();
  }
}, [mounted, auth.isAuthenticated, auth.isLoading, performHandshake, auth.user, router]);

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
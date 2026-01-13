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
 * 🛰️ TELEGRAM IDENTITY ENGINE (Institutional v13.0.6)
 * Logic: Dual-Path Authentication (Mini App InitData + Browser Magic Link Cookies).
 * Security: Hardened hydration gating to prevent "Application Error" desync.
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
      initializeNativeAppMode();
    }
  }, [telegram?.isReady, telegram?.isTelegram]);

  /**
   * 🔐 IDENTITY HANDSHAKE PROTOCOL
   * Logic: Supports automatic Mini App sync AND authenticated Browser sessions.
   */
  const performHandshake = useCallback(async () => {
    // 🛡️ GATE 1: Never handshake on the specific login gate
    if (pathname === "/login" || pathname === "/dashboard/login") return;

    // 🛡️ GATE 2: If already authenticated via Cookie or Token, skip handshake
    if (auth.isAuthenticated || auth.isLoading || handshakeLock.current) {
      return;
    }

    const initData = telegram.getInitData?.();

    // 📱 PATH A: TELEGRAM MINI APP
    if (initData) {
      try {
        handshakeLock.current = true;
        console.log("🔐 [Identity_Sync] Validating Telegram Node Identity...");
        
        const session = await auth.authenticate(); // Exchanges initData for Cookie
        
        if (!session) {
          handshakeLock.current = false;
          return;
        }

        const role = session.role?.toUpperCase();
        const isStaff = ["MERCHANT", "PLATFORM_MANAGER", "SUPER_ADMIN", "STAFF"].includes(role);

        // Routing Logic
        if (isStaff && (pathname === "/" || pathname.includes("login"))) {
          setIsRedirecting(true);
          telegram.hapticFeedback?.("success");
          router.replace("/dashboard");
        } else if (pathname === "/") {
          setIsRedirecting(true);
          router.replace("/home");
        }
      } catch (err) {
        handshakeLock.current = false;
        console.error("❌ [Handshake_Failure] Mini App identity link rejected.");
        telegram.hapticFeedback?.("error");
      }
    } 
    // 🌐 PATH B: WEB BROWSER
    else {
      // If no initData and not authenticated, we check if we should redirect to landing
      console.log("🌐 [Browser_Mode] No Telegram SDK found. Awaiting session cookie...");
      if (!auth.isAuthenticated && !auth.isLoading && pathname === "/") {
        // Option: Redirect to landing page if totally unauthenticated
        // router.replace("/landing");
      }
    }
  }, [telegram, auth, router, pathname]);

  // 2. TRIGGER SYNC
  useEffect(() => {
    if (mounted && !auth.isAuthenticated && !auth.isLoading) {
      performHandshake();
    }
  }, [mounted, auth.isAuthenticated, auth.isLoading, performHandshake]);

  // --- RENDERING BARRIER ---
  // 🚀 CRITICAL: Prevents hydration mismatch by returning null until client-ready.
  if (!mounted) return null;

  // Loader shows during active redirection or while Telegram is booting
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
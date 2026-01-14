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
 * 🛰️ TELEGRAM IDENTITY ENGINE (Institutional v13.0.20)
 * Logic: Dual-Path Authentication + Session Heartbeat.
 * Features: Fast-Path cookie bypass & persistent background session anchoring.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const handshakeLock = useRef(false);

  /**
   * 💓 SESSION HEARTBEAT MONITOR
   * Logic: Periodically pings the server to refresh JWT expiration and anchor the session.
   * Frequency: Every 15 minutes.
   */
  useEffect(() => {
    if (!auth.isAuthenticated || isRedirecting) return;

    const pulse = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/heartbeat", { method: "POST" });
        if (!res.ok) {
          console.warn("⚠️ [Heartbeat_Stall] Session anchor lost.");
        } else {
          console.log("💓 [Heartbeat_Pulse] Session node extended.");
        }
      } catch (err) {
        console.error("🔥 [Heartbeat_Fault] Pulse interrupted.");
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(pulse);
  }, [auth.isAuthenticated, isRedirecting]);

  // 1. HARDWARE SYNC & SDK MOUNTING
  useEffect(() => {
    setMounted(true);
    if (telegram?.isReady && telegram?.isTelegram) {
      console.log("📱 [Hardware_Sync] Telegram SDK Ready.");
      initializeNativeAppMode();
    }
  }, [telegram?.isReady, telegram?.isTelegram]);

  /**
   * 🔐 IDENTITY HANDSHAKE PROTOCOL
   * Purpose: Exchanges Telegram initData for a secure session cookie.
   */
  const performHandshake = useCallback(async () => {
    // 🛡️ GATE 1: CHECK LOCKS & AUTH STATUS
    if (auth.isAuthenticated || auth.isLoading || handshakeLock.current) {
      return;
    }

    const initData = telegram.getInitData?.();

    // 📱 PATH A: TELEGRAM MINI APP HANDSHAKE (Mobile Environment)
    if (initData) {
      try {
        handshakeLock.current = true;
        console.log("🔐 [Handshake_Start] Synchronizing Node Identity...");
        
        const session = await auth.authenticate(); 
        
        if (!session) {
          console.warn("⚠️ [Handshake_Stall] API returned no session. Retrying gate unlocked.");
          handshakeLock.current = false;
          return;
        }

        console.log("✅ [Handshake_Success] Node Verified. Role:", session.role);
        telegram.hapticFeedback?.("success");

        const role = session.role?.toUpperCase();
        
        // Institutional Role Check (Matches Prisma Enums)
        const isPrivileged = [
          "MERCHANT", 
          "SUPER_ADMIN", 
          "PLATFORM_MANAGER", 
          "PLATFORM_SUPPORT"
        ].includes(role);

        if (isPrivileged) {
          setIsRedirecting(true);
          router.replace("/dashboard");
        } else {
          setIsRedirecting(true);
          router.replace("/home");
        }
      } catch (err: any) {
        handshakeLock.current = false;
        console.error("❌ [Handshake_Error] Auth failed:", err.message);
        telegram.hapticFeedback?.("error");
      }
    } 
    // 🌐 PATH B: WEB BROWSER MODE (Cookie Only)
    else {
      console.log("🌐 [Browser_Mode] No Telegram context. Relying on Session Anchor.");
    }
  }, [telegram, auth, router, pathname]);

  // 2. TRIGGER SYNC WITH PERSISTENCE CHECK (Fast-Path)
  useEffect(() => {
    if (!mounted || auth.isLoading) return;

    // ⚡ FAST-PATH REDIRECT: Bypass sync screen if session is already active in cookies
    if (auth.isAuthenticated && auth.user) {
        const role = auth.user.role?.toUpperCase();
        const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT"].includes(role);
        
        if (pathname === "/" || pathname === "/dashboard/login") {
            router.replace(isPrivileged ? "/dashboard" : "/home");
        }
        return;
    }

    // 🔐 Try handshake if no active session
    if (!auth.isAuthenticated) {
      performHandshake();
    }
  }, [mounted, auth.isAuthenticated, auth.isLoading, performHandshake, auth.user, router, pathname]);

  // --- RENDERING BARRIER ---
  if (!mounted) return null;

  // Loader prevents UI flicker during redirection or slow SDK boots
  if (isRedirecting || (telegram?.isTelegram && !telegram?.isReady && !auth.isAuthenticated)) {
    return (
      <LoadingScreen 
        message="Establishing Secure Node Link..." 
        subtext="SYNCHRONIZING IDENTITY HANDSHAKE" 
      />
    );
  }

  const safeWebApp = telegram?.web || (typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null);

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
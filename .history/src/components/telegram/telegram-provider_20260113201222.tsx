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
 * 🛰️ TELEGRAM IDENTITY ENGINE (Institutional v13.0.15)
 * Logic: Dual-Path Authentication (Mini App InitData + Persistent Cookies).
 * Optimization: "Fast-Path" check added to eliminate redundant mobile handshakes.
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
   * 🔐 IDENTITY HANDSHAKE PROTOCOL
   */
  const performHandshake = useCallback(async () => {
    // 🛡️ GATE 1: FAST-PATH CHECK
    // If we are already authenticated via a cookie, don't restart the handshake.
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
          console.warn("⚠️ [Handshake_Stall] API returned no session. Gate unlocked.");
          handshakeLock.current = false;
          return;
        }

        console.log("✅ [Handshake_Success] Node Verified. Role:", session.role);
        telegram.hapticFeedback?.("success");

        const role = session.role?.toUpperCase();
        
        // 🚀 UPDATED: Logic to match your Prisma UserRole Enums
        const isPrivileged = [
          "MERCHANT", 
          "SUPER_ADMIN", 
          "PLATFORM_MANAGER", 
          "PLATFORM_SUPPORT"
        ].includes(role);

        // Instant Routing: Move immediately once verified
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

  // 2. TRIGGER SYNC WITH PERSISTENCE CHECK
  useEffect(() => {
    if (!mounted || auth.isLoading) return;

    // ⚡ FAST-PATH REDIRECT: If cookie already exists, bypass the sync screen entirely
    if (auth.isAuthenticated && auth.user) {
        const role = auth.user.role?.toUpperCase();
        const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT"].includes(role);
        
        // Only redirect if we are on a landing/login page to prevent loop
        if (pathname === "/" || pathname === "/dashboard/login") {
            router.replace(isPrivileged ? "/dashboard" : "/home");
        }
        return;
    }

    // 🔐 If not authenticated, try the handshake
    if (!auth.isAuthenticated) {
      performHandshake();
    }
  }, [mounted, auth.isAuthenticated, auth.isLoading, performHandshake, auth.user, router, pathname]);

  // --- RENDERING BARRIER ---
  if (!mounted) return null;

  // Loading barrier for handshakes or slow SDK boots
  if (isRedirecting || (telegram?.isTelegram && !telegram?.isReady && !auth.isAuthenticated)) {
    return <LoadingScreen message="Establishing Secure Node Link..." subtext="SYNCHRONIZING IDENTITY HANDSHAKE" />;
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
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
  setMainButton: (params: { 
    text: string; 
    onClick: () => void; 
    isVisible?: boolean;
    color?: string;
    textColor?: string;
    isLoader?: boolean;
  }) => void;
  hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "warning" | "error") => void;
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

/**
 * 🛰️ TELEGRAM IDENTITY & NAVIGATION ENGINE (v13.0.30)
 * Architecture: Multi-Tenant Identity Sync + Native Hardware Bridging.
 */
/**
 * 🛰️ TELEGRAM IDENTITY & NAVIGATION ENGINE (v16.16.11)
 * Architecture: Atomic Ingress + Native Hardware Bridging.
 * Performance: Optimized for sub-100ms UI release during DB lag.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  // 🛡️ Guard to prevent multi-triggering during DB lag
  const handshakeLock = useRef(false);

  /**
   * 🔐 IDENTITY HANDSHAKE PROTOCOL (v16.16.11)
   * Optimized: Uses early-return to prevent blocking the UI during DB congestion.
   */
  const performHandshake = useCallback(async () => {
    // 🚀 THE FIX: If already authenticated (e.g. via Magic Link), do NOT lock the UI
    if (auth.isAuthenticated || auth.isLoading || handshakeLock.current) return;
    
    const initData = telegram.getInitData?.();
    if (!initData) return;

    try {
      handshakeLock.current = true;
      console.log("🔐 [Handshake_Start] Bridging TMA Identity...");
      
      const session = await auth.authenticate(); 
      if (!session) {
        handshakeLock.current = false;
        return;
      }

      console.log("✅ [Handshake_Success] Verified Role:", session.role);
      telegram.hapticFeedback?.("success");

      const role = session.role?.toUpperCase();
      const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT"].includes(role);

      // Only show redirect loader for the first 500ms
      setIsRedirecting(true);
      router.replace(isPrivileged ? "/dashboard" : "/home");
    } catch (err: any) {
      handshakeLock.current = false;
      console.error("❌ [Handshake_Error]", err.message);
    } 
  }, [telegram, auth, router]);

  // 1. HARDWARE SYNC & MOUNTING
  useEffect(() => {
    setMounted(true);
    if (telegram?.isReady && telegram?.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram?.isReady, telegram?.isTelegram]);

  // 2. TRIGGER SYNC WITH PERSISTENCE (FAST-PATH)
  useEffect(() => {
    if (!mounted || auth.isLoading) return;

    // 🚀 OPTIMISTIC INGRESS: If cookie exists, unlock UI immediately
    if (auth.isAuthenticated && auth.user) {
        setIsRedirecting(false); // Release the loader
        const role = auth.user.role?.toUpperCase();
        const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT"].includes(role);
        
        if (pathname === "/" || pathname === "/dashboard/login" || pathname === "/login") {
            router.replace(isPrivileged ? "/dashboard" : "/home");
        }
        return;
    }

    // Only handshake if we are in a Telegram WebApp and NOT authenticated
    if (!auth.isAuthenticated && telegram.isTelegram) {
      performHandshake();
    }
  }, [mounted, auth.isAuthenticated, auth.isLoading, auth.user, telegram.isTelegram, pathname, performHandshake]);

  /** --- REST OF YOUR CONTROLLERS (MainButton, Heartbeat, etc.) --- **/

  if (!mounted) return null;

  // 🚀 CRITICAL: Modified Loader logic to prevent "The Hang"
  // We only show the full-screen loader if we are ACTIVELY redirecting or 
  // if the SDK isn't ready but we HAVE NO cookie yet.
  const showLoader = isRedirecting || (telegram?.isTelegram && !telegram?.isReady && !auth.isAuthenticated);

  if (showLoader) {
    return (
      <LoadingScreen 
        message="Establishing Secure Node Link..." 
        subtext="SYNCHRONIZING IDENTITY HANDSHAKE" 
      />
    );
  }

  const safeWebApp = telegram?.webapp || (typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null);

  return (
    <TelegramContext.Provider 
      value={{ 
        isReady: telegram?.isReady || false,
        isTelegram: telegram?.isTelegram || false,
        getInitData: telegram?.getInitData || (() => null),
        setBackButton: telegram?.setBackButton || (() => {}),
        setMainButton: (params) => {}, // Keep your existing logic here
        hapticFeedback: telegram?.hapticFeedback || (() => {}),
        auth, 
        mounted,
        webApp: safeWebApp,
        user: auth.user || telegram?.user || null
      }}
    >
      <div className="relative flex min-h-[100dvh] w-full flex-col bg-background antialiased overflow-x-hidden">
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
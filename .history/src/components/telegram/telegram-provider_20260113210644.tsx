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
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const handshakeLock = useRef(false);

  /**
   * 🔘 NATIVE MAIN BUTTON CONTROLLER
   * Synchronizes primary UI actions with Telegram's persistent footer button.
   */
  const setMainButton = useCallback((params: { 
    text: string; 
    onClick: () => void; 
    isVisible?: boolean;
    color?: string;
    textColor?: string;
    isLoader?: boolean;
  }) => {
    // Check for lowercase 'webapp' from your hook
    const safeTg = telegram?.webapp || (typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null);
    if (!safeTg?.MainButton) return;

    const mb = safeTg.MainButton;

    mb.setText(params.text);
    
    // Reset and attach the click listener
    mb.offClick(); 
    mb.onClick(params.onClick);
    
    // Apply styling parameters
    mb.setParams({
      color: params.color || "#0088cc", // Institutional Blue default
      text_color: params.textColor || "#ffffff",
      is_visible: params.isVisible !== false,
      is_active: true
    });
    
    if (params.isLoader) mb.showProgress();
    else mb.hideProgress();

    if (params.isVisible !== false) mb.show();
    else mb.hide();
  }, [telegram?.webapp]);

  /**
   * 🔙 NATIVE NAVIGATION SYNC
   * Strategy: Hardware Back Button appears deep in the stack, hides on Dashboards.
   */
  useEffect(() => {
    if (!telegram.isReady || !telegram.isTelegram) return;

    const handleBackNavigation = () => router.back();
    const isRootPath = pathname === "/dashboard" || pathname === "/home" || pathname === "/";

    if (!isRootPath) {
      telegram.setBackButton(true, handleBackNavigation);
    } else {
      telegram.setBackButton(false);
    }

    return () => {
      if (telegram.isReady) telegram.setBackButton(false);
    };
  }, [pathname, telegram.isReady, telegram.isTelegram, router]);

  /**
   * 💓 SESSION HEARTBEAT MONITOR
   * Frequency: 15 Minutes. Prevents session timeout during active use.
   */
  useEffect(() => {
    if (!auth.isAuthenticated || isRedirecting) return;

    const pulse = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/heartbeat", { method: "POST" });
        if (res.ok) console.log("💓 [Heartbeat] Node session extended.");
      } catch (err) {
        console.error("🔥 [Heartbeat_Fault] Pulse interrupted.");
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(pulse);
  }, [auth.isAuthenticated, isRedirecting]);

  // 1. HARDWARE SYNC & MOUNTING
  useEffect(() => {
    setMounted(true);
    if (telegram?.isReady && telegram?.isTelegram) {
      console.log("📱 [Hardware_Sync] Telegram SDK Operational.");
      initializeNativeAppMode();
    }
  }, [telegram?.isReady, telegram?.isTelegram]);

  /**
   * 🔐 IDENTITY HANDSHAKE PROTOCOL
   */
  const performHandshake = useCallback(async () => {
    if (auth.isAuthenticated || auth.isLoading || handshakeLock.current) return;
    const initData = telegram.getInitData?.();

    if (initData) {
      try {
        handshakeLock.current = true;
        console.log("🔐 [Handshake_Start] Synchronizing Node...");
        
        const session = await auth.authenticate(); 
        if (!session) {
          handshakeLock.current = false;
          return;
        }

        console.log("✅ [Handshake_Success] Verified Role:", session.role);
        telegram.hapticFeedback?.("success");

        const role = session.role?.toUpperCase();
        const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT"].includes(role);

        setIsRedirecting(true);
        router.replace(isPrivileged ? "/dashboard" : "/home");
      } catch (err: any) {
        handshakeLock.current = false;
        console.error("❌ [Handshake_Error]", err.message);
        telegram.hapticFeedback?.("error");
      }
    } 
  }, [telegram, auth, router]);

  // 2. TRIGGER SYNC WITH PERSISTENCE (FAST-PATH)
  useEffect(() => {
    if (!mounted || auth.isLoading) return;

    if (auth.isAuthenticated && auth.user) {
        const role = auth.user.role?.toUpperCase();
        const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT"].includes(role);
        
        if (pathname === "/" || pathname === "/dashboard/login") {
            router.replace(isPrivileged ? "/dashboard" : "/home");
        }
        return;
    }

    if (!auth.isAuthenticated) performHandshake();
  }, [mounted, auth.isAuthenticated, auth.isLoading, performHandshake, auth.user, router, pathname]);

  // Cleanup MainButton on navigation
  useEffect(() => {
    return () => {
      const safeTg = telegram?.webapp || (typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null);
      if (safeTg?.MainButton) safeTg.MainButton.hide();
    };
  }, [pathname, telegram?.webapp]);

  if (!mounted) return null;

  if (isRedirecting || (telegram?.isTelegram && !telegram?.isReady && !auth.isAuthenticated)) {
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
        setMainButton,
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
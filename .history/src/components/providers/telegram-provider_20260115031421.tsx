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
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

/**
 * 🌊 TELEGRAM_IDENTITY_ENGINE (v16.16.13)
 * Logic: Circular-dependency-safe initialization.
 * Fix: Uses low-level telegram object for internal haptics to prevent context errors.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  // 1. Low-level hook (DOES NOT use useTelegramContext)
  const telegram = useTelegram();
  // 2. Auth hook (Ensure this does not use useTelegramContext internally)
  const auth = useAuth();
  
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const handshakeLock = useRef(false);

  /**
   * 🛠️ INTERNAL HAPTIC BRIDGE
   * Logic: Directly accesses the telegram object to avoid useHaptics context requirement.
   */
  const triggerImpact = useCallback((style: "light" | "medium" | "heavy") => {
    telegram.webapp?.HapticFeedback?.impactOccurred(style);
  }, [telegram.webapp]);

  const triggerNotification = useCallback((type: "error" | "success" | "warning") => {
    telegram.webapp?.HapticFeedback?.notificationOccurred(type);
  }, [telegram.webapp]);

  /**
   * 🔐 IDENTITY HANDSHAKE PROTOCOL
   */
  const performHandshake = useCallback(async () => {
    if (auth.isAuthenticated || auth.isLoading || handshakeLock.current) return;
    
    const initData = telegram.getInitData?.();
    if (!initData) return;

    try {
      handshakeLock.current = true;
      triggerImpact("light"); 
      
      const session = await auth.authenticate(); 
      if (!session) {
        handshakeLock.current = false;
        return;
      }

      triggerNotification("success");

      const role = session.role?.toUpperCase();
      const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER"].includes(role);

      setIsRedirecting(true);
      router.replace(isPrivileged ? "/dashboard" : "/home");
    } catch (err: any) {
      handshakeLock.current = false;
      triggerNotification("error"); 
    } 
  }, [telegram, auth, router, triggerImpact, triggerNotification]);

  // 🏛️ 1. HARDWARE STABILIZATION
  useEffect(() => {
    setMounted(true);
    if (telegram?.isReady && telegram?.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram?.isReady, telegram?.isTelegram]);

  // 🏛️ 2. TRIGGER SYNC
  useEffect(() => {
    if (!mounted || auth.isLoading) return;

    if (auth.isAuthenticated && auth.user) {
        setIsRedirecting(false);
        const role = auth.user.role?.toUpperCase();
        const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER"].includes(role);
        
        if (["/", "/login", "/dashboard/login"].includes(pathname)) {
            router.replace(isPrivileged ? "/dashboard" : "/home");
        }
        return;
    }

    if (!auth.isAuthenticated && telegram.isTelegram) {
      performHandshake();
    }
  }, [mounted, auth.isAuthenticated, auth.isLoading, auth.user, telegram.isTelegram, pathname, performHandshake]);

  if (!mounted) return null;

  const showLoader = isRedirecting || (telegram?.isTelegram && !telegram?.isReady && !auth.isAuthenticated);

  if (showLoader) {
    return (
      <LoadingScreen 
        message="Establishing Secure Node Link..." 
        subtext="SYNCHRONIZING_IDENTITY_HANDSHAKE" 
      />
    );
  }

  return (
    <TelegramContext.Provider 
      value={{ 
        isReady: telegram?.isReady || false,
        isTelegram: telegram?.isTelegram || false,
        getInitData: telegram?.getInitData || (() => null),
        auth, 
        mounted,
        webApp: telegram?.webapp || null,
        user: auth.user || telegram?.user || null
      }}
    >
      <div className="relative flex min-h-[100dvh] w-full flex-col bg-background antialiased overflow-hidden">
        {children}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>
    </TelegramContext.Provider>
  );
}

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) throw new Error("useTelegramContext missing");
  return context;
};
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTelegram } from "@/lib/hooks/use-telegram";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";
import { useDeviceContext } from "@/components/providers/device-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";

/**
 * 🛰️ TELEGRAM_CONTEXT_VALUE
 * Strategy: Vertical Compression & Hardware-Safe Identity.
 */

const TelegramContext = createContext<TelegramContextValue | null>(null);

/**
 * 🔐 TELEGRAM_HANDSHAKE_GATE
 * Logic: morphology-aware stationary horizon during ingress.
 */
function TelegramHandshakeGate({ children }: { children: ReactNode }) {
  const { auth, isTelegram, isReady, getInitData, webApp } = useTelegramContext();
  const { screenSize, safeArea } = useDeviceContext(); 
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const handshakeLock = useRef(false);

  const triggerImpact = useCallback((style: "light" | "medium" | "heavy") => {
    webApp?.HapticFeedback?.impactOccurred(style);
  }, [webApp]);

  const triggerNotification = useCallback((type: "error" | "success" | "warning") => {
    webApp?.HapticFeedback?.notificationOccurred(type);
  }, [webApp]);

  const performHandshake = useCallback(async () => {
    if (auth.isAuthenticated || auth.isLoading || handshakeLock.current) return;
    const initData = getInitData();
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
  }, [auth, getInitData, triggerImpact, triggerNotification, router]);

  useEffect(() => {
    if (auth.isLoading) return;

    if (auth.isAuthenticated && auth.user) {
        setIsRedirecting(false);
        const role = auth.user.role?.toUpperCase();
        const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER"].includes(role);
        
        if (["/", "/login", "/dashboard/login"].includes(pathname)) {
            router.replace(isPrivileged ? "/dashboard" : "/home");
        }
        return;
    }

    if (!auth.isAuthenticated && isTelegram && isReady) {
      performHandshake();
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user, isTelegram, isReady, pathname, performHandshake, router]);

  // 🏛️ INGRESS SHIELD: High-density clinical loader
  const showLoader = isRedirecting || (isTelegram && !isReady && !auth.isAuthenticated);

  if (showLoader) {
    return (
      <div 
        className="flex flex-col w-full bg-black transition-all duration-700 overflow-hidden"
        style={{ 
          height: `calc(var(--vh, 1vh) * 100)`,
          paddingTop: safeArea.top,
          paddingBottom: safeArea.bottom
        }}
      >
        <LoadingScreen 
          message="establishing_secure_link..." 
          subtext={`calibrating_${screenSize.toLowerCase()}_node`} 
        />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * 🏛️ TELEGRAM_PROVIDER
 * Purpose: Context Root with Hardware Synchronization.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useInstitutionalAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (telegram?.isReady && telegram?.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram?.isReady, telegram?.isTelegram]);

  if (!mounted) return null;

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
      <TelegramHandshakeGate>
        <div 
          className={cn(
            "relative flex w-full flex-col bg-background antialiased overflow-hidden",
            "transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          )}
          style={{ minHeight: `calc(var(--vh, 1vh) * 100)` }}
        >
          {children}
          {/* 🛰️ STATIONARY GRID: Tactile anchor */}
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
        </div>
      </TelegramHandshakeGate>
    </TelegramContext.Provider>
  );
}

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) throw new Error("useTelegramContext missing");
  return context;
};
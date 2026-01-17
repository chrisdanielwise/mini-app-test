"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTelegram } from "@/lib/hooks/use-telegram";
// 🛠️ FIX: Corrected import name to match Institutional Apex standards
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/lib/telegram/webapp";

export interface TelegramContextValue {
  auth: ReturnType<typeof useInstitutionalAuth>;
  isReady: boolean;
  mounted: boolean; 
  isTelegram: boolean;
  webApp: any;
  user: any; 
  getInitData: () => string | null;
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

function TelegramHandshakeGate({ children }: { children: ReactNode }) {
  const { auth, isTelegram, isReady, getInitData, webApp } = useTelegramContext();
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

  const showLoader = isRedirecting || (isTelegram && !isReady && !auth.isAuthenticated);

  if (showLoader) {
    return (
      <LoadingScreen 
        message="Establishing Secure Node Link..." 
        subtext="SYNCHRONIZING_IDENTITY_HANDSHAKE" 
      />
    );
  }

  return <>{children}</>;
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useInstitutionalAuth(); // 🛠️ FIX: Applied corrected hook name
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
        <div className="relative flex min-h-[100dvh] w-full flex-col bg-background antialiased overflow-hidden">
          {children}
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
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
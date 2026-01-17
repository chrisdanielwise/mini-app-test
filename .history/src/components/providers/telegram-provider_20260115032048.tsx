"use client";

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback, 
  useRef, 
  type ReactNode 
} from "react";
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
 * 🛰️ IDENTITY_HANDSHAKE_NODE
 * Logic: Extracted from Provider to prevent circular context dependency.
 * This component runs INSIDE the provider, so it can safely use hooks.
 */
function IdentityHandshakeNode({ children }: { children: ReactNode }) {
  const { auth, isReady, isTelegram, getInitData, webApp } = useTelegramContext();
  const router = useRouter();
  const pathname = usePathname();
  const handshakeLock = useRef(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const performHandshake = useCallback(async () => {
    if (auth.isAuthenticated || auth.isLoading || handshakeLock.current) return;
    const initData = getInitData();
    if (!initData) return;

    try {
      handshakeLock.current = true;
      webApp?.HapticFeedback?.impactOccurred("light");
      
      const session = await auth.authenticate(); 
      if (!session) {
        handshakeLock.current = false;
        return;
      }

      webApp?.HapticFeedback?.notificationOccurred("success");
      const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER"].includes(session.role?.toUpperCase());
      
      setIsRedirecting(true);
      router.replace(isPrivileged ? "/dashboard" : "/home");
    } catch (err) {
      handshakeLock.current = false;
      webApp?.HapticFeedback?.notificationOccurred("error");
    } 
  }, [auth, getInitData, webApp, router]);

  useEffect(() => {
    if (auth.isLoading) return;

    if (auth.isAuthenticated && auth.user) {
      setIsRedirecting(false);
      if (["/", "/login", "/dashboard/login"].includes(pathname)) {
        const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER"].includes(auth.user.role?.toUpperCase());
        router.replace(isPrivileged ? "/dashboard" : "/home");
      }
      return;
    }

    if (!auth.isAuthenticated && isTelegram && isReady) {
      performHandshake();
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user, isTelegram, isReady, pathname, performHandshake, router]);

  if (isRedirecting) {
    return <LoadingScreen message="Identity_Anchored..." subtext="REWRITING_TERMINAL_STATE" />;
  }

  return <>{children}</>;
}

/**
 * 🌊 TELEGRAM_PROVIDER (Standard v16.16.13)
 * Logic: Pure Provider - No internal hooks that call useTelegramContext.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
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
      <IdentityHandshakeNode>
        <div className="relative flex min-h-[100dvh] w-full flex-col bg-background antialiased overflow-hidden">
          {children}
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </IdentityHandshakeNode>
    </TelegramContext.Provider>
  );
}

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) throw new Error("useTelegramContext missing");
  return context;
};
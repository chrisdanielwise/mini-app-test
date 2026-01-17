"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTelegram } from "@/lib/hooks/use-telegram";
import { useAuth } from "@/lib/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/lib/telegram/webapp";
import { useHaptics } from "@/lib/hooks/use-haptics";

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
 * 🌊 TELEGRAM_IDENTITY_ENGINE (v16.16.12)
 * Logic: Atomic Ingress with Optimistic Handshake & Haptic Verification.
 * Hardware: Bridged to Native v7.10+ APIs with Legacy v6.0 Fallback.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { impact, notification } = useHaptics();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // 🛡️ ATOMIC LOCK: Prevents race conditions during sub-100ms UI release
  const handshakeLock = useRef(false);

  /**
   * 🔐 IDENTITY HANDSHAKE PROTOCOL
   * Logic: Non-blocking async verification with Haptic Success/Error triggers.
   */
  const performHandshake = useCallback(async () => {
    if (auth.isAuthenticated || auth.isLoading || handshakeLock.current) return;
    
    const initData = telegram.getInitData?.();
    if (!initData) return;

    try {
      handshakeLock.current = true;
      impact("light"); // 🏁 TACTILE: Initialization tick
      
      const session = await auth.authenticate(); 
      if (!session) {
        handshakeLock.current = false;
        return;
      }

      // Handshake Success: Tactile Confirmation
      notification("success");

      const role = session.role?.toUpperCase();
      const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER"].includes(role);

      setIsRedirecting(true);
      router.replace(isPrivileged ? "/dashboard" : "/home");
    } catch (err: any) {
      handshakeLock.current = false;
      notification("error"); // 🏁 TACTILE: Error vibration
    } 
  }, [telegram, auth, router, impact, notification]);

  // 🏛️ 1. HARDWARE STABILIZATION
  useEffect(() => {
    setMounted(true);
    if (telegram?.isReady && telegram?.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram?.isReady, telegram?.isTelegram]);

  // 🏛️ 2. TRIGGER SYNC WITH PERSISTENCE (Fast-Path)
  useEffect(() => {
    if (!mounted || auth.isLoading) return;

    // 🚀 OPTIMISTIC INGRESS: Immediate UI Unlock
    if (auth.isAuthenticated && auth.user) {
        setIsRedirecting(false);
        const role = auth.user.role?.toUpperCase();
        const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER"].includes(role);
        
        // Block redundant redirects if already on-station
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

  // 🏛️ 3. DYNAMIC INGRESS SHIELD
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
        setBackButton: telegram?.setBackButton || (() => {}),
        setMainButton: telegram?.setMainButton || (() => {}),
        hapticFeedback: telegram?.hapticFeedback || (() => {}),
        auth, 
        mounted,
        webApp: telegram?.webapp || null,
        user: auth.user || telegram?.user || null
      }}
    >
      <div className="relative flex min-h-[100dvh] w-full flex-col bg-background antialiased overflow-hidden">
        {children}
        {/* 🏛️ INSTITUTIONAL MESH: The Subsurface Grid */}
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
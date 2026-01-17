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

/**
 * 🛰️ ARCHITECTURAL ALERT: REFACTORING PROTOCOL
 * Merging: Redundant initialization checks into a single Hardware Stabilization effect.
 * Extraction: Moving Haptic Feedback to local bridge to prevent Context circularity.
 */

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

export function TelegramProvider({ children }: { children: ReactNode }) {
  // 🛡️ PROTOCOL: Raw hook ingress only (bypass useTelegramContext/useHaptics)
  const telegram = useTelegram(); 
  const auth = useAuth();
  
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const handshakeLock = useRef(false);

  /**
   * 🛠️ TACTICAL LOCAL BRIDGE
   * Logic: Direct hardware access via telegram object.
   * Standard: v9.4.4 Security Guard (Zero-Context Dependency).
   */
  const triggerHaptic = useCallback((type: "light" | "medium" | "heavy" | "success" | "error") => {
    if (!telegram.webapp?.HapticFeedback) return;
    
    if (["success", "error"].includes(type)) {
      telegram.webapp.HapticFeedback.notificationOccurred(type as "success" | "error");
    } else {
      telegram.webapp.HapticFeedback.impactOccurred(type as "light" | "medium" | "heavy");
    }
  }, [telegram.webapp]);

  /**
   * 🔐 IDENTITY HANDSHAKE PROTOCOL
   * Purpose: Establish secure node link without triggering context race conditions.
   */
  const performHandshake = useCallback(async () => {
    if (auth.isAuthenticated || auth.isLoading || handshakeLock.current) return;
    
    const initData = telegram.getInitData?.();
    if (!initData) return;

    try {
      handshakeLock.current = true;
      triggerHaptic("light"); 
      
      const session = await auth.authenticate(); 
      if (!session) {
        handshakeLock.current = false;
        return;
      }

      triggerHaptic("success");

      const role = session.role?.toUpperCase();
      const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER"].includes(role);

      setIsRedirecting(true);
      router.replace(isPrivileged ? "/dashboard" : "/home");
    } catch (err: any) {
      handshakeLock.current = false;
      triggerHaptic("error"); 
    } 
  }, [telegram, auth, router, triggerHaptic]);

  // 🏛️ 1. HARDWARE STABILIZATION (Extraction Protocol)
  useEffect(() => {
    setMounted(true);
    if (telegram?.isReady && telegram?.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram?.isReady, telegram?.isTelegram]);

  // 🏛️ 2. IDENTITY SYNC (Standardization Guard)
  useEffect(() => {
    if (!mounted || auth.isLoading) return;

    if (auth.isAuthenticated && auth.user) {
        setIsRedirecting(false);
        const role = auth.user.role?.toUpperCase();
        const isPrivileged = ["MERCHANT", "SUPER_ADMIN", "PLATFORM_MANAGER"].includes(role);
        
        // Block redundant redirects (v9.4.4 Security Rule)
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

  // 🏛️ 3. INGRESS SHIELD
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
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
  isTelegram: boolean;
  user: any; 
  getInitData: () => string | null;
  setBackButton: (visible: boolean, onClick?: () => void) => void;
  setMainButton: (params: any) => void;
  hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "warning" | "error") => void;
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

/**
 * 🛰️ TELEGRAM IDENTITY ENGINE
 * Logic: Hardened Identity Handshake with One-Shot Execution.
 * Fixed: Infinite 200/302 refresh storm resolved via handshakeLock Ref.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // 🛡️ THE IDENTITY LOCK: Prevents multiple concurrent or sequential login attempts
  const handshakeLock = useRef(false);

  // 1. HARDWARE SYNC
  useEffect(() => {
    setMounted(true);
    if (telegram.isReady && telegram.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram.isReady, telegram.isTelegram]);

  /**
   * 🔐 IDENTITY HANDSHAKE PROTOCOL
   * Logic: Idempotent execution. Once it runs, it locks itself.
   */
  const performHandshake = useCallback(async () => {
    // 🚩 EXIT CONDITIONS: Already authenticated, currently loading, or already attempted
    if (
      !telegram.isReady || 
      auth.isAuthenticated || 
      auth.isLoading || 
      handshakeLock.current
    ) {
      return;
    }

    const initData = telegram.getInitData();
    if (!initData) return;

    try {
      // 🔒 LOCK the handshake immediately
      handshakeLock.current = true;
      
      console.log("[Identity_Sync] Initializing Handshake...");
      const session = await auth.login(initData);
      
      // 🏛️ INSTITUTIONAL ROLE AUDIT
      const isStaff = ["MERCHANT", "PLATFORM_MANAGER", "SUPER_ADMIN", "STAFF"].includes(session.user.role);

      // Only redirect if we are on an entry-level route
      if (isStaff && (pathname === "/" || pathname === "/dashboard/login")) {
        setIsRedirecting(true);
        telegram.hapticFeedback("success");
        router.replace("/dashboard");
      } else if (pathname === "/") {
        setIsRedirecting(true);
        router.replace("/home");
      }
    } catch (err) {
      // 🚩 On failure, unlock to allow manual retry if necessary
      handshakeLock.current = false;
      console.error("[Handshake_Failure] Identity link rejected.");
      telegram.hapticFeedback("error");
    }
  }, [telegram, auth, router, pathname]);

  useEffect(() => {
    // Only attempt handshake if the SDK is ready and we aren't already authenticated
    if (telegram.isReady && !auth.isAuthenticated) {
      performHandshake();
    }
  }, [telegram.isReady, auth.isAuthenticated, performHandshake]);

  // --- RENDERING BARRIER ---
  // Gated by mounted status and redirect state to stop "Page Content Flickering"
  if (!mounted || (telegram.isTelegram && !telegram.isReady) || isRedirecting) {
    return <LoadingScreen message="Establishing Secure Node Link..." />;
  }

  return (
    <TelegramContext.Provider value={{ ...telegram, auth, user: auth.user }}>
      <div className="relative flex min-h-[100dvh] w-full flex-col bg-background selection:bg-primary/30 antialiased overflow-x-hidden">
        {children}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>
    </TelegramContext.Provider>
  );
}

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) throw new Error("useTelegramContext must be used within a TelegramProvider");
  return context;
};
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTelegram } from "@/lib/hooks/use-telegram";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/lib/telegram/webapp";

// 🛡️ UPDATED INTERFACE: Added 'webApp' and 'mounted' to resolve TypeScript errors
export interface TelegramContextValue {
  auth: ReturnType<typeof useAuth>;
  isReady: boolean;
  mounted: boolean; // Required for Hydration Shield
  isTelegram: boolean;
  webApp: any;      // Native Telegram WebApp Object
  user: any; 
  getInitData: () => string | null;
  setBackButton: (visible: boolean, onClick?: () => void) => void;
  setMainButton: (params: any) => void;
  hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "warning" | "error") => void;
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

/**
 * 🛰️ TELEGRAM IDENTITY ENGINE (Institutional v12.33.0)
 * Logic: Hardened Identity Handshake with Native Bridge Sync.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const handshakeLock = useRef(false);

  // 1. HARDWARE SYNC & NATIVE BRIDGE
  useEffect(() => {
    setMounted(true);
    if (telegram.isReady && telegram.isTelegram) {
      initializeNativeAppMode();
      console.log("🛰️ [Telegram_SDK] Native Bridge Synchronized.");
    }
  }, [telegram.isReady, telegram.isTelegram]);

  /**
   * 🔐 IDENTITY HANDSHAKE PROTOCOL
   */
  const performHandshake = useCallback(async () => {
    if (pathname === "/dashboard/login") return;

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
      handshakeLock.current = true;
      console.log("🔐 [Identity_Sync] Validating Node Identity...");
      
      const session = await auth.authenticate();
      
      if (!session) {
        handshakeLock.current = false;
        return;
      }

      const role = session.role?.toUpperCase();
      const isStaff = ["MERCHANT", "PLATFORM_MANAGER", "SUPER_ADMIN", "STAFF"].includes(role);

      // Routing for Tommy Tactical Staff vs Standard Users
      if (isStaff && (pathname === "/" || pathname === "/dashboard/login")) {
        setIsRedirecting(true);
        telegram.hapticFeedback("success");
        router.replace("/dashboard");
      } else if (pathname === "/") {
        setIsRedirecting(true);
        router.replace("/home");
      }
    } catch (err) {
      handshakeLock.current = false;
      console.error("❌ [Handshake_Failure] Identity link rejected.");
      telegram.hapticFeedback("error");
    }
  }, [telegram, auth, router, pathname]);

  // 2. TRIGGER IDENTITY SYNC
  useEffect(() => {
    if (telegram.isReady && !auth.isAuthenticated && pathname !== "/dashboard/login") {
      performHandshake();
    }
  }, [telegram.isReady, auth.isAuthenticated, performHandshake, pathname]);

  // --- RENDERING BARRIER ---
  // The 'mounted' check prevents layout shifts during the initial hardware handshake.
  if (!mounted || (telegram.isTelegram && !telegram.isReady) || isRedirecting) {
    return <LoadingScreen message="Establishing Secure Node Link..." subtext="SYNCING WITH NEON DATABASE" />;
  }

  return (
    <TelegramContext.Provider 
      value={{ 
        ...telegram, 
        auth, 
        mounted, // Now exposed to components
        webApp: (telegram as any).webApp || (typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null),
        user: auth.user 
      }}
    >
      <div className="relative flex min-h-[100dvh] w-full flex-col bg-background selection:bg-primary/30 antialiased overflow-x-hidden">
        {children}
        {/* Subtle Grid Overlay for Tactical Aesthetic */}
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
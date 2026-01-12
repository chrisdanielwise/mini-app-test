"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTelegram } from "@/src/lib/hooks/use-telegram";
import { useAuth } from "@/src/lib/hooks/use-auth";
import { LoadingScreen } from "@/src/components/ui/loading-spinner";
import { initializeNativeAppMode } from "@/src/lib/telegram/webapp";

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

export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (telegram.isReady && telegram.isTelegram) {
      initializeNativeAppMode();
    }
  }, [telegram.isReady, telegram.isTelegram]);

  /**
   * 🔐 IDENTITY HANDSHAKE & MERCHANT BYPASS
   * Uses UserRole.MERCHANT to fast-track routing to the dashboard.
   */
  useEffect(() => {
    const performHandshake = async () => {
      if (telegram.isReady && !auth.isAuthenticated && !auth.isLoading) {
        const initData = telegram.getInitData();
        if (initData) {
          try {
            const session = await auth.login(initData);
            
            // 🛡️ ROLE-BASED ROUTING
            // Global check: Is the user a MERCHANT, PLATFORM_MANAGER, or SUPER_ADMIN?
            const isStaff = ["MERCHANT", "PLATFORM_MANAGER", "SUPER_ADMIN"].includes(session.user.role);

            if (isStaff && pathname === "/") {
              setIsRedirecting(true);
              router.replace("/dashboard");
            } else if (pathname === "/") {
              setIsRedirecting(true);
              router.replace("/home");
            }
          } catch (err) {
            console.error("[Handshake_Error] Identity link failed.");
          }
        }
      }
    };
    performHandshake();
  }, [telegram.isReady, auth.isAuthenticated, auth.isLoading, telegram, auth, router, pathname]);

  if (!mounted || (telegram.isTelegram && !telegram.isReady) || isRedirecting) {
    return <LoadingScreen message="Establishing Secure Node Link..." />;
  }

  return (
    <TelegramContext.Provider value={{ ...telegram, auth, user: auth.user }}>
      <div className="flex min-h-screen w-full flex-col bg-background selection:bg-primary/30 antialiased">
        {children}
      </div>
    </TelegramContext.Provider>
  );
}

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) throw new Error("useTelegramContext must be used within a TelegramProvider");
  return context;
};
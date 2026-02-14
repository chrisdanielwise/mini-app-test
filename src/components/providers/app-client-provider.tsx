"use client";

import * as React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ APP_CLIENT_PROVIDER (v2026.1.21)
 * Strategy: Hydration Shielding & Context Safety.
 * Fixes: Prerender "useContext" null error by deferring context-dependent logic 
 * until the component is mounted on the client.
 */
export function AppClientProvider({ children }: { children: React.ReactNode }) {
  // 🛡️ HYDRATION GUARD: Vital for Render/Next.js Build Stability
  const [mounted, setMounted] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** * 🔍 SAFE CONTEXT ACCESS
   * We access contexts optionally because during pre-rendering, these providers
   * may return null, which causes the "destructuring of null" crash.
   */
  const layout = useLayout();
  const haptics = useHaptics();
  const device = useDeviceContext();

  const flavor = layout?.flavor || "DEFAULT";
  const impact = haptics?.impact;
  const isDeviceReady = device?.isReady || false;
  
  const isStaff = flavor === "AMBER";
  const didInit = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set mounted true once the browser takes over
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * 🪜 TELEGRAM HANDSHAKE PROTOCOL
   * Logic: Capability injection & Version-aware recalibration.
   */
  const initTMA = useCallback((force = false) => {
    // Exit if server-side or not yet mounted to prevent 'window' errors
    if (typeof window === "undefined" || !mounted) return false;

    const isAtGate = pathname.includes("/login") || searchParams.get('reason');
    
    if (isAtGate) {
      setIsClientReady(true);
      didInit.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return true;
    }

    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return false;
    if (didInit.current && !force) return true;

    tg.ready();
    tg.expand();
    
    // 🛡️ PROTOCOL VERSION CHECK
    const isVersionAtLeast = (ver: string) => {
      try {
        const current = tg.version.split('.').map(Number);
        const target = ver.split('.').map(Number);
        for (let i = 0; i < Math.max(current.length, target.length); i++) {
          if ((current[i] || 0) > (target[i] || 0)) return true;
          if ((current[i] || 0) < (target[i] || 0)) return false;
        }
        return true;
      } catch (e) { return false; }
    };

    const hasV61 = isVersionAtLeast("6.1");

    // 1. Hardware Control Sync
    if (hasV61) {
      try {
        if (typeof tg.disableVerticalSwipes === 'function') tg.disableVerticalSwipes();
        if (typeof tg.enableClosingConfirmation === 'function') tg.enableClosingConfirmation(); 
      } catch (e) { console.warn("🛰️ [Hardware_Access] Restricted."); }
    }

    if (!didInit.current && impact) impact("light");

    // 2. Apex Variable Bridge
    const theme = tg.themeParams || {};
    const root = document.documentElement;
    
    const themeMap = {
      '--tg-bg': theme.bg_color || '#000000',
      '--tg-secondary-bg': theme.secondary_bg_color || '#050505',
      '--tg-accent': isStaff ? '#f59e0b' : (theme.button_color || '#10b981'),
      '--tg-text': theme.text_color || '#ffffff',
    };

    Object.entries(themeMap).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 3. Native Chrome Ingress
    if (hasV61 && typeof tg.setHeaderColor === 'function') {
      try {
        const headerHex = isStaff ? "#050505" : (theme.secondary_bg_color || "#000000");
        tg.setHeaderColor(headerHex);
        tg.setBackgroundColor(theme.bg_color || "#000000");
      } catch (e) { console.warn("🛰️ [Chrome_Sync] Restricted."); }
    }

    didInit.current = true;
    setIsClientReady(true);
    return true;
  }, [isStaff, pathname, searchParams, impact, mounted]);

  // High-Frequency Polling
  useEffect(() => {
    if (!mounted || didInit.current) return;
    if (initTMA()) return;

    intervalRef.current = setInterval(() => {
      if (initTMA()) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 100); 

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [initTMA, mounted]);

  // Route Synchronization
  useEffect(() => {
    if (mounted && didInit.current) initTMA(true); 
  }, [isStaff, pathname, initTMA, mounted]);

  /**
   * 🧱 BUILD-TIME FALLBACK
   * If we are not mounted, we return a simple container to satisfy the Build Worker
   * and prevent the "useContext" null crash.
   */
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black" aria-hidden="true" />
    );
  }

  const isFullyStabilized = isClientReady && isDeviceReady;

  return (
    <>
      <Script 
        key="telegram-ingress-core"
        src="https://telegram.org/js/telegram-web-app.js" 
        strategy="beforeInteractive" 
      />
      <div 
        className={cn(
          "w-full flex flex-col antialiased bg-background",
          "transition-all duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          isFullyStabilized 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {children}
      </div>
    </>
  );
}
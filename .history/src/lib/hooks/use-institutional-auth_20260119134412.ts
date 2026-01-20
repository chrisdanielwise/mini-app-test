"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getInitData } from "@/lib/telegram/webapp";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🛰️ MASTER AUTH ENGINE (Institutional Apex v2026.1.20 - HARDENED)
 * Standard: v9.9.8 Security Guard with Atomic Vault Recovery.
 * Fix: Synchronized roleFlags with strictly UPPERCASE system enums.
 * Fix: Standardized fetch response parsing for Institutional Egress.
 */
export function useInstitutionalAuth() {
  const [state, setState] = useState({
    user: null as any,
    isLoading: true,
    isAuthenticated: false,
    error: null as string | null,
  });

  const authLock = useRef(false);

  // 🛡️ ROLE TELEMETRY: Strictly UPPERCASE for 2026 Institutional Logic
  const roleFlags = useMemo(() => {
    const role = state.user?.role?.toUpperCase();
    return {
      // ✅ FIX: Standardized staff hierarchy flags
      isStaff: ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "AMBER"].includes(role || ""),
      isMerchant: role === "MERCHANT" || role === "OWNER",
      isUser: role === "USER",
    };
  }, [state.user?.role]);

  // 🛡️ VAULT RECOVERY: TMA Cross-Origin Mitigation
  // Logic: Partitioned storage resolution for iOS/Android WebView sandboxes.
  const getNativeToken = useCallback(async (): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    const tg = (window as any).Telegram?.WebApp;
    
    // Fallback to localStorage if not inside Telegram environment
    if (!tg) return localStorage.getItem(JWT_CONFIG.storageKey);

    return new Promise((resolve) => {
      // 🛰️ SIGNAL PRIORITY 1: Secure Storage (Cloud Sync v8.0+)
      if (tg.SecureStorage && tg.isVersionAtLeast("8.0")) {
        return tg.SecureStorage.getItem(JWT_CONFIG.storageKey, (_: any, val: string) => resolve(val || null));
      }
      // 🛰️ SIGNAL PRIORITY 2: Cloud Storage (Standard v6.9+)
      if (tg.CloudStorage && tg.isVersionAtLeast("6.9")) {
        return tg.CloudStorage.getItem(JWT_CONFIG.storageKey, (_: any, val: string) => resolve(val || null));
      }
      resolve(localStorage.getItem(JWT_CONFIG.storageKey));
    });
  }, []);

  // 🔐 ATOMIC HANDSHAKE
  const authenticate = useCallback(async (tokenOverride?: string) => {
    const initData = getInitData();
    if (!initData && !tokenOverride) {
      setState(p => ({ ...p, isLoading: false }));
      return null;
    }

    try {
      const response = await fetch(JWT_CONFIG.endpoints.telegramAuth, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            initData: tokenOverride ? null : initData, 
            token: tokenOverride || null 
        }),
      });

      const result = await response.json();
      // ✅ FIX: Institutional Egress check
      if (!response.ok || !result.success) throw new Error("IDENTITY_SYNC_FAILED");

      const { user, token } = result.data;
      if (token) localStorage.setItem(JWT_CONFIG.storageKey, token);

      setState({ user, isAuthenticated: true, isLoading: false, error: null });
      return user;
    } catch (err: any) {
      setState(p => ({ ...p, isLoading: false, error: err.message }));
      return null;
    }
  }, []);

  // 🛰️ IDENTITY SYNC: Hydration Barrier logic
  useEffect(() => {
    if (authLock.current) return;
    authLock.current = true;

    const syncIdentity = async () => {
      try {
        const res = await fetch(JWT_CONFIG.endpoints.profile);
        const result = await res.json();

        // 🛡️ HEARTBEAT_SYNC: If profile exists, node is hot.
        if (res.ok && (result.success || result.data)) {
          setState({ 
            user: result.data.user || result.data, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null 
          });
        } else {
          // 🔄 RECOVERY: If profile fails, attempt vault recovery.
          const nativeToken = await getNativeToken();
          await authenticate(nativeToken || undefined);
        }
      } catch {
        await authenticate();
      }
    };

    syncIdentity();
  }, [authenticate, getNativeToken]);

  return { 
    ...state, 
    ...roleFlags,
    isLocked: state.isLoading, 
    authenticate 
  };
}
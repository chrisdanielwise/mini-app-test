"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getInitData } from "@/lib/telegram/webapp";
import { JWT_CONFIG } from "@/lib/auth/config"; // 🚀 Centralized Source of Truth
import { toast } from "sonner";

interface User {
  id: string;
  telegramId: string;
  fullName: string | null;
  username: string | null;
  role: string;
  merchant: {
    id: string;
    companyName: string | null;
    planStatus: string;
  } | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isReady: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * 🛰️ IDENTITY ARCHITECT (v12.6.0)
 * Architecture: Native Hybrid Persistence (Cookie + SecureStorage)
 * Logic: Synchronized with JWT_CONFIG for cross-environment compatibility.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isReady: false, 
    isAuthenticated: false,
    error: null,
  });

  const authAttempted = useRef(false);

  /**
   * 🛡️ NATIVE SECURE STORAGE HELPERS
   * Targets Bot API 9.0+ SecureStorage or falls back to standard localStorage.
   */
  const getNativeToken = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.SecureStorage && tg.isVersionAtLeast("9.0")) {
        tg.SecureStorage.getItem(JWT_CONFIG.storageKey, (err: any, value: string) => {
          resolve(err ? null : value || null);
        });
      } else {
        resolve(localStorage.getItem(JWT_CONFIG.storageKey));
      }
    });
  }, []);

  const setNativeToken = useCallback((token: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.SecureStorage && tg.isVersionAtLeast("9.0")) {
        tg.SecureStorage.setItem(JWT_CONFIG.storageKey, token, (err: any, success: boolean) => {
          resolve(!!success);
        });
      } else {
        localStorage.setItem(JWT_CONFIG.storageKey, token);
        resolve(true);
      }
    });
  }, []);

  /**
   * 🔐 AUTHENTICATE
   * Standard: Exchange Telegram initData for an HttpOnly Session + Native Anchor.
   */
  const authenticate = useCallback(async (merchantId?: string): Promise<User | null> => {
    const initData = getInitData();

    if (!initData) {
      setState((prev) => ({ ...prev, isLoading: false, isReady: true }));
      return null;
    }

    try {
      const response = await fetch(JWT_CONFIG.endpoints.telegramAuth, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, merchantId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "IDENTITY_SYNC_FAILED");
      }

      const { user, token } = result.data;

      // 🚀 ANCHOR: Sync session token to native Keystore/Keychain
      if (token) await setNativeToken(token);

      setState({
        user,
        isLoading: false,
        isReady: true,
        isAuthenticated: true,
        error: null,
      });

      return user; 
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isReady: true,
        error: error.message,
      }));
      return null;
    }
  }, [setNativeToken]);

  /**
   * 🛰️ SYNC: Fail-Safe Identity Handshake
   * Logic: Cookie-First, Bearer-Second. Hardened for Safari/Cloudflare.
   */
  useEffect(() => {
    if (authAttempted.current) return;
    authAttempted.current = true;

    // Skip sync if currently on the login gate
    if (window.location.pathname === "/dashboard/login") {
      setState(prev => ({ ...prev, isLoading: false, isReady: true }));
      return; 
    }

    const syncIdentity = async () => {
      try {
        // 1. Primary Ingress: Cookie-based profile fetch
        let response = await fetch(JWT_CONFIG.endpoints.profile, { 
          method: "GET",
          credentials: "include" 
        });

        // 2. 🛡️ Recovery Ingress: Manual Bearer injection from Native Storage
        if (response.status === 401) {
          const nativeToken = await getNativeToken();
          if (nativeToken) {
            console.warn("🛰️ [Auth] Session blocked. Recalibrating via SecureStorage...");
            response = await fetch(JWT_CONFIG.endpoints.profile, {
              method: "GET",
              headers: { "Authorization": `Bearer ${nativeToken}` }
            });
          }
        }

        const result = await response.json();

        if (response.ok && result.success) {
          console.log("✅ [Auth_Sync] Cluster Handshake Verified.");
          setState({
            user: result.data.user,
            isLoading: false,
            isReady: true,
            isAuthenticated: true,
            error: null,
          });
        } else {
          // Both identity nodes failed/empty -> Initiate full Telegram Handshake
          authenticate();
        }
      } catch (err) {
        authenticate();
      }
    };

    syncIdentity();
  }, [authenticate, getNativeToken]);

  /**
   * 🧹 LOGOUT
   * Logic: Atomic wipe of all session nodes (Cookie + Native + Local).
   */
  const logout = useCallback(async () => {
    try {
      // 🚀 Clean server-side first
      await fetch(JWT_CONFIG.endpoints.logout, { method: "POST" });
      
      // Wipe native anchors
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.SecureStorage) tg.SecureStorage.removeItem(JWT_CONFIG.storageKey);
      localStorage.removeItem(JWT_CONFIG.storageKey);

      setState({
        user: null,
        isLoading: false,
        isReady: true,
        isAuthenticated: false,
        error: null,
      });
      
      toast.info("Terminal Session Terminated.");
      window.location.href = "/dashboard/login?reason=logged_out";
    } catch (err) {
      window.location.reload();
    }
  }, []);

  const memoizedUser = useMemo(() => state.user, [state.user?.id, state.user?.role]);

  return {
    ...state,
    user: memoizedUser,
    authenticate,
    logout,
  };
}
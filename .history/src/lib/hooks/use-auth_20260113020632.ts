"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getInitData } from "@/lib/telegram/webapp";
import { JWT_CONFIG } from "@/lib/auth/config";
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
 * 🛰️ IDENTITY ARCHITECT (v12.0.0)
 * Architecture: Native Hybrid Persistence (Cookie + SecureStorage)
 * Hardened for Bot API 9.0+ / Safari 2026 Partitioning Logic.
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
   * 🛡️ NATIVE SECURE STORAGE HELPERS (Bot API 9.0+)
   * Anchors the session in the device's encrypted Keychain/Keystore.
   */
  const getNativeToken = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.SecureStorage && tg.isVersionAtLeast("9.0")) {
        tg.SecureStorage.getItem("session_token", (err: any, value: string) => {
          resolve(err ? null : value || null);
        });
      } else {
        // Fallback for standalone browsers/local testing
        resolve(localStorage.getItem("session_token"));
      }
    });
  }, []);

  const setNativeToken = useCallback((token: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.SecureStorage && tg.isVersionAtLeast("9.0")) {
        tg.SecureStorage.setItem("session_token", token, (err: any, success: boolean) => {
          resolve(!!success);
        });
      } else {
        localStorage.setItem("session_token", token);
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
      const response = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, merchantId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "IDENTITY_SYNC_FAILED");
      }

      const { user, token } = result.data;

      // 🚀 ANCHOR: Store token in native device storage to bypass Safari iframe blocks
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
   * 🛰️ SYNC: The "Fail-Safe" Identity Check
   * Uses dual-mode headers to recover sessions even when cookies are ghosted.
   */
  useEffect(() => {
    if (authAttempted.current) return;
    authAttempted.current = true;

    if (window.location.pathname === "/dashboard/login") {
      setState(prev => ({ ...prev, isLoading: false, isReady: true }));
      return; 
    }

    const syncIdentity = async () => {
      try {
        // 1. Attempt Cookie-based fetch (Standard)
        let response = await fetch("/api/user/profile", { 
          method: "GET",
          credentials: "include" 
        });

        // 2. 🛡️ RECOVERY: If Cookie is blocked (401), try Native Bearer Recovery
        if (response.status === 401) {
          const nativeToken = await getNativeToken();
          if (nativeToken) {
            console.warn("🛰️ [Auth] Cookie blocked by browser. Recovering via Native Storage...");
            response = await fetch("/api/user/profile", {
              method: "GET",
              headers: { "Authorization": `Bearer ${nativeToken}` }
            });
          }
        }

        const result = await response.json();

        if (response.ok && result.success) {
          console.log("✅ [Auth_Sync] Session verified.");
          setState({
            user: result.data.user,
            isLoading: false,
            isReady: true,
            isAuthenticated: true,
            error: null,
          });
        } else {
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
   */
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      
      // Clear native anchors
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.SecureStorage) tg.SecureStorage.removeItem("session_token");
      localStorage.removeItem("session_token");

      setState({
        user: null,
        isLoading: false,
        isReady: true,
        isAuthenticated: false,
        error: null,
      });
      
      toast.info("Session Terminated.");
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
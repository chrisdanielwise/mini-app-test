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
 * 🛰️ IDENTITY ARCHITECT (Institutional v12.16.0)
 * Logic: Concurrency-Locked Hybrid Discovery.
 * Protocol: Cookie-First, Bearer-Second, InitData-Third.
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
  const isSyncing = useRef(false); // 🛡️ Concurrency Lock: Prevents 401 spam loops

  /**
   * 🛡️ NATIVE SECURE STORAGE HELPERS
   * Anchors the session in the device's hardware-encrypted storage.
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
   * Logic: Direct Telegram InitData Handshake.
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

      // 🚀 ANCHOR: Sync session token to native hardware-encrypted storage
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
   * Implementation: Hybrid Recovery Protocol for Safari 2026.
   */
  useEffect(() => {
    if (authAttempted.current) return;
    authAttempted.current = true;

    if (window.location.pathname === "/dashboard/login") {
      setState(prev => ({ ...prev, isLoading: false, isReady: true }));
      return; 
    }

    const syncIdentity = async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        // 1. Primary Ingress: Standard Cookie fetch
        let response = await fetch(JWT_CONFIG.endpoints.profile, { 
          method: "GET",
          credentials: "include" 
        });

        // 2. 🛡️ Recovery Ingress: Inject Bearer if Cookie is blocked (401)
        if (response.status === 401) {
          const nativeToken = await getNativeToken();
          if (nativeToken) {
            console.log("🛰️ [Auth] Recovery Mode: Injecting Bearer Node...");
            response = await fetch(JWT_CONFIG.endpoints.profile, {
              method: "GET",
              headers: { 
                "Authorization": `Bearer ${nativeToken}`,
                "Cache-Control": "no-cache"
              }
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
          // Both Cookie & Bearer failed -> Initiate full Telegram Handshake
          await authenticate();
        }
      } catch (err) {
        await authenticate();
      } finally {
        isSyncing.current = false;
      }
    };

    syncIdentity();
  }, [authenticate, getNativeToken]);

  /**
   * 🧹 LOGOUT
   */
  const logout = useCallback(async () => {
    try {
      await fetch(JWT_CONFIG.endpoints.logout, { method: "POST" });
      
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
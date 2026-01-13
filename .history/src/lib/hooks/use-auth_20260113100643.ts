"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getInitData } from "@/lib/telegram/webapp";
import { JWT_CONFIG } from "@/lib/auth/config";
import { toast } from "sonner";

interface User {
  id: string;
  telegramId: string;
  firstName: string | null;
  username: string | null;
  role: string;
  merchant: {
    id: string;
    companyName: string | null;
    planStatus: string;
  } | null;
  isStaff: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isReady: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * 🛰️ IDENTITY ARCHITECT (Institutional v13.9.10)
 * Logic: Concurrency-Locked Hybrid Discovery with 2026 Vault Recovery.
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
  const isSyncing = useRef(false);

  /**
   * 🛰️ MULTI-VAULT RECOVERY PROTOCOL
   * Purpose: Bypasses cookie-blocking in Safari/TMA by pulling from native storage.
   */
  const getNativeToken = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const tg = (window as any).Telegram?.WebApp;

      if (tg?.SecureStorage && tg.isVersionAtLeast("8.0")) {
        tg.SecureStorage.getItem(
          JWT_CONFIG.storageKey,
          (err: any, secureValue: string) => {
            if (!err && secureValue) {
              console.log("🔐 [Auth_Vault] Recovered from SecureStorage.");
              return resolve(secureValue);
            }

            if (tg?.CloudStorage && tg.isVersionAtLeast("6.9")) {
              tg.CloudStorage.getItem(
                JWT_CONFIG.storageKey,
                (cloudErr: any, cloudValue: string) => {
                  if (!cloudErr && cloudValue) {
                    console.log("☁️ [Auth_Vault] Recovered from CloudStorage.");
                    return resolve(cloudValue);
                  }
                  resolve(localStorage.getItem(JWT_CONFIG.storageKey));
                }
              );
            } else {
              resolve(localStorage.getItem(JWT_CONFIG.storageKey));
            }
          }
        );
      } else {
        resolve(localStorage.getItem(JWT_CONFIG.storageKey));
      }
    });
  }, []);

  /**
   * 🛰️ THE INSTITUTIONAL ANCHOR
   */
  const setNativeToken = useCallback((token: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.SecureStorage && tg.isVersionAtLeast("8.0")) {
        tg.SecureStorage.setItem(JWT_CONFIG.storageKey, token);
      }
      if (tg?.CloudStorage && tg.isVersionAtLeast("6.9")) {
        tg.CloudStorage.setItem(JWT_CONFIG.storageKey, token);
      }
      localStorage.setItem(JWT_CONFIG.storageKey, token);
      resolve(true);
    });
  }, []);

  /**
   * 🔐 AUTHENTICATE (Exchange InitData for Session)
   */
  const authenticate = useCallback(
    async (merchantId?: string): Promise<User | null> => {
      const initData = getInitData();

      if (!initData) {
        console.log("🌐 [Auth] No Telegram context found. Aborting handshake.");
        setState((prev) => ({ ...prev, isLoading: false, isReady: true }));
        return null;
      }

      try {
        console.log("🔐 [Auth_Handshake] Exchanging node credentials...");
        const response = await fetch(JWT_CONFIG.endpoints.telegramAuth, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData, merchantId }),
        });

        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "IDENTITY_SYNC_FAILED");

        const { user, token } = result.data;
        if (token) await setNativeToken(token);

        setState({ user, isLoading: false, isReady: true, isAuthenticated: true, error: null });
        return user;
      } catch (error: any) {
        console.error("❌ [Auth_Error]:", error.message);
        setState((prev) => ({ ...prev, isLoading: false, isReady: true, error: error.message }));
        return null;
      }
    },
    [setNativeToken]
  );

  /**
   * 🛰️ SYNC: Fail-Safe Identity Handshake
   */
  useEffect(() => {
    if (authAttempted.current) return;
    authAttempted.current = true;

    const syncIdentity = async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      const isLoginPage = window.location.pathname === "/dashboard/login";

      try {
        console.log("🛰️ [Auth_Sync] Discovering active session nodes...");
        
        // 1. Primary: HttpOnly Cookie
        let response = await fetch(JWT_CONFIG.endpoints.profile, { credentials: "include" });

        // 2. Recovery: Vault Injection
        if (response.status === 401) {
          const nativeToken = await getNativeToken();
          if (nativeToken) {
            response = await fetch(JWT_CONFIG.endpoints.profile, {
              headers: { Authorization: `Bearer ${nativeToken}` },
            });
          }
        }

        const result = await response.json();

        if (response.ok && result.success) {
          console.log("✅ [Auth_Sync] Session verified via Profile node.");
          setState({ user: result.data.user, isLoading: false, isReady: true, isAuthenticated: true, error: null });
        } else {
          // If on login page, we don't force a loop, we just stop loading.
          if (isLoginPage) {
            console.log("🚪 [Auth_Sync] Safe zone: No active session. Awaiting input.");
            setState(prev => ({ ...prev, isLoading: false, isReady: true }));
          } else {
            // On protected pages, try one last Telegram handshake
            await authenticate();
          }
        }
      } catch (err) {
        if (!isLoginPage) await authenticate();
        else setState(prev => ({ ...prev, isLoading: false, isReady: true }));
      } finally {
        isSyncing.current = false;
      }
    };

    syncIdentity();
  }, [authenticate, getNativeToken]);

  /**
   * 🧹 ATOMIC LOGOUT PROTOCOL
   */
  const logout = useCallback(async () => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      const toastId = toast.loading("Terminating session nodes...");

      await fetch(JWT_CONFIG.endpoints.logout, { method: "POST" });
      if (tg?.SecureStorage) tg.SecureStorage.removeItem(JWT_CONFIG.storageKey);
      if (tg?.CloudStorage) tg.CloudStorage.removeItem(JWT_CONFIG.storageKey);
      
      localStorage.removeItem(JWT_CONFIG.storageKey);
      sessionStorage.clear();

      setState({ user: null, isLoading: false, isReady: true, isAuthenticated: false, error: null });
      toast.success("Identity Disconnected.", { id: toastId });

      window.location.href = "/dashboard/login?reason=logged_out";
    } catch (err) {
      window.location.reload();
    }
  }, []);

  const memoizedUser = useMemo(() => state.user, [state.user?.id, state.user?.role]);

  return { ...state, user: memoizedUser, authenticate, logout };
}
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getInitData } from "@/lib/telegram/webapp";
import { JWT_CONFIG } from "@/lib/auth/config";
import { toast } from "sonner";

interface User {
  id: string;
  telegramId: string;
  fullName: string; // 🚀 FIX: Matches the 'fullName' property from our API
  username: string | null;
  role: string;
  merchant: {
    id: string;
    companyName: string | null;
    status: string; // 🚀 FIX: Matches 'provisioningStatus' mapping
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
        if (!response.ok || !result.success) throw new Error(result.error || "IDENTITY_SYNC_FAILED");

        // 🚀 FIX: Correct mapping from result.data
        const userData = result.data.user; 
        const token = result.data.token;
        
        if (token) await setNativeToken(token);

        setState({ user: userData, isLoading: false, isReady: true, isAuthenticated: true, error: null });
        return userData;
      } catch (error: any) {
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

      // 🚀 FIX: Update to global /login path
      const isLoginPage = window.location.pathname === "/login";

      try {
        let response = await fetch(JWT_CONFIG.endpoints.profile, { credentials: "include" });

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
          // 🚀 FIX: API returns user inside 'data.user', not 'data.user.user'
          const resolvedUser = result.data.user; 
          
          setState({ 
            user: resolvedUser, 
            isLoading: false, 
            isReady: true, 
            isAuthenticated: true, 
            error: null 
          });
        } else {
          if (isLoginPage) {
            setState(prev => ({ ...prev, isLoading: false, isReady: true }));
          } else {
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
   * 🧹 ATOMIC LOGOUT
   */
  const logout = useCallback(async () => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      await fetch(JWT_CONFIG.endpoints.logout, { method: "POST" });
      
      localStorage.removeItem(JWT_CONFIG.storageKey);
      if (tg?.SecureStorage) tg.SecureStorage.removeItem(JWT_CONFIG.storageKey);
      
      setState({ user: null, isLoading: false, isReady: true, isAuthenticated: false, error: null });
      
      // 🚀 FIX: Point to global login
      window.location.href = "/login?reason=logged_out";
    } catch (err) {
      window.location.reload();
    }
  }, []);

  const memoizedUser = useMemo(() => state.user, [state.user?.id, state.user?.role]);

  return { ...state, user: memoizedUser, authenticate, logout };
}
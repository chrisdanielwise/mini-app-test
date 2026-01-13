"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getInitData } from "@/lib/telegram/webapp";
import { JWT_CONFIG } from "@/lib/auth/config"; 
import { toast } from "sonner";

interface User {
  id: string;
  telegramId: string;
  firstName: string | null; // Aligned with v13 schema
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
 * 🛰️ IDENTITY ARCHITECT (Institutional v13.6.0)
 * Logic: Concurrency-Locked Hybrid Discovery.
 * Protocol: Cookie (Primary) -> SecureStorage (Recovery) -> InitData (Fallback).
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
   * 🛡️ NATIVE SECURE STORAGE HELPERS
   * Anchors the session in the device's hardware-encrypted storage.
   */
  const getNativeToken = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const tg = (window as any).Telegram?.WebApp;
      // Using '9.0' or '8.0' depending on your specific TMA version requirements
      if (tg?.SecureStorage && tg.isVersionAtLeast("8.0")) {
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
      if (tg?.SecureStorage && tg.isVersionAtLeast("8.0")) {
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
   * 🔐 AUTHENTICATE (Full InitData Exchange)
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

      // 🚀 ANCHOR: Backup token to native storage for Safari 2026 recovery
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
      setState((prev) => ({ ...prev, isLoading: false, isReady: true, error: error.message }));
      return null;
    }
  }, [setNativeToken]);

  /**
   * 🛰️ SYNC: Fail-Safe Identity Handshake
   */
  useEffect(() => {
    if (authAttempted.current) return;
    authAttempted.current = true;

    // Skip auto-sync on explicit login pages
    const publicPaths = ["/login", "/dashboard/login", "/api/auth/magic"];
    if (publicPaths.some(p => window.location.pathname.startsWith(p))) {
      setState(prev => ({ ...prev, isLoading: false, isReady: true }));
      return; 
    }

    const syncIdentity = async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        // 1. Primary Path: HttpOnly Cookie fetch
        let response = await fetch(JWT_CONFIG.endpoints.profile, { 
          method: "GET",
          credentials: "include" 
        });

        // 2. Recovery Path: Bearer Injection (If cookies are blocked)
        if (response.status === 401) {
          const nativeToken = await getNativeToken();
          if (nativeToken) {
            response = await fetch(JWT_CONFIG.endpoints.profile, {
              method: "GET",
              headers: { 
                "Authorization": `Bearer ${nativeToken}`
              }
            });
          }
        }

        const result = await response.json();

        if (response.ok && result.success) {
          setState({
            user: result.data.user,
            isLoading: false,
            isReady: true,
            isAuthenticated: true,
            error: null,
          });
        } else {
          // Both failed -> Handshake with Telegram initData
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
      
      window.location.href = "/login?reason=logged_out";
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
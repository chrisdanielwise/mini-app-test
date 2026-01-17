"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getInitData } from "@/lib/telegram/webapp";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🛰️ MASTER AUTH ENGINE (Institutional v16.16.13)
 * Refactor: Removed useHaptics to prevent circular context dependency.
 * Standard: v9.4.4 Security Guard (Atomic Vault Recovery).
 */
export function useAuth() {
  const [state, setState] = useState({
    user: null as any, // Typed as User in your interface
    isLoading: true,
    isAuthenticated: false,
    error: null as string | null,
  });

  const authLock = useRef(false);

  // 🛡️ VAULT RECOVERY: Safari/TMA Cross-Origin Mitigation
  const getNativeToken = useCallback(async (): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    const tg = (window as any).Telegram?.WebApp;
    
    // Fallback to localStorage if not in Telegram
    if (!tg) return localStorage.getItem(JWT_CONFIG.storageKey);

    return new Promise((resolve) => {
      if (tg.SecureStorage && tg.isVersionAtLeast("8.0")) {
        return tg.SecureStorage.getItem(JWT_CONFIG.storageKey, (_: any, val: string) => resolve(val || null));
      }
      if (tg.CloudStorage && tg.isVersionAtLeast("6.9")) {
        return tg.CloudStorage.getItem(JWT_CONFIG.storageKey, (_: any, val: string) => resolve(val || null));
      }
      resolve(localStorage.getItem(JWT_CONFIG.storageKey));
    });
  }, []);

  // 🔐 ATOMIC AUTHENTICATE
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

  // 🛰️ INSTITUTIONAL SYNC: Pure logic, no context hooks.
  useEffect(() => {
    if (authLock.current) return;
    authLock.current = true;

    const sync = async () => {
      try {
        const res = await fetch(JWT_CONFIG.endpoints.profile);
        const result = await res.json();

        if (res.ok && result.success) {
          setState({ user: result.data.user, isAuthenticated: true, isLoading: false, error: null });
        } else {
          const nativeToken = await getNativeToken();
          await authenticate(nativeToken || undefined);
        }
      } catch {
        await authenticate();
      }
    };

    sync();
  }, [authenticate, getNativeToken]);

  return { ...state, authenticate };
}
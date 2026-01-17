"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getInitData } from "@/lib/telegram/webapp";
import { JWT_CONFIG } from "@/lib/auth/config";
// import { useToast } from "@/use-toast"; // 🚀 Merged
import { useHaptics } from "@/lib/hooks/use-haptics"; // 🚀 Merged

interface User {
  id: string;
  telegramId: string;
  fullName: string;
  username: string | null;
  role: string;
  securityStamp: string; // 🛡️ Institutional v9.4.4 Required
  merchant: {
    id: string;
    companyName: string | null;
    status: string;
  } | null;
}

/**
 * 🛰️ MASTER AUTH ENGINE (Institutional v16.16.12)
 * Logic: Atomic Vault Recovery + Thin-Fetch Identity Anchoring.
 */
export function useAuth() {
  const [state, setState] = useState({
    user: null as User | null,
    isLoading: true,
    isAuthenticated: false,
    error: null as string | null,
  });

  const { toast } = useToast();
  const { notification } = useHaptics();
  const authLock = useRef(false);

  /**
   * 🛡️ VAULT RECOVERY (v16.16.12)
   * Merged logic for Safari/TMA Cross-Origin Cookie Mitigation.
   */
  const getNativeToken = useCallback(async (): Promise<string | null> => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return localStorage.getItem(JWT_CONFIG.storageKey);

    return new Promise((resolve) => {
      // Priority 1: SecureStorage (v8.0+)
      if (tg.SecureStorage && tg.isVersionAtLeast("8.0")) {
        return tg.SecureStorage.getItem(JWT_CONFIG.storageKey, (err: any, val: string) => resolve(val || null));
      }
      // Priority 2: CloudStorage (v6.9+)
      if (tg.CloudStorage && tg.isVersionAtLeast("6.9")) {
        return tg.CloudStorage.getItem(JWT_CONFIG.storageKey, (err: any, val: string) => resolve(val || null));
      }
      resolve(localStorage.getItem(JWT_CONFIG.storageKey));
    });
  }, []);

  /**
   * 🔐 ATOMIC AUTHENTICATE
   * Purpose: Exchanges InitData for a Hardened Session.
   */
  const authenticate = useCallback(async (tokenOverride?: string): Promise<User | null> => {
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
      
      // Anchor to Vaults
      if (token) localStorage.setItem(JWT_CONFIG.storageKey, token);

      setState({ user, isAuthenticated: true, isLoading: false, error: null });
      return user;
    } catch (err: any) {
      notification("error");
      setState(p => ({ ...p, isLoading: false, error: err.message }));
      return null;
    }
  }, [notification]);

  /**
   * 🛰️ INSTITUTIONAL SYNC
   * Logic: Checks existing session before attempting expensive InitData exchange.
   */
  useEffect(() => {
    if (authLock.current) return;
    authLock.current = true;

    const sync = async () => {
      try {
        // 1. Attempt Cookie-based Thin Fetch
        const res = await fetch(JWT_CONFIG.endpoints.profile);
        const result = await res.json();

        if (res.ok && result.success) {
          setState({ user: result.data.user, isAuthenticated: true, isLoading: false, error: null });
        } else {
          // 2. Cookie failed: Check Vaults
          const nativeToken = await getNativeToken();
          await authenticate(nativeToken || undefined);
        }
      } catch {
        await authenticate();
      }
    };

    sync();
  }, [authenticate, getNativeToken]);

  const logout = useCallback(() => {
    localStorage.removeItem(JWT_CONFIG.storageKey);
    window.location.replace("/login?reason=logout");
  }, []);

  return { ...state, authenticate, logout };
}
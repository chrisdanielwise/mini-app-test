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
 * 🛰️ MULTI-VAULT RECOVERY PROTOCOL (v13.9.0)
 * Logic: SecureStorage (Hardware) -> CloudStorage (Global) -> LocalStorage (Legacy)
 */
const getNativeToken = useCallback((): Promise<string | null> => {
  return new Promise((resolve) => {
    const tg = (window as any).Telegram?.WebApp;

    // --- PHASE 1: HARDWARE VAULT (SecureStorage) ---
    if (tg?.SecureStorage && tg.isVersionAtLeast("8.0")) {
      tg.SecureStorage.getItem(JWT_CONFIG.storageKey, (err: any, secureValue: string) => {
        if (!err && secureValue) {
          console.log("🔐 [Auth_Vault] Recovered via SecureStorage.");
          return resolve(secureValue);
        }

        // --- PHASE 2: CLOUD VAULT (CloudStorage Fallback) ---
        // If the hardware vault is empty (new device), check the Telegram Cloud.
        if (tg?.CloudStorage && tg.isVersionAtLeast("6.9")) {
          tg.CloudStorage.getItem(JWT_CONFIG.storageKey, (cloudErr: any, cloudValue: string) => {
            if (!cloudErr && cloudValue) {
              console.log("☁️ [Auth_Vault] Recovered via CloudStorage.");
              return resolve(cloudValue);
            }
            
            // --- PHASE 3: LEGACY FALLBACK ---
            resolve(localStorage.getItem(JWT_CONFIG.storageKey));
          });
        } else {
          resolve(localStorage.getItem(JWT_CONFIG.storageKey));
        }
      });
    } else {
      // Direct fallback if Telegram SDK version is too low
      resolve(localStorage.getItem(JWT_CONFIG.storageKey));
    }
  });
}, []);

  /**
   * 🛰️ THE INSTITUTIONAL ANCHOR
   * Saves the token to both Hardware (Secure) and Cloud (Account) vaults.
   */
  const setNativeToken = useCallback((token: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const tg = (window as any).Telegram?.WebApp;

      // 1. Hardware-Encrypted Storage (Device Level)
      if (tg?.SecureStorage && tg.isVersionAtLeast("8.0")) {
        tg.SecureStorage.setItem(JWT_CONFIG.storageKey, token);
      }

      // 2. Account-Sync Storage (Cloud Level)
      // This allows the session to persist across Desktop and Mobile apps
      if (tg?.CloudStorage && tg.isVersionAtLeast("6.9")) {
        tg.CloudStorage.setItem(JWT_CONFIG.storageKey, token, (err, success) => {
          if (success) console.log("☁️ [Auth] Identity anchored to Telegram Cloud.");
        });
      }

      // 3. Browser Fallback
      localStorage.setItem(JWT_CONFIG.storageKey, token);
      resolve(true);
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
   * 🧹 ATOMIC LOGOUT PROTOCOL (Institutional v13.9.5)
   * Purpose: Total identity purge across all 2026 storage vectors.
   */
  const logout = useCallback(async () => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      const toastId = toast.loading("Terminating session nodes...");

      // 1. 🛡️ SERVER-SIDE PURGE
      // Instructs the server to expire the HttpOnly Cookie immediately.
      await fetch(JWT_CONFIG.endpoints.logout, { method: "POST" });

      // 2. 🔐 HARDWARE VAULT PURGE
      if (tg?.SecureStorage) {
        tg.SecureStorage.removeItem(JWT_CONFIG.storageKey);
      }

      // 3. ☁️ CLOUD VAULT PURGE
      // Critical: Prevents "Self-Healing" from resurrecting a logged-out session.
      if (tg?.CloudStorage) {
        tg.CloudStorage.removeItem(JWT_CONFIG.storageKey);
      }

      // 4. 🌐 BROWSER PURGE
      localStorage.removeItem(JWT_CONFIG.storageKey);
      sessionStorage.clear();

      // 5. 🏁 STATE RESET
      setState({
        user: null,
        isLoading: false,
        isReady: true,
        isAuthenticated: false,
        error: null,
      });
      
      toast.success("Identity Disconnected.", { id: toastId });

      // Force a hard redirect to the login gate to clear any cached memory
      // Find this line in your logout or error handler:
window.location.href = "/dashboard/login?reason=logged_out"; // 🚀 Update from "/login"
    } catch (err) {
      console.error("🔥 [Logout_Failure]:", err);
      // Fallback: Force reload if the network is down
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
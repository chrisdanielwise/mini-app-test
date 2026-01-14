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


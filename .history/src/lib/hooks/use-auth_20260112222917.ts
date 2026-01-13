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
  isReady: boolean; // 🛡️ Hydration Shield
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * 🛰️ IDENTITY ARCHITECT (v10.2.1)
 * Architecture: Zero-Flicker Cookie Persistence
 * Hardened: Multi-stage identity resolution for Telegram Mini Apps.
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
   * 🔐 AUTHENTICATE
   * Standard: Exchange Telegram initData for an HttpOnly Session.
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

      const user = result.data.user;

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
  }, []);

  useEffect(() => {
    if (authAttempted.current) return;
    authAttempted.current = true;

    const isLoginPage = window.location.pathname === "/dashboard/login";
    if (isLoginPage) {
      setState(prev => ({ ...prev, isLoading: false, isReady: true }));
      return; 
    }

    // 📡 Step 1: Check existing cookie session via Profile API
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setState({
            user: result.data,
            isLoading: false,
            isReady: true,
            isAuthenticated: true,
            error: null,
          });
        } else {
          // 📡 Step 2: Fallback to Telegram Auth if cookie is missing
          authenticate();
        }
      })
      .catch(() => authenticate());
  }, [authenticate]);

  /**
   * 🧹 LOGOUT
   * Standard: Calls server to wipe HttpOnly cookie and resets local state.
   */
  const logout = useCallback(async () => {
    try {
      // 🚀 Best Practice: Always clear on server first
      await fetch("/api/auth/logout", { method: "POST" });
      
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
      // Emergency client-side cookie wipe
      document.cookie = `${JWT_CONFIG.cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
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
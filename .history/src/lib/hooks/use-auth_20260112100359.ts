"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getInitData } from "@/lib/telegram/webapp";

interface User {
  id: string; // UUID
  telegramId: string; // BigInt as String
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
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * 🛰️ IDENTITY ARCHITECT (Apex Tier)
 * Hardened: Implements the Passive Gate Protocol to terminate redirect storms.
 * Optimized: Cookies + LocalStorage dual-sync for Middleware/HMR parity.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const authAttempted = useRef(false);

  /**
   * 🔐 AUTHENTICATE
   * Core logic to exchange Telegram initData for an Institutional JWT.
   */
  const authenticate = useCallback(async (): Promise<User | null> => {
    const initData = getInitData();

    if (!initData) {
      console.warn("🛰️ [Auth] Standing down: No Telegram initData found.");
      setState((prev) => ({ ...prev, isLoading: false }));
      return null;
    }

    try {
      console.log("🔐 [Auth] Initializing Telegram Identity Handshake...");
      const response = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Authentication failed");
      }

      // 🛡️ PERSISTENCE: JWT is saved for Middleware (Cookies) and Client (LS)
      const token = data.data.token;
      localStorage.setItem("auth_token", token);
      
      const user = data.data.user;

      setState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      console.log("✅ [Auth] Identity Synchronized.");
      return user; 
    } catch (error: any) {
      console.error("❌ [Auth] Handshake Failure:", error.message);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      return null;
    }
  }, []);

  useEffect(() => {
    /**
     * 🛡️ THE PASSIVE GATE (Next.js 15 Optimization)
     * If we are at the login gate or have a redirect reason, we MUST NOT 
     * trigger another auto-auth cycle. This terminates the "Redirect Storm".
     */
    const params = new URLSearchParams(window.location.search);
    const hasReason = params.has('reason');
    const isLoginPage = window.location.pathname === "/dashboard/login";

    if (hasReason || isLoginPage) {
      console.log("🛡️ [Auth] Passive Gate Engaged: Yielding to Gatekeeper.");
      setState(prev => ({ ...prev, isLoading: false }));
      return; 
    }

    if (authAttempted.current) return;
    authAttempted.current = true;

    const existingToken = localStorage.getItem("auth_token");

    if (existingToken) {
      console.log("📡 [Auth] Resuming previous session...");
      fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${existingToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setState({
              user: data.data,
              token: existingToken,
              isLoading: false,
              isAuthenticated: true,
              error: null,
            });
          } else {
            console.warn("⚠️ [Auth] Session invalid. Clearing state.");
            localStorage.removeItem("auth_token");
            authenticate();
          }
        })
        .catch(() => {
          localStorage.removeItem("auth_token");
          authenticate();
        });
    } else {
      authenticate();
    }
  }, [authenticate]);

  /**
   * 🧹 LOGOUT
   * Ensures absolute purge of both LocalStorage and Session Cookies.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    // Explicitly expire the cookie for the Middleware proxy
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure";
    
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
    
    window.location.href = "/dashboard/login?reason=logged_out";
  }, []);

  // 🚀 PERFORMANCE: Prevent re-renders on dashboard HUDs
  const memoizedUser = useMemo(() => state.user, [
    state.user?.id, 
    state.user?.role
  ]);

  return {
    ...state,
    user: memoizedUser,
    authenticate,
    logout,
  };
}
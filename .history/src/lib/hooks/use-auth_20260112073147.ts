"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getInitData } from "@/lib/telegram/webapp";

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
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * 🛰️ IDENTITY ARCHITECT (Apex Tier)
 * Hardened: Implements the Passive Gate Protocol to terminate redirect storms.
 * Optimized: Memoized user nodes to prevent downstream HUD flickering.
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

  const authenticate = useCallback(async (): Promise<User | null> => {
    const initData = getInitData();

    if (!initData) {
      console.warn("🛰️ [Auth] Passive Mode: No Telegram initData found.");

      if (process.env.NODE_ENV === "development") {
        console.info("💡 [Auth] Development: Waiting for manual login or Telegram handshake.");
        setState((prev) => ({ ...prev, isLoading: false }));
        return null;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Please open this app from Telegram",
      }));
      return null;
    }

    try {
      console.log("🔐 [Auth] Initializing Cryptographic Handshake...");
      const response = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Authentication failed");
      }

      // 🛡️ SYNC STORAGE: Store JWT for middleware & persistence
      localStorage.setItem("auth_token", data.data.token);
      
      const user = data.data.user;

      setState({
        user,
        token: data.data.token,
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
    // 🛡️ THE PASSIVE GATE
    // If the server redirected us to login with a 'reason', we MUST stand down.
    // Continuing to auto-authenticate here causes the Next.js 15 Hydration Storm.
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const hasReason = params.has('reason');
      const isAtGate = window.location.pathname === "/dashboard/login";

      if (hasReason || isAtGate) {
        setState(prev => ({ ...prev, isLoading: false }));
        return; 
      }
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
            console.warn("⚠️ [Auth] Session expired or invalid.");
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

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    // 🧹 Hard-purge the cookie to ensure Middleware reacts on the next hop
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure";
    
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
  }, []);

  // 🚀 Performance: Memoize the user object to prevent 1M user dashboard lag
  const memoizedUser = useMemo(() => state.user, [
    state.user?.id, 
    state.user?.role, 
    state.user?.merchant?.id
  ]);

  return {
    ...state,
    user: memoizedUser,
    authenticate,
    logout,
  };
}
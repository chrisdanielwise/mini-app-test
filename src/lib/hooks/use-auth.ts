"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getInitData } from "@/lib/telegram/webapp";
import { JWT_CONFIG } from "@/lib/auth/config";

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
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * 🛰️ IDENTITY ARCHITECT (v9.2.8)
 * Hardened: Cookie-First Protocol for Turbopack/Next.js 16 parity.
 * Optimized: Removes LocalStorage to prevent Hydration Mismatches.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const authAttempted = useRef(false);

  /**
   * 🔐 AUTHENTICATE
   * Core logic: Exchanges Telegram initData for a Server-Side Session (Cookie).
   */
  const authenticate = useCallback(async (): Promise<User | null> => {
    const initData = getInitData();

    if (!initData) {
      console.warn("🛰️ [Auth] Standing down: No Telegram context found.");
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
        throw new Error(data.error || "Authentication failed");
      }

      // 🛡️ PERSISTENCE: JWT is handled by the server via Set-Cookie headers.
      // We no longer manually save to LocalStorage.
      const user = data.data.user;

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      console.log("✅ [Auth] Identity Synchronized via Cookies.");
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
     * 🛡️ THE PASSIVE GATE
     * Prevents auto-auth cycles on the login page to stop the 307 Redirect Storm.
     */
    const params = new URLSearchParams(window.location.search);
    const isLoginPage = window.location.pathname === "/dashboard/login";

    if (params.has('reason') || isLoginPage) {
      console.log("🛡️ [Auth] Passive Gate: Yielding to Gatekeeper.");
      setState(prev => ({ ...prev, isLoading: false }));
      return; 
    }

    if (authAttempted.current) return;
    authAttempted.current = true;

    // Check existing session via the profile API (which reads the cookie)
    console.log("📡 [Auth] Verifying existing session context...");
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setState({
            user: data.data,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          // If profile fails, attempt fresh Telegram authentication
          authenticate();
        }
      })
      .catch(() => authenticate());
  }, [authenticate]);

  /**
   * 🧹 LOGOUT
   * Purges the Session Cookie via the server-side logout route.
   */
  const logout = useCallback(async () => {
    // 🚀 We call a server route to clear the HttpOnly cookie safely
    await fetch("/api/auth/logout", { method: "POST" });
    
    // Fallback: Client-side cookie expiration
    document.cookie = `${JWT_CONFIG.cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure`;
    
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
    
    window.location.href = "/dashboard/login?reason=logged_out";
  }, []);

  const memoizedUser = useMemo(() => state.user, [state.user?.id, state.user?.role]);

  return {
    ...state,
    user: memoizedUser,
    authenticate,
    logout,
  };
}
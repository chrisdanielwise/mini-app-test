"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Ref to prevent multiple simultaneous authentication attempts
  const authAttempted = useRef(false);

  const authenticate = useCallback(async () => {
    const initData = getInitData();

    if (!initData) {
      console.warn("[Auth] No Telegram initData found.");

      if (process.env.NODE_ENV === "development") {
        console.info("[Auth] Development mode: Applying mock user.");
        setState({
          user: {
            id: "00000000-0000-0000-0000-000000000000",
            telegramId: "123456789",
            fullName: "Dev User",
            username: "devuser",
            role: "USER",
            merchant: null,
          },
          token: "dev-token",
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        return;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Please open this app from Telegram",
      }));
      return;
    }

    try {
      console.log("[Auth] Attempting Telegram verification...");
      const response = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Authentication failed");
      }

      localStorage.setItem("auth_token", data.data.token);
      console.log("[Auth] Successfully authenticated with JWT");

      setState({
        user: data.data.user,
        token: data.data.token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      console.error("[Auth] Telegram authentication error:", error.message);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, []);

  useEffect(() => {
    if (authAttempted.current) return;
    authAttempted.current = true;

    const existingToken = localStorage.getItem("auth_token");

    if (existingToken) {
      console.log("[Auth] Validating existing session token...");
      fetch("/api/user/profile", {
        // Note: using /profile to match the route we updated earlier
        headers: {
          Authorization: `Bearer ${existingToken}`,
        },
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
            console.warn("[Auth] Session invalid, clearing token.");
            localStorage.removeItem("auth_token");
            authenticate();
          }
        })
        .catch((err) => {
          console.error("[Auth] Token validation fetch failed:", err);
          localStorage.removeItem("auth_token");
          authenticate();
        });
    } else {
      authenticate();
    }
  }, [authenticate]);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    authenticate,
    logout,
  };
}

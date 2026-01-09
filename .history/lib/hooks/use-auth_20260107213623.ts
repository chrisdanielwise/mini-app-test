"use client"

import { useState, useEffect, useCallback } from "react"
import { getInitData } from "@/lib/telegram/webapp"

interface User {
  id: string
  telegramId: string
  fullName: string | null
  username: string | null
  role: string
  merchant: {
    id: string
    companyName: string | null
    planStatus: string
  } | null
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  const authenticate = useCallback(async () => {
    const initData = getInitData()

    if (!initData) {
      // Not in Telegram - use mock auth for development
      if (process.env.NODE_ENV === "development") {
        setState({
          user: {
            id: "dev-user",
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
        })
        return
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Not running in Telegram",
      }))
      return
    }

    try {
      const response = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Authentication failed")
      }

      // Store token in localStorage
      localStorage.setItem("auth_token", data.data.token)

      setState({
        user: data.data.user,
        token: data.data.token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      })
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }))
    }
  }, [])

  useEffect(() => {
    // Check for existing token
    const existingToken = localStorage.getItem("auth_token")
    if (existingToken) {
      // Validate token by fetching user
      fetch("/api/user/me", {
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
            })
          } else {
            // Token invalid, re-authenticate
            localStorage.removeItem("auth_token")
            authenticate()
          }
        })
        .catch(() => {
          localStorage.removeItem("auth_token")
          authenticate()
        })
    } else {
      authenticate()
    }
  }, [authenticate])

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    authenticate,
    logout,
  }
}

"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useTelegram } from "@/lib/hooks/use-telegram"
import { useAuth } from "@/lib/hooks/use-auth"
import { LoadingScreen } from "@/components/ui/loading-spinner"

interface TelegramContextValue {
  auth: ReturnType<typeof useAuth>
  isReady: boolean
  isTelegram: boolean
  user: any 
  getInitData: () => string | null
  setBackButton: (visible: boolean, onClick?: () => void) => void
  setMainButton: (params: any) => void
  hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "warning" | "error") => void
}

const TelegramContext = createContext<TelegramContextValue | null>(null)

/**
 * Enhanced TelegramProvider
 * Automatically handles re-authentication if the API layer clears the session token.
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram()
  const auth = useAuth()

  useEffect(() => {
    const handleAuth = async () => {
      // If the SDK is ready but the app isn't authenticated, trigger login
      if (telegram.isReady && !auth.isAuthenticated && !auth.isLoading) {
        const initData = telegram.getInitData()
        if (initData) {
          try {
            await auth.login(initData)
          } catch (err) {
            console.error("[Auth] Automatic re-login failed", err)
          }
        }
      }
    }

    handleAuth()
  }, [telegram.isReady, auth.isAuthenticated, auth.isLoading])

  const value: TelegramContextValue = {
    ...telegram,
    auth,
  }

  // Prevents the app from rendering until the Telegram SDK is fully initialized
  if (!telegram.isReady && telegram.isTelegram) {
    return <LoadingScreen message="Initializing Secure Session..." />
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}

/**
 * Hook to access Telegram context across the Mini App
 */
export function useTelegramContext() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error("useTelegramContext must be used within a TelegramProvider")
  }
  return context
}
"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useTelegram } from "@/lib/hooks/use-telegram"
import { useAuth } from "@/lib/hooks/use-auth"
import { LoadingScreen } from "@/components/ui/loading-spinner"

/**
 * Context type definition
 */
interface TelegramContextValue {
  auth: ReturnType<typeof useAuth>
  // Pulling all return values from useTelegram hook
  isReady: boolean
  isTelegram: boolean
  user: any 
  getInitData: () => string | null
  setBackButton: (visible: boolean, onClick?: () => void) => void
  setMainButton: (params: any) => void
  hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "warning" | "error") => void
}

// 1. Create the context with a null default
const TelegramContext = createContext<TelegramContextValue | null>(null)

/**
 * 2. Export the Provider Component
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram()
  const auth = useAuth()

  // Sync Telegram InitData with our custom Auth system
  useEffect(() => {
    if (telegram.isReady && !auth.isAuthenticated && !auth.isLoading) {
      const initData = telegram.getInitData()
      if (initData) {
        auth.login(initData)
      }
    }
  }, [telegram.isReady, telegram.getInitData, auth])

  // Combine Telegram SDK and Auth logic
  const value: TelegramContextValue = {
    ...telegram,
    auth,
  }

  // Handle Loading States for the Mini App
  if (!telegram.isReady && telegram.isTelegram) {
    return <LoadingScreen message="Initializing Telegram SDK..." />
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}

/**
 * 3. Export the Hook
 * This is what your Profile page is looking for.
 */
export function useTelegramContext() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error("useTelegramContext must be used within a TelegramProvider")
  }
  return context
}
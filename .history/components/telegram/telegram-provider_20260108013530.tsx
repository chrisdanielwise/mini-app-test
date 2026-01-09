"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useTelegram, type UseTelegramReturn } from "@/lib/hooks/use-telegram"
import { useAuth } from "@/lib/hooks/use-auth"
import { LoadingScreen } from "@/components/ui/loading-spinner"

/**
 * Enhanced Telegram Context Value
 * Combines native WebApp features with our custom JWT Auth state
 */
interface TelegramContextValue extends UseTelegramReturn {
  auth: ReturnType<typeof useAuth>
}

const TelegramContext = createContext<TelegramContextValue | null>(null)

/**
 * Image of the Telegram Mini App Architecture showing the bridge between 
 * the Telegram Client, the WebApp SDK, and the Next.js Backend.
 */


export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram()
  const auth = useAuth()

  /**
   * Effect: Synchronization
   * Automatically triggers authentication once the Telegram WebApp is ready
   */
  useEffect(() => {
    if (telegram.isReady && !auth.isAuthenticated && !auth.isLoading) {
      const initData = telegram.getInitData()
      if (initData) {
        auth.login(initData)
      }
    }
  }, [telegram.isReady, telegram.getInitData, auth])

  // Context value object
  const value: TelegramContextValue = {
    ...telegram,
    auth,
  }

  /**
   * PRISMA 7 & NEXT.JS 15 SAFETY:
   * We delay the rendering of children until we know if we are in a 
   * Telegram environment and if the user session is being processed.
   */
  if (!telegram.isReady && !telegram.isTelegram) {
     // Optional: Fallback for browser testing
     return <div className="min-h-screen bg-background">{children}</div>
  }

  if (!telegram.isReady) {
    return <LoadingScreen message="Initializing Telegram SDK..." />
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}

/**
 * Hook: useTelegramContext
 * The primary way to access user data, haptics, and auth within the app
 */
export function useTelegramContext() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error("useTelegramContext must be used within a TelegramProvider")
  }
  return context
}
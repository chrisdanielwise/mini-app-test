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
  isReady: boolean
  isTelegram: boolean
  user: any 
  getInitData: () => string | null
  setBackButton: (visible: boolean, onClick?: () => void) => void
  setMainButton: (params: any) => void
  hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "warning" | "error") => void
}

const TelegramContext = createContext<TelegramContextValue | null>(null)



export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram()
  const auth = useAuth()

  // Automated Re-authentication Logic
  useEffect(() => {
    const handleAuth = async () => {
      // If we aren't authenticated (either first load or 401 just cleared the token)
      if (telegram.isReady && !auth.isAuthenticated && !auth.isLoading) {
        const initData = telegram.getInitData()
        if (initData) {
          try {
            await auth.login(initData)
          } catch (err) {
            console.error("[Auth] Telegram login failed", err)
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

  if (!telegram.isReady && telegram.isTelegram) {
    return <LoadingScreen message="Initializing Zipha Secure Session..." />
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegramContext() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error("useTelegramContext must be used within a TelegramProvider")
  }
  return context
}
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

export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram()
  const auth = useAuth()

  // Detect session loss and trigger silent re-authentication
  useEffect(() => {
    const performHandshake = async () => {
      if (telegram.isReady && !auth.isAuthenticated && !auth.isLoading) {
        const initData = telegram.getInitData()
        if (initData) {
          try {
            await auth.login(initData)
          } catch (err) {
            console.error("[Telegram] Re-authentication handshake failed.");
          }
        }
      }
    }
    performHandshake()
  }, [telegram.isReady, auth.isAuthenticated, auth.isLoading])

  const value: TelegramContextValue = {
    ...telegram,
    auth,
  }

  // Prevent UI flicker before Telegram SDK is ready
  if (!telegram.isReady && telegram.isTelegram) {
    return <LoadingScreen message="Securing Telegram Session..." />
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
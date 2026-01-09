"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useTelegram, type UseTelegramReturn } from "@/lib/hooks/use-telegram"
import { useAuth } from "@/lib/hooks/use-auth"

interface TelegramContextValue extends UseTelegramReturn {
  auth: ReturnType<typeof useAuth>
}

const TelegramContext = createContext<TelegramContextValue | null>(null)

export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram()
  const auth = useAuth()

  return <TelegramContext.Provider value={{ ...telegram, auth }}>{children}</TelegramContext.Provider>
}

export function useTelegramContext() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error("useTelegramContext must be used within TelegramProvider")
  }
  return context
}

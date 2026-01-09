"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import {
  getTelegramWebApp,
  isTelegramWebApp,
  getTelegramUser,
  getStartParam,
  setBackButton,
  setMainButton,
  hapticFeedback,
  type TelegramWebApp,
} from "@/lib/telegram/webapp"

export interface UseTelegramReturn {
  webapp: TelegramWebApp | null
  user: ReturnType<typeof getTelegramUser>
  startParam: string | null
  isReady: boolean
  isTelegram: boolean
  platform: string
  colorScheme: "light" | "dark"
  setBackButton: typeof setBackButton
  setMainButton: typeof setMainButton
  hapticFeedback: typeof hapticFeedback
  expand: () => void
  close: () => void
}

export function useTelegram(): UseTelegramReturn {
  const [isReady, setIsReady] = useState(false)
  const [webapp, setWebapp] = useState<TelegramWebApp | null>(null)

  useEffect(() => {
    // 1. Get the global Telegram object
    const tgWebapp = getTelegramWebApp()

    if (tgWebapp) {
      // 2. Initialize and expand UI immediately to avoid empty space
      tgWebapp.ready()
      tgWebapp.expand()

      // 3. Set branding colors (Match your global CSS/Theme)
      // Note: Use hex values that match your Tailwind config
      tgWebapp.setHeaderColor("#121212")
      tgWebapp.setBackgroundColor("#121212")

      setWebapp(tgWebapp)
    }

    // 4. Mark the hook as ready so components know they can use 'webapp'
    setIsReady(true)
  }, [])

  const expand = useCallback(() => {
    if (webapp) webapp.expand()
  }, [webapp])

  const close = useCallback(() => {
    if (webapp) webapp.close()
  }, [webapp])

  // Use useMemo to prevent unnecessary re-renders of components consuming this hook
  return useMemo(() => ({
    webapp,
    user: getTelegramUser(),
    startParam: getStartParam(),
    isReady,
    isTelegram: isTelegramWebApp(),
    platform: webapp?.platform || "unknown",
    colorScheme: webapp?.colorScheme || "dark",
    setBackButton,
    setMainButton,
    hapticFeedback,
    expand,
    close,
  }), [webapp, isReady, expand, close])
}
"use client"

import { useEffect, useState, useCallback } from "react"
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
    const tgWebapp = getTelegramWebApp()

    if (tgWebapp) {
      // Mark webapp as ready
      tgWebapp.ready()

      // Expand to full height
      tgWebapp.expand()

      // Set header color to match theme
      tgWebapp.setHeaderColor("#121212")
      tgWebapp.setBackgroundColor("#121212")

      setWebapp(tgWebapp)
    }

    setIsReady(true)
  }, [])

  const expand = useCallback(() => {
    webapp?.expand()
  }, [webapp])

  const close = useCallback(() => {
    webapp?.close()
  }, [webapp])

  return {
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
  }
}

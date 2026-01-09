"use client"

// =================================================================
// TELEGRAM WEBAPP SDK v7.10+ WRAPPER
// Provides type-safe access and lifecycle management
// =================================================================

export interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    query_id?: string
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
      is_premium?: boolean
      photo_url?: string
    }
    receiver?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
    }
    chat?: {
      id: number
      type: "group" | "supergroup" | "channel"
      title: string
      username?: string
      photo_url?: string
    }
    auth_date: number
    hash: string
    start_param?: string
    can_send_after?: number
  }
  version: string
  platform: string
  colorScheme: "light" | "dark"
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
    header_bg_color?: string
    accent_text_color?: string
    section_bg_color?: string
    section_header_text_color?: string
    subtitle_text_color?: string
    destructive_text_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
    setParams: (params: {
      text?: string
      color?: string
      text_color?: string
      is_active?: boolean
      is_visible?: boolean
    }) => void
  }
  SettingsButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void
    notificationOccurred: (type: "error" | "success" | "warning") => void
    selectionChanged: () => void
  }
  CloudStorage: {
    setItem: (key: string, value: string, callback?: (err: Error | null, success: boolean) => void) => void
    getItem: (key: string, callback: (err: Error | null, value: string) => void) => void
    getItems: (keys: string[], callback: (err: Error | null, values: Record<string, string>) => void) => void
    removeItem: (key: string, callback?: (err: Error | null, success: boolean) => void) => void
    removeItems: (keys: string[], callback?: (err: Error | null, success: boolean) => void) => void
    getKeys: (callback: (err: Error | null, keys: string[]) => void) => void
  }
  ready: () => void
  expand: () => void
  close: () => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void
  openTelegramLink: (url: string) => void
  openInvoice: (url: string, callback?: (status: "paid" | "cancelled" | "failed" | "pending") => void) => void
  showPopup: (params: any, callback?: (buttonId: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showScanQrPopup: (params: { text?: string }, callback?: (text: string) => boolean | void) => void
  closeScanQrPopup: () => void
  readTextFromClipboard: (callback?: (text: string) => void) => void
  requestWriteAccess: (callback?: (granted: boolean) => void) => void
  requestContact: (callback?: (shared: boolean) => void) => void
  sendData: (data: string) => void
  switchInlineQuery: (query: string, choose_chat_types?: Array<"users" | "groups" | "bots" | "channels">) => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

/**
 * Check if running inside Telegram WebApp with SSR safety
 */
export function isTelegramWebApp(): boolean {
  if (typeof window === "undefined") return false
  return !!window.Telegram?.WebApp?.initData
}

/**
 * Get Telegram WebApp instance
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined" || !window.Telegram?.WebApp) return null
  return window.Telegram.WebApp
}

/**
 * Get init data for authentication
 */
export function getInitData(): string | null {
  return getTelegramWebApp()?.initData || null
}

/**
 * Get current user from init data (Telegram IDs are numbers in SDK)
 */
export function getTelegramUser() {
  return getTelegramWebApp()?.initDataUnsafe?.user || null
}

/**
 * Get start parameter (Deep linking)
 */
export function getStartParam(): string | null {
  return getTelegramWebApp()?.initDataUnsafe?.start_param || null
}

/**
 * Trigger haptic feedback with type mapping
 */
export function hapticFeedback(type: "success" | "error" | "warning" | "light" | "medium" | "heavy") {
  const webapp = getTelegramWebApp()
  if (!webapp) return

  const notifications = ["success", "error", "warning"]
  if (notifications.includes(type)) {
    webapp.HapticFeedback.notificationOccurred(type as any)
  } else {
    webapp.HapticFeedback.impactOccurred(type as any)
  }
}

/**
 * Configure Back Button with automatic cleanup capability
 * Returns a cleanup function for React useEffect
 */
export function setBackButton(visible: boolean, onClick?: () => void): () => void {
  const webapp = getTelegramWebApp()
  if (!webapp) return () => {}

  if (visible) {
    webapp.BackButton.show()
    if (onClick) webapp.BackButton.onClick(onClick)
  } else {
    webapp.BackButton.hide()
  }

  return () => {
    if (onClick) webapp.BackButton.offClick(onClick)
  }
}

/**
 * Configure Main Button with safety checks
 */
export function setMainButton(params: {
  text: string
  visible?: boolean
  active?: boolean
  progress?: boolean
  onClick?: () => void
}) {
  const webapp = getTelegramWebApp()
  if (!webapp) return

  const { MainButton } = webapp
  MainButton.setText(params.text)

  if (params.visible !== undefined) params.visible ? MainButton.show() : MainButton.hide()
  if (params.active !== undefined) params.active ? MainButton.enable() : MainButton.disable()
  if (params.progress !== undefined) params.progress ? MainButton.showProgress() : MainButton.hideProgress()

  if (params.onClick) {
    // Ensure we don't stack listeners
    MainButton.offClick(params.onClick)
    MainButton.onClick(params.onClick)
  }
}

/**
 * Open a Telegram link with fallback
 */
export function openTelegramLink(url: string) {
  const webapp = getTelegramWebApp()
  if (webapp && webapp.version >= "6.1") {
    webapp.openTelegramLink(url)
  } else {
    window.open(url, "_blank")
  }
}

/**
 * Promise-based Confirm Popup
 */
export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const webapp = getTelegramWebApp()
    if (webapp) {
      webapp.showConfirm(message, (confirmed: boolean) => resolve(confirmed))
    } else {
      resolve(window.confirm(message))
    }
  })
}

/**
 * Promise-based Alert Popup
 */
export function showAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    const webapp = getTelegramWebApp()
    if (webapp) {
      webapp.showAlert(message, () => resolve())
    } else {
      window.alert(message)
      resolve()
    }
  })
}
"use client"

// =================================================================
// TELEGRAM WEBAPP SDK WRAPPER
// Provides type-safe access to Telegram Mini App features
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
    }
    auth_date: number
    hash: string
    start_param?: string
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
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void
    notificationOccurred: (type: "error" | "success" | "warning") => void
    selectionChanged: () => void
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
  openInvoice: (url: string, callback?: (status: string) => void) => void
  showPopup: (
    params: {
      title?: string
      message: string
      buttons?: Array<{
        id?: string
        type?: "default" | "ok" | "close" | "cancel" | "destructive"
        text?: string
      }>
    },
    callback?: (buttonId: string) => void,
  ) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showScanQrPopup: (params: { text?: string }, callback?: (text: string) => boolean | void) => void
  closeScanQrPopup: () => void
  readTextFromClipboard: (callback?: (text: string) => void) => void
  requestWriteAccess: (callback?: (granted: boolean) => void) => void
  requestContact: (callback?: (shared: boolean) => void) => void
  sendData: (data: string) => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

/**
 * Check if running inside Telegram WebApp
 */
export function isTelegramWebApp(): boolean {
  return typeof window !== "undefined" && !!window.Telegram?.WebApp?.initData
}

/**
 * Get Telegram WebApp instance
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null
  return window.Telegram?.WebApp || null
}

/**
 * Get init data for authentication
 */
export function getInitData(): string | null {
  const webapp = getTelegramWebApp()
  return webapp?.initData || null
}

/**
 * Get current user from init data
 */
export function getTelegramUser() {
  const webapp = getTelegramWebApp()
  return webapp?.initDataUnsafe?.user || null
}

/**
 * Get start parameter (deep link param)
 */
export function getStartParam(): string | null {
  const webapp = getTelegramWebApp()
  return webapp?.initDataUnsafe?.start_param || null
}

/**
 * Trigger haptic feedback
 */
export function hapticFeedback(type: "success" | "error" | "warning" | "light" | "medium" | "heavy") {
  const webapp = getTelegramWebApp()
  if (!webapp) return

  if (type === "success" || type === "error" || type === "warning") {
    webapp.HapticFeedback.notificationOccurred(type)
  } else {
    webapp.HapticFeedback.impactOccurred(type)
  }
}

/**
 * Show/hide back button
 */
export function setBackButton(visible: boolean, onClick?: () => void) {
  const webapp = getTelegramWebApp()
  if (!webapp) return

  if (visible) {
    webapp.BackButton.show()
    if (onClick) {
      webapp.BackButton.onClick(onClick)
    }
  } else {
    webapp.BackButton.hide()
  }
}

/**
 * Configure main button
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

  webapp.MainButton.setText(params.text)

  if (params.visible !== undefined) {
    params.visible ? webapp.MainButton.show() : webapp.MainButton.hide()
  }

  if (params.active !== undefined) {
    params.active ? webapp.MainButton.enable() : webapp.MainButton.disable()
  }

  if (params.progress !== undefined) {
    params.progress ? webapp.MainButton.showProgress() : webapp.MainButton.hideProgress()
  }

  if (params.onClick) {
    webapp.MainButton.onClick(params.onClick)
  }
}

/**
 * Open a Telegram link
 */
export function openTelegramLink(url: string) {
  const webapp = getTelegramWebApp()
  if (webapp) {
    webapp.openTelegramLink(url)
  } else {
    window.open(url, "_blank")
  }
}

/**
 * Show confirmation popup
 */
export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const webapp = getTelegramWebApp()
    if (webapp) {
      webapp.showConfirm(message, resolve)
    } else {
      resolve(window.confirm(message))
    }
  })
}

/**
 * Show alert popup
 */
export function showAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    const webapp = getTelegramWebApp()
    if (webapp) {
      webapp.showAlert(message, resolve)
    } else {
      window.alert(message)
      resolve()
    }
  })
}

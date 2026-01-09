"use client";

/**
 * =================================================================
 * TELEGRAM WEBAPP SDK v8.0+ (2026 Edition)
 * COMPLETE WRAPPER: Includes Full-Screen, UI Helpers, and Auth
 * =================================================================
 */

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
      photo_url?: string;
    };
    receiver?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    chat?: {
      id: number;
      type: "group" | "supergroup" | "channel";
      title: string;
      username?: string;
      photo_url?: string;
    };
    auth_date: number;
    hash: string;
    start_param?: string;
    can_send_after?: number;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
    header_bg_color?: string;
    accent_text_color?: string;
    section_bg_color?: string;
    section_header_text_color?: string;
    subtitle_text_color?: string;
    destructive_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;

  // 🚀 NEW: Bot API 8.0 Fullscreen & Swipes
  isFullscreen: boolean;
  isVerticalSwipesEnabled: boolean;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  enableVerticalSwipes: () => void;
  disableVerticalSwipes: () => void;
  lockOrientation: () => void;
  unlockOrientation: () => void;
  addToHomeScreen: () => void;
  checkHomeScreenStatus: (callback?: (status: string) => void) => void;

  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };
  SettingsButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  CloudStorage: {
    setItem: (key: string, value: string, callback?: (err: Error | null, success: boolean) => void) => void;
    getItem: (key: string, callback: (err: Error | null, value: string) => void) => void;
    getItems: (keys: string[], callback: (err: Error | null, values: Record<string, string>) => void) => void;
    removeItem: (key: string, callback?: (err: Error | null, success: boolean) => void) => void;
    removeItems: (keys: string[], callback?: (err: Error | null, success: boolean) => void) => void;
    getKeys: (callback: (err: Error | null, keys: string[]) => void) => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  showPopup: (params: any, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: { text?: string }, callback?: (text: string) => boolean | void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (text: string) => void) => void;
  requestWriteAccess: (callback?: (granted: boolean) => void) => void;
  requestContact: (callback?: (shared: boolean) => void) => void;
  sendData: (data: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// 🚀 CORE INSTANCE EXPORT
export const WebApp = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;

/**
 * HELPER: Version Check
 */
export function isVersionAtLeast(version: string): boolean {
  if (!WebApp) return false;
  const current = WebApp.version.split('.').map(Number);
  const target = version.split('.').map(Number);
  for (let i = 0; i < Math.max(current.length, target.length); i++) {
    if ((current[i] || 0) > (target[i] || 0)) return true;
    if ((current[i] || 0) < (target[i] || 0)) return false;
  }
  return true;
}

/**
 * HELPER: Native App Mode Initialization (v8.0)
 */
export function initializeNativeAppMode() {
  if (!WebApp) return;
  WebApp.ready();
  WebApp.expand();
  // Request Fullscreen if supported (API 8.0+)
  if (isVersionAtLeast("8.0")) {
    WebApp.requestFullscreen();
  }
  // Disable vertical swipes for better dashboard UX
  if (isVersionAtLeast("7.7")) {
    WebApp.disableVerticalSwipes();
  }
}

/**
 * HELPER: Auth & User Data
 */
export function isTelegramWebApp(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.Telegram?.WebApp?.initData;
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined" || !window.Telegram?.WebApp) return null;
  return window.Telegram.WebApp;
}

export function getInitData(): string | null {
  return getTelegramWebApp()?.initData || null;
}

export function getTelegramUser() {
  return getTelegramWebApp()?.initDataUnsafe?.user || null;
}

export function getStartParam(): string | null {
  return getTelegramWebApp()?.initDataUnsafe?.start_param || null;
}

/**
 * HELPER: UI Components (MainButton, BackButton, Popups)
 */
export function setMainButton(params: {
  text: string;
  visible?: boolean;
  active?: boolean;
  progress?: boolean;
  onClick?: () => void;
}) {
  const webapp = getTelegramWebApp();
  if (!webapp) return;

  const { MainButton } = webapp;
  MainButton.setText(params.text);

  if (params.visible !== undefined) params.visible ? MainButton.show() : MainButton.hide();
  if (params.active !== undefined) params.active ? MainButton.enable() : MainButton.disable();
  if (params.progress !== undefined) params.progress ? MainButton.showProgress() : MainButton.hideProgress();

  if (params.onClick) {
    MainButton.offClick(params.onClick);
    MainButton.onClick(params.onClick);
  }
}

export function setBackButton(visible: boolean, onClick?: () => void): () => void {
  const webapp = getTelegramWebApp();
  if (!webapp) return () => {};

  if (visible) {
    webapp.BackButton.show();
    if (onClick) webapp.BackButton.onClick(onClick);
  } else {
    webapp.BackButton.hide();
  }

  return () => {
    if (onClick) webapp.BackButton.offClick(onClick);
  };
}

export function showAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    const webapp = getTelegramWebApp();
    if (webapp) {
      webapp.showAlert(message, () => resolve());
    } else {
      window.alert(message);
      resolve();
    }
  });
}

export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const webapp = getTelegramWebApp();
    if (webapp) {
      webapp.showConfirm(message, (confirmed: boolean) => resolve(confirmed));
    } else {
      resolve(window.confirm(message));
    }
  });
}

/**
 * HELPER: Navigation & External Links
 */
export function openTelegramLink(url: string) {
  const webapp = getTelegramWebApp();
  if (webapp && isVersionAtLeast("6.1")) {
    webapp.openTelegramLink(url);
  } else {
    window.open(url, "_blank");
  }
}

/**
 * HELPER: Haptics
 */
export function hapticFeedback(type: "success" | "error" | "warning" | "light" | "medium" | "heavy") {
  const webapp = getTelegramWebApp();
  if (!webapp) return;
  const notifications = ["success", "error", "warning"];
  if (notifications.includes(type)) {
    webapp.HapticFeedback.notificationOccurred(type as any);
  } else {
    webapp.HapticFeedback.impactOccurred(type as any);
  }
}
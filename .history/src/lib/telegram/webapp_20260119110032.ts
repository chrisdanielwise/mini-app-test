"use client";

/**
 * =================================================================
 * TELEGRAM WEBAPP SDK v8.0+ (2026 Institutional Edition)
 * DEFINITIVE WRAPPER: Includes Full-Screen, UI Helpers, and Auth
 * =================================================================
 */

// --- 🛰️ EXPORTED DOMAIN TYPES ---
export type HapticImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";
export type NotificationType = "error" | "success" | "warning";
export type TelegramPlatform = "android" | "ios" | "tdesktop" | "macos" | "web" | "weba" | "unsupported";
export type HomeScreenStatus = "unsupported" | "unknown" | "added" | "missed";

export interface WebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: WebAppUser;
    receiver?: WebAppUser;
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
  platform: TelegramPlatform;
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

  // 🚀 NATIVE FULLSCREEN & SWIPES (API 8.0+)
  isFullscreen: boolean;
  isVerticalSwipesEnabled: boolean;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  enableVerticalSwipes: () => void;
  disableVerticalSwipes: () => void;
  lockOrientation: () => void;
  unlockOrientation: () => void;
  addToHomeScreen: () => void;
  checkHomeScreenStatus: (callback?: (status: HomeScreenStatus) => void) => void;

  // Added for Layout Integrity
  safeAreaInset: { top: number; bottom: number; left: number; right: number };
  contentSafeAreaInset: { top: number; bottom: number; left: number; right: number };

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
  HapticFeedback: {
    impactOccurred: (style: HapticImpactStyle) => void;
    notificationOccurred: (type: NotificationType) => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  sendData: (data: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// 🚀 CORE INSTANCE EXPORT (Harden Type)
export const WebApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;

/**
 * 🛠️ UTILITY FUNCTIONS
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

export function getTelegramUser(): WebAppUser | null {
  return getTelegramWebApp()?.initDataUnsafe?.user || null;
}

export function getStartParam(): string | null {
  return getTelegramWebApp()?.initDataUnsafe?.start_param || null;
}

/**
 * Hardened Initialization for API 8.0+
 */
export function initializeNativeAppMode() {
  const webapp = getTelegramWebApp();
  if (!webapp) return;

  webapp.ready();
  webapp.expand();
  
  // 🛰️ API 8.0+ Immersive Check
  if (parseFloat(webapp.version) >= 8.0) {
    try {
      if (webapp.requestFullscreen) webapp.requestFullscreen();
      if (webapp.enableVerticalSwipes) webapp.enableVerticalSwipes();
    } catch (e) {
      console.warn("Terminal Node: Immersive mode handshake failed.");
    }
  }

  // 📐 Safe Area CSS Bridge
  const root = document.documentElement;
  const insets = webapp.contentSafeAreaInset || webapp.safeAreaInset;
  
  if (insets) {
    root.style.setProperty('--tg-safe-top', `${insets.top}px`);
    root.style.setProperty('--tg-safe-bottom', `${insets.bottom}px`);
    root.style.setProperty('--tg-safe-left', `${insets.left}px`);
    root.style.setProperty('--tg-safe-right', `${insets.right}px`);
  }
}

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

export function hapticFeedback(type: HapticImpactStyle | NotificationType) {
  const webapp = getTelegramWebApp();
  if (!webapp) return;
  const notifications: NotificationType[] = ["success", "error", "warning"];
  if (notifications.includes(type as NotificationType)) {
    webapp.HapticFeedback.notificationOccurred(type as NotificationType);
  } else {
    webapp.HapticFeedback.impactOccurred(type as HapticImpactStyle);
  }
}

export function showAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    const webapp = getTelegramWebApp();
    if (webapp) webapp.showAlert(message, () => resolve());
    else {
      window.alert(message);
      resolve();
    }
  });
}

export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const webapp = getTelegramWebApp();
    if (webapp) webapp.showConfirm(message, (confirmed: boolean) => resolve(confirmed));
    else resolve(window.confirm(message));
  });
}

export function openTelegramLink(url: string) {
  const webapp = getTelegramWebApp();
  if (webapp) webapp.openTelegramLink(url);
  else window.open(url, "_blank");
}
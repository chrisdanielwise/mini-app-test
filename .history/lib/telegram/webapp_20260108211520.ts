"use client";

/**
 * =================================================================
 * TELEGRAM WEBAPP SDK v8.0+ (2026 Edition)
 * COMPLETE WRAPPER: Fixed for Full-Screen, UI Helpers, and Auth
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
  checkHomeScreenStatus: (callback?: (status: string) => void) => void;

  // Added for Resizing Support
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
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  openTelegramLink: (url: string) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const WebApp = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;

/**
 * 🛠️ UTILITY FUNCTIONS (Fully Restored)
 */

export function getTelegramWebApp(): TelegramWebApp | null {
  return WebApp;
}

export function isTelegramWebApp(): boolean {
  return !!WebApp?.initData;
}

export function getInitData(): string | null {
  return WebApp?.initData || null;
}

export function getTelegramUser() {
  return WebApp?.initDataUnsafe?.user || null;
}

export function getStartParam(): string | null {
  return WebApp?.initDataUnsafe?.start_param || null;
}

export function initializeNativeAppMode() {
  if (!WebApp) return;
  WebApp.ready();
  WebApp.expand();
  // Request Fullscreen immediately to fix the "Drawer" issue
  if (WebApp.version >= "8.0" && typeof WebApp.requestFullscreen === 'function') {
    WebApp.requestFullscreen();
  }
}

export function hapticFeedback(type: "success" | "error" | "warning" | "light" | "medium" | "heavy") {
  if (!WebApp) return;
  const notifications = ["success", "error", "warning"];
  if (notifications.includes(type)) {
    WebApp.HapticFeedback.notificationOccurred(type as any);
  } else {
    WebApp.HapticFeedback.impactOccurred(type as any);
  }
}

export function setBackButton(visible: boolean, onClick?: () => void): () => void {
  if (!WebApp) return () => {};
  if (visible) {
    WebApp.BackButton.show();
    if (onClick) WebApp.BackButton.onClick(onClick);
  } else {
    WebApp.BackButton.hide();
  }
  return () => { if (onClick) WebApp.BackButton.offClick(onClick); };
}

export function setMainButton(params: {
  text: string;
  visible?: boolean;
  active?: boolean;
  progress?: boolean;
  onClick?: () => void;
}) {
  if (!WebApp) return;
  const { MainButton } = WebApp;
  MainButton.setText(params.text);
  if (params.visible !== undefined) params.visible ? MainButton.show() : MainButton.hide();
  if (params.active !== undefined) params.active ? MainButton.enable() : MainButton.disable();
  if (params.progress !== undefined) params.progress ? MainButton.showProgress() : MainButton.hideProgress();
  if (params.onClick) {
    MainButton.offClick(params.onClick);
    MainButton.onClick(params.onClick);
  }
}

export function openTelegramLink(url: string) {
  if (WebApp) WebApp.openTelegramLink(url);
  else window.open(url, "_blank");
}

export function showAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    if (WebApp) WebApp.showAlert(message, () => resolve());
    else { window.alert(message); resolve(); }
  });
}

export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (WebApp) WebApp.showConfirm(message, (confirmed: boolean) => resolve(confirmed));
    else resolve(window.confirm(message));
  });
}
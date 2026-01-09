"use client";

/**
 * =================================================================
 * TELEGRAM WEBAPP SDK v8.0+ (2026 Edition)
 * Updated for Full-Screen immersion and Orientation Management
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
    auth_date: number;
    hash: string;
    start_param?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;

  // Lifecycle & UI
  ready: () => void;
  expand: () => void;
  close: () => void;

  // 🚀 NEW: Bot API 8.0 Fullscreen Methods
  isFullscreen: boolean;
  requestFullscreen: () => void;
  exitFullscreen: () => void;

  // 🚀 NEW: Orientation & Lock
  isVerticalSwipesEnabled: boolean;
  enableVerticalSwipes: () => void;
  disableVerticalSwipes: () => void;
  lockOrientation: () => void;
  unlockOrientation: () => void;

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
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    enable: () => void;
    disable: () => void;
  };

  HapticFeedback: {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };

  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (
    message: string,
    callback?: (confirmed: boolean) => void
  ) => void;
}

// 🚀 EXPORT THE GLOBAL WebApp OBJECT FOR USE IN SHELLS
export const WebApp =
  typeof window !== "undefined" ? (window as any).Telegram?.WebApp : null;

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

/**
 * Check if the SDK version supports a specific feature
 */
export function isVersionAtLeast(version: string): boolean {
  if (!WebApp) return false;
  const current = WebApp.version.split(".").map(Number);
  const target = version.split(".").map(Number);

  for (let i = 0; i < Math.max(current.length, target.length); i++) {
    if ((current[i] || 0) > (target[i] || 0)) return true;
    if ((current[i] || 0) < (target[i] || 0)) return false;
  }
  return true;
}

/**
 * Initialize Full App Immersion
 * Best used in useEffect inside a DashboardShell
 */
export function initializeNativeAppMode() {
  if (!WebApp) return;

  WebApp.ready();
  WebApp.expand();

  // Request Fullscreen if supported (API 8.0+)
  if (isVersionAtLeast("8.0")) {
    WebApp.requestFullscreen();
  }

  // Disable vertical swipes to prevent accidental closure during scrolling
  if (isVersionAtLeast("7.7")) {
    WebApp.disableVerticalSwipes();
  }
}

/**
 * Trigger haptic feedback with type mapping
 */
export function hapticFeedback(
  type: "success" | "error" | "warning" | "light" | "medium" | "heavy"
) {
  if (!WebApp) return;
  const notifications = ["success", "error", "warning"];
  if (notifications.includes(type)) {
    WebApp.HapticFeedback.notificationOccurred(type as any);
  } else {
    WebApp.HapticFeedback.impactOccurred(type as any);
  }
}

/**
 * Configure Back Button with automatic cleanup capability
 */
export function setBackButton(
  visible: boolean,
  onClick?: () => void
): () => void {
  if (!WebApp) return () => {};

  if (visible) {
    WebApp.BackButton.show();
    if (onClick) WebApp.BackButton.onClick(onClick);
  } else {
    WebApp.BackButton.hide();
  }

  return () => {
    if (onClick) WebApp.BackButton.offClick(onClick);
  };
}

/**
 * Promise-based Alert Popup
 */
export function showAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    if (WebApp) {
      WebApp.showAlert(message, () => resolve());
    } else {
      window.alert(message);
      resolve();
    }
  });
}

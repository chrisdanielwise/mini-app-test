import { TelegramWebApp } from "@/lib/telegram/webapp";

export interface TelegramContextValue {
  webApp?: TelegramWebApp;
  isTelegram: boolean;
  isReady: boolean; // ✅ Added to resolve Sidebar error
  hapticFeedback: (style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => void; // ✅ Added
  setMainButton: (params: { text: string; color?: string; text_color?: string; is_visible?: boolean; is_active?: boolean }) => void; // ✅ Added
}
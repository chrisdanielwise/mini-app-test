/**
 * Hardened Initialization for API 8.0+
 */
export function initializeNativeAppMode() {
  const webapp = getTelegramWebApp();
  if (!webapp) return;

  webapp.ready();
  
  // 🛡️ Viewport Stabilization
  // Expand first, then request fullscreen for maximum stability
  webapp.expand();
  
  // 🛰️ API 8.0+ Immersive Check
  // Always check version as a string comparison for Telegram safety
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
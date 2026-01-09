"use client";

import { useEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";

/**
 * 🚀 DASHBOARD SHELL
 * This component handles all the Telegram native "App Mode" logic.
 * By wrapping the dashboard in this, we ensure the UI expands to 
 * full screen and feels like a native iOS/Android app.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure we are in the browser and Telegram SDK is available
    if (typeof window !== "undefined" && WebApp) {
      try {
        // Notify Telegram the app is ready to display
        WebApp.ready();
        
        // Expand the Mini App to the maximum available height
        WebApp.expand();
        
        // 🏁 FULLSCREEN (Bot API 8.0+)
        // This removes the Telegram header/status bar for total immersion
        if (WebApp.isVersionAtLeast("8.0")) {
          WebApp.requestFullscreen();
        }

        // 🛡️ SWIPE PROTECTION
        // Prevents the user from accidentally closing the app when scrolling down
        if (WebApp.isVersionAtLeast("7.7")) {
          WebApp.disableVerticalSwipes();
        }

        // Sets the top status bar color to match your dashboard theme
        WebApp.setHeaderColor('secondary_bg_color');
        
      } catch (e) {
        console.error("TMA Native UI Error:", e);
      }
    }
  }, []);

  return <>{children}</>;
}
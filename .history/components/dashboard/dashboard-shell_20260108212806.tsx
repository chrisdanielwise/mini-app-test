"use client";

import { useEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";

/**
 * 🚀 DASHBOARD SHELL (Immersive Mode)
 * This component forces the Mini App into native fullscreen mode
 * and ensures the layout resizes to fill 100% of the available area.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        // 1. Notify Telegram the app is ready for display
        WebApp.ready();
        
        // 2. Expand the viewport to the maximum height available in the current mode
        WebApp.expand();
        
        // 3. 🚀 BOT API 8.0 NATIVE FULLSCREEN
        // This removes the Telegram header/bottom bars entirely for an app experience.
        if (typeof WebApp.requestFullscreen === 'function') {
          WebApp.requestFullscreen();
        }

        // 4. Disable swipes to prevent accidental app closure while interacting with charts
        if (typeof WebApp.disableVerticalSwipes === 'function') {
          WebApp.disableVerticalSwipes();
        }

        // 5. Set the top status bar color to match the dashboard background theme
        WebApp.setHeaderColor('secondary_bg_color');

      } catch (e) {
        console.warn("Native immersion initialization failed:", e);
      }
    }
  }, []);

  return (
    /**
     * 🏁 THE RESIZE FIX
     * Using 'w-screen' and 'min-h-screen' ensures the background covers 
     * the area vacated by the Telegram header when entering fullscreen.
     */
    <div className="relative flex min-h-screen w-screen flex-col bg-background overflow-x-hidden antialiased">
      {/* Safe Area handling ensures content isn't hidden behind the 
        Telegram 'Close' button or the phone's hardware notch.
      */}
      <main className="flex-1 w-full animate-in fade-in duration-700">
        {children}
      </main>
    </div>
  );
}
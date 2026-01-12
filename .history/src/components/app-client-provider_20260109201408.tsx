"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export function AppClientProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initTMA = () => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand(); // Make the app full screen
        
        // Sync Telegram Theme Colors to CSS Variables
        document.documentElement.style.setProperty('--tg-theme-bg', tg.themeParams.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text', tg.themeParams.text_color || '#000000');
        
        setIsReady(true);
      }
    };

    // Check if script is already loaded
    if (window.Telegram?.WebApp) {
      initTMA();
    } else {
      // Fallback for slower loads
      const timeout = setTimeout(initTMA, 500);
      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <>
      <Script 
        src="https://telegram.org/js/telegram-web-app.js" 
        strategy="beforeInteractive" 
      />
      <div className={isReady ? "animate-in fade-in duration-500" : "opacity-0"}>
        {children}
      </div>
    </>
  );
}
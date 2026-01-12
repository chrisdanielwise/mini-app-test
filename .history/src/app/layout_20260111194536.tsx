
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { LayoutProvider } from '@/context/layout-provider'
import { TelegramProvider } from '@/components/telegram/telegram-provider' 
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import './globals.css'
import { useEffect } from 'react'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Zipha Terminal | Merchant Command',
    template: '%s | Zipha'
  },
  description: 'High-resiliency infrastructure for Telegram subscription management.',
  metadataBase: new URL('https://zipha.finance'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Zipha',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
  const count = window.sessionStorage.getItem('loop_count') || '0';
  const newCount = parseInt(count) + 1;
  window.sessionStorage.setItem('loop_count', newCount.toString());
  
  console.log(`🚀 RELOAD #${newCount} | Path: ${window.location.pathname}`);
  
  if (newCount > 10) {
    console.error("🛑 LOOP DETECTED. Clearing storage and stopping.");
    window.sessionStorage.clear();
  }
}, []);

  return (
    <html 
      lang="en" 
      // 🛡️ CRITICAL: Suppress warning because Telegram SDK 8.0 
      // injects 'tg-theme-dark' classes before React hydrates.
      suppressHydrationWarning 
      className={cn(
        "dark scroll-smooth antialiased",
        "selection:bg-primary/20 selection:text-primary-foreground",
        geistSans.variable,
        geistMono.variable
      )}
    >
      <head>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body 
        className={cn(
          "font-sans bg-background text-foreground",
          "min-h-[100dvh] w-full overflow-x-hidden",
          "flex flex-col relative overscroll-none tabular-nums"
        )}
        // 🛡️ Prevent the body from flickering during theme-sync
        suppressHydrationWarning
      >
        {/* 🛰️ TELEGRAM PROVIDER: Primary Identity Node */}
        <TelegramProvider>
          {/* 🎭 LAYOUT PROVIDER: Theme & Role-Based UI (Amber/Emerald) */}
          <LayoutProvider>
            
            {/* 🚀 PRIMARY CONTENT INGRESS */}
            {/* Using a stable main wrapper prevents full-page layout shifts */}
            <main className="flex-1 flex flex-col w-full relative z-10">
              {children}
            </main>
            
            <Toaster 
              position="top-center" 
              expand={false} 
              richColors 
              theme="dark"
              closeButton
              toastOptions={{
                className: cn(
                  "rounded-xl border-border/10 bg-card/90 backdrop-blur-2xl",
                  "font-sans font-black uppercase tracking-[0.2em] text-[9px]",
                  "shadow-2xl shadow-black/50"
                ),
              }}
            />
          </LayoutProvider>
        </TelegramProvider>
        
        <Analytics />
      </body>
    </html>
  );
}
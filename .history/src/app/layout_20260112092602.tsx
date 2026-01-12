import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { LayoutProvider } from '@/context/layout-provider'
import { AppClientProvider } from '@/components/providers/app-client-provider' 
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import './globals.css'

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
  return (
    <html 
      lang="en" 
      // 🛡️ HYDRATION BUNKER: Suppress warning for Telegram's class injection.
      suppressHydrationWarning 
      className={cn(
        "dark scroll-smooth antialiased",
        "selection:bg-primary/20 selection:text-primary-foreground",
        geistSans.variable,
        geistMono.variable
      )}
    >
      <head>
        {/* 🛰️ SCRIPT INGRESS: strategy="beforeInteractive" is vital for TMA Handshake */}
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
        suppressHydrationWarning
      >
        {/* 🚩 INSTITUTIONAL AUDIT: 
          LoopSentinel REMOVED. It was fighting Turbopack compilation 
          by triggering reloads before the 200 OK was fully rendered.
        */}

        {/* 🛰️ APP CLIENT PROVIDER: Combined Hardware & Version Handshake (v6.1 Gate) */}
        <AppClientProvider>
          {/* 🎭 LAYOUT PROVIDER: Theme & Role-Based UI (Amber/Emerald) */}
          <LayoutProvider>
            
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
        </AppClientProvider>
        
        <Analytics />
      </body>
    </html>
  );
}
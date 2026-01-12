import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { LayoutProvider } from '@/src/context/layout-provider'
import { TelegramProvider } from '@/src/components/telegram/telegram-provider' // 🛰️ Added Identity Provider
import { Toaster } from "@/src/components/ui/sonner"
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
});

/**
 * 🏛️ METADATA NODE
 * Institutional SEO and Social Graph configuration.
 */
export const metadata: Metadata = {
  title: {
    default: 'Zipha Terminal | Merchant Command',
    template: '%s | Zipha'
  },
  description: 'High-resiliency infrastructure for Telegram subscription management.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Zipha',
  },
}

/**
 * 🏁 VIEWPORT CONFIGURATION
 * Optimized for Notch/Dynamic Island and Telegram WebApp stability.
 */
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
      suppressHydrationWarning 
      className="dark" // 🌑 Forcing Dark Mode for the Command Center feel
    >
      <head>
        {/* 📡 TELEGRAM HANDSHAKE SCRIPT: Essential for Bot API 8.0 features */}
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30 bg-background min-h-screen`}
        suppressHydrationWarning
      >
        {/* 🛰️ GLOBAL PROVIDER CLUSTER 
            Fixed: TelegramProvider now wraps the entire application tree.
        */}
        <TelegramProvider>
          <LayoutProvider>
            {children}
            
            <Toaster 
              position="top-right" 
              expand={false} 
              richColors 
              theme="dark"
              closeButton
            />
          </LayoutProvider>
        </TelegramProvider>
        
        <Analytics />
      </body>
    </html>
  );
}
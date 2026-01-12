import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { LayoutProvider } from '@/context/layout-provider'
import { TelegramProvider } from '@/components/telegram/telegram-provider' 
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

/**
 * 🏛️ METADATA NODE (Tactical Medium)
 * Institutional SEO and Social Graph configuration.
 */
export const metadata: Metadata = {
  title: {
    default: 'Zipha Terminal | Merchant Command',
    template: '%s | Zipha'
  },
  description: 'High-resiliency infrastructure for Telegram subscription management.',
  metadataBase: new URL('https://zipha.finance'),
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
 * Normalized: Fixed 100% width and cover-fit for edge-to-edge layouts.
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
      className={cn(
        "dark scroll-smooth antialiased",
        "selection:bg-primary/20 selection:text-primary-foreground"
      )}
    >
      <head>
        {/* 📡 TELEGRAM HANDSHAKE SCRIPT: Essential for Bot API 8.0 features */}
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body 
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "font-sans bg-background text-foreground",
          "min-h-[100dvh] w-full overflow-x-hidden",
          "flex flex-col relative overscroll-none tabular-nums"
        )}
        suppressHydrationWarning
      >
        {/* 🛰️ GLOBAL PROVIDER CLUSTER: Hardened Identity Handshake */}
        <TelegramProvider>
          <LayoutProvider>
            
            {/* 🚀 PRIMARY CONTENT INGRESS */}
            <div className="flex-1 flex flex-col w-full relative z-10">
              {children}
            </div>
            
            {/* 📢 SYSTEM BROADCAST NODE: Tactical Notifications (Compacted) */}
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
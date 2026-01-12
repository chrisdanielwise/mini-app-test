import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { LayoutProvider } from '@/context/layout-provider'
import { AppClientProvider } from '@/components/app-client-provider'
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import './globals.css'
// import 'dotenv/config'

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
      // 🛡️ HYDRATION BUNKER: Prevents 'tg-theme' class injection mismatches
      suppressHydrationWarning 
      className={cn(
        "dark scroll-smooth antialiased",
        geistSans.variable,
        geistMono.variable
      )}
    >
      <head>
        {/* 🛰️ SCRIPT INGRESS: BeforeInteractive is required for early window.Telegram access */}
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
        {/* 🎭 1. PARENT CONTEXT: Provides 'flavor' and UI state to the entire tree */}
        <LayoutProvider>
          
          {/* 🛰️ 2. HARDWARE HANDSHAKE: Can now safely consume LayoutProvider context */}
          <AppClientProvider>
            
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
          </AppClientProvider>
        </LayoutProvider>
        
        <Analytics />
      </body>
    </html>
  );
}
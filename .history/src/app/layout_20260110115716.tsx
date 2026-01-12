import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { LayoutProvider } from '@/context/layout-provider'
import { Toaster } from "@/components/ui/sonner" // 🍞 Added Global Notifications
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
    statusBarStyle: 'black-translucent', // 📱 Darker, more premium feel
    title: 'Zipha',
  },
}

/**
 * 🏁 VIEWPORT CONFIGURATION (Staff Standard)
 * Prevents accidental zoom and optimizes for Notch/Dynamic Island layouts.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000', // 🌑 Matches 2026 Dark Mode aesthetics
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className="dark" // 🌑 Defaulting to Dark Mode for the Command Center feel
    >
      <head>
        {/* 📡 TELEGRAM HANDSHAKE SCRIPT */}
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30 bg-background min-h-screen`}
        suppressHydrationWarning
      >
        {/* 🛠️ GLOBAL PROVIDER CLUSTER */}
        <LayoutProvider>
          {children}
          
          {/* 🍞 GLOBAL TOASTER 
              Essential for high-tier dashboards to show 'Sync Success' or 'Transaction Failed'
          */}
          <Toaster 
            position="top-right" 
            expand={false} 
            richColors 
            theme="dark"
            closeButton
          />
        </LayoutProvider>
        
        <Analytics />
      </body>
    </html>
  );
}
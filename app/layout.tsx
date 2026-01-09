import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { LayoutProvider } from '@/context/layout-provider'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: 'Zipha | Merchant Platform',
  description: 'Manage your Telegram subscription business',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Zipha',
  },
}

/**
 * 🏁 VIEWPORT CONFIGURATION
 * userScalable: false is critical for dashboards to prevent 
 * accidental zooming while interacting with charts.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Ensures content fills the area behind the notch
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      /** * 🚀 HYDRATION FIX: 
       * Telegram injects CSS variables and theme classes into the <html> 
       * element immediately on load.
       */
      suppressHydrationWarning 
    >
      <head>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30 bg-background`}
        /** * 🚀 HYDRATION FIX (BODY):
         * The SDK toggles classes on the body to handle native viewports. 
         */
        suppressHydrationWarning
      >
        {/* 🛠️ GLOBAL STATE BRIDGE
            Placing LayoutProvider here allows every page (Dashboard, Settings, etc)
             to access the dynamic layout state (isFullSize, navMode).
        */}
        <LayoutProvider>
          {children}
        </LayoutProvider>
        
        <Analytics />
      </body>
    </html>
  );
}
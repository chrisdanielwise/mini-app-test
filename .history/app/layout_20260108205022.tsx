import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30`}
        /** * 🚀 THE CRITICAL ADDITION:
         * The SDK often toggles classes on the body to handle viewports. 
         * Suppressing here prevents the mismatch between server-rendered 
         * and client-modified HTML.
         */
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
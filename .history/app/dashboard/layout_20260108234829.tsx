import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import '../globals.css'

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
  userScalable: false, // Essential for Mini App stability
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning // Prevents flicker from Telegram theme injection
    >
      <head>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import React from "react";

/**
 * Clean, fast loading state for the Dashboard.
 * We remove the CSS/Font imports to prevent "Module not found" errors.
 */
export default function DashboardLoading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4">
      {/* A simple, CSS-based spinner that doesn't rely on external assets */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      
      <div className="flex flex-col items-center space-y-1">
        <h2 className="text-sm font-black uppercase italic tracking-widest text-primary">
          Initializing Link
        </h2>
        <p className="text-[10px] font-medium uppercase text-muted-foreground animate-pulse">
          Establishing Secure Connection to Neon...
        </p>
      </div>
    </div>
  );
}
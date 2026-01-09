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
  // Essential for mobile apps to prevent unwanted zooming
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Zipha',
  },
}

// Prevents user from zooming in/out, which can break TMA layouts
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
      // Important: Telegram injects classes and styles into <html> at runtime
      suppressHydrationWarning 
    >
      <head>
        {/* Load the Telegram WebApp SDK before the app initializes */}
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
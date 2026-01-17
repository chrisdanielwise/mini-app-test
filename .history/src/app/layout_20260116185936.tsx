"use client";

import * as React from "react";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

// 🏛️ Institutional Providers
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { DeviceProvider } from "@/components/providers/device-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { AppClientProvider } from "@/components/providers/app-client-provider";
import { AuthSyncProvider } from "@/components/auth/auth-sync-provider";

// 🌊 Kinetic UI Components
import { cn } from "@/lib/utils";
import "./globals.css";
import { GlobalToaster } from "@/components/providers/toast-provider";
import { AutoSignalListener } from "@/components/providers/auto-signal-listener";

const geistSans = Geist({ 
  subsets: ["latin"], 
  variable: "--font-sans", 
  display: "swap" 
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono", 
  display: "swap" 
});

/**
 * 🛰️ ROOT_LAYOUT (Institutional Apex v2026.1.20)
 * Strategy: Stationary Horizon & Laminar Stacking.
 * Fix: Standardized Grid Anchor (0.01 opacity) prevents visual blowout.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark scroll-smooth antialiased selection:bg-primary/20 leading-tight",
        geistSans.variable, 
        geistMono.variable
      )}
    >
      <head>
        {/* 🛡️ HARDWARE HANDSHAKE: Critical Native Scripting */}
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
        {/* 🛠️ ERUDA MOBILE CONSOLE: Add this for debugging on your phone */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/eruda" 
          strategy="beforeInteractive" 
          onLoad={() => console.log('Eruda loaded')}
        />
        <Script id="eruda-init" strategy="afterInteractive">
          {`eruda.init();`}
        </Script>
      </head>
      
      
    </html>
  );
}
"use client";

import * as React from "react";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { TelegramProvider } from "@/components/providers/telegram-provider";
import { DeviceProvider } from "@/components/providers/device-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { AppClientProvider } from "@/components/providers/app-client-provider";
import { AuthSyncProvider } from "@/components/auth/auth-sync-provider";

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
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/eruda" 
          strategy="beforeInteractive" 
        />
        <Script id="eruda-init" strategy="afterInteractive">
          {`eruda.init();`}
        </Script>
      </head>
      
      <body className={cn(
        "font-sans bg-black text-foreground antialiased overflow-hidden",
        "w-full h-[100dvh] fixed inset-0 flex flex-col"
      )}>
        
        <DeviceProvider>
          <TelegramProvider>
            <LayoutProvider>
              <AuthSyncProvider>
                <AppClientProvider>
                  
                  {/* 🛰️ THE GLOBAL BUFFER: This handles the notch for the whole app */}
                  <div 
                    className="w-full shrink-0 bg-black" 
                    style={{ height: 'calc(var(--tg-safe-top, 27px) + 12px)' }}
                  />

                  {/* 🚀 PRIMARY VIEWPORT */}
                  <main className="flex-1 flex flex-col w-full relative z-10 overflow-hidden">
                    {children}
                  </main>

                  <AutoSignalListener />
                  <GlobalToaster />

                </AppClientProvider>
              </AuthSyncProvider>
            </LayoutProvider>
            <Analytics />
          </TelegramProvider>
        </DeviceProvider>

        {/* 🌫️ BACKGROUND SENTINELS */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.015),transparent_70%)] pointer-events-none z-0" />
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center" />
      </body>
    </html>
  );
}
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
import { GlobalToaster } from "@/components/dashboard/global-toaster";
import { AutoSignalListener } from "@/components/dashboard/auto-signal-listener";
import { cn } from "@/lib/utils";
import "./globals.css";

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
 * 🛰️ ROOT_LAYOUT (Institutional Apex v2026.1.15)
 * Aesthetics: Liquid Hydration | Obsidian-OLED Depth.
 * Logic: morphology-aware provider nesting with Hardware-Safe Clamping.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark scroll-smooth antialiased selection:bg-primary/30",
        geistSans.variable, 
        geistMono.variable
      )}
    >
      <head>
        {/* 🛡️ TELEGRAM BOOTSTRAP: Critical Hardware Handshake */}
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      
      <body className={cn(
        "font-sans bg-background text-foreground min-h-[100dvh] w-full",
        "flex flex-col relative overflow-x-hidden overscroll-none tabular-nums"
      )}>
        
        {/* 🏛️ ARCHITECTURAL HIERARCHY
            1. DeviceProvider: Resolves hardware tier & safe areas.
            2. TelegramProvider: Hydrates TMA context & Haptics.
            3. LayoutProvider: Injects platform-specific flavor (Staff/Merchant).
        */}
        <DeviceProvider>
          <TelegramProvider>
            <LayoutProvider>
              <AuthSyncProvider>
                <AppClientProvider>
                  
                  {/* 🌊 KINETIC VOLUME: The Primary Viewport */}
                  <main className="flex-1 flex flex-col w-full relative z-10 animate-in fade-in duration-1000">
                    {children}
                  </main>

                  {/* 🛰️ BACKGROUND SENTINELS: Silent Mesh Listeners */}
                  <AutoSignalListener />

                  {/* ✅ APEX_NOTIFICATION: Morphology-aware placement */}
                  <GlobalToaster />

                </AppClientProvider>
              </AuthSyncProvider>
            </LayoutProvider>
            
            <Analytics />
          </TelegramProvider>
        </DeviceProvider>

        {/* 🌫️ SUBSURFACE MASK: Atmospheric Depth Layer */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.03),transparent_50%)] pointer-events-none z-0" />
      </body>
    </html>
  );
}
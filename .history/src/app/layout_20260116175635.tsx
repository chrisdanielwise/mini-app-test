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
        
      </head>
      
      <body className={cn(
        "font-sans bg-background text-foreground min-h-[100dvh] w-full",
        "flex flex-col relative overflow-x-hidden overscroll-none tabular-nums"
      )}>
        
        {/* 🏛️ ARCHITECTURAL HIERARCHY (Protocol v2026.1.20) */}
        <DeviceProvider>
          <TelegramProvider>
            <LayoutProvider>
              <AuthSyncProvider>
                <AppClientProvider>
                  
                  {/* 🚀 INDEPENDENT TACTICAL VOLUME: Primary Viewport */}
                  <main className="flex-1 flex flex-col w-full relative z-10 animate-in fade-in duration-700">
                    {children}
                  </main>

                  {/* 🛰️ BACKGROUND SENTINELS */}
                  <AutoSignalListener />

                  {/* ✅ GLOBAL NOTIFICATION: Clinical Density Standard */}
                  <GlobalToaster />

                </AppClientProvider>
              </AuthSyncProvider>
            </LayoutProvider>
            
            <Analytics />
          </TelegramProvider>
        </DeviceProvider>

        {/* 🌫️ SUBSURFACE MASK: Atmospheric Depth Layer (v2026 Standard) */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.015),transparent_70%)] pointer-events-none z-0" />
        
        {/* 📐 STATIONARY GRID ANCHOR: The Tactical Horizon Anchor */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center" />
      </body>
    </html>
  );
}
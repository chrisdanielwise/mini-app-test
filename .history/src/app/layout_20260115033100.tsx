"use client";

import { TelegramProvider } from "@/components/providers/telegram-provider";
import { DeviceProvider } from "@/components/providers/device-provider"; // 📱 REQUIRED
import { LayoutProvider } from "@/context/layout-provider";
import { AppClientProvider } from "@/components/providers/app-client-provider";
import { AuthSyncProvider } from "@/components/auth/auth-sync-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark scroll-smooth antialiased", geistSans.variable, geistMono.variable)}
    >
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="font-sans bg-background text-foreground min-h-[100dvh] w-full overflow-x-hidden flex flex-col relative overscroll-none tabular-nums">
        
        {/* 🏛️ NESTING DEPTH: DeviceProvider must be the outermost layer for Toaster access */}
        <DeviceProvider>
          <TelegramProvider>
            <LayoutProvider>
              <AuthSyncProvider>
                <AppClientProvider>
                  
                  <main className="flex-1 flex flex-col w-full relative z-10">
                    {children}
                  </main>

                  {/* ✅ FIXED: Toaster is now inside DeviceProvider & TelegramProvider */}
                  <Toaster
                    position="top-center"
                    expand={false}
                    richColors
                    theme="dark"
                    closeButton
                    toastOptions={{
                      className: cn(
                        "rounded-2xl border-border/10 bg-card/90 backdrop-blur-3xl",
                        "font-sans font-black uppercase tracking-[0.2em] text-[9px]",
                        "shadow-2xl shadow-black/80"
                      ),
                    }}
                  />

                </AppClientProvider>
              </AuthSyncProvider>
            </LayoutProvider>
            
            <Analytics />
          </TelegramProvider>
        </DeviceProvider>

      </body>
    </html>
  );
}
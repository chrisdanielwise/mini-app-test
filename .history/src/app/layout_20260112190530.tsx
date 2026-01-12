import { TelegramProvider } from "@/components/telegram/telegram-provider";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { LayoutProvider } from "@/context/layout-provider"; // 🛡️ Standardized Path
import { AppClientProvider } from "@/components/app-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

// 🏛️ TYPOGRAPHY ENGINE: Institutional Standard
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// 🛰️ GLOBAL METADATA: SEO & PWA Protocol
export const metadata: Metadata = {
  title: {
    default: "Zipha Terminal | Institutional Command",
    template: "%s | Zipha",
  },
  description: "High-resiliency infrastructure for autonomous signal clusters.",
  metadataBase: new URL("https://zipha.finance"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zipha",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// 📱 VIEWPORT CONFIG: Mini App Optimization (Next.js 15+ Standard)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

/**
 * 🏛️ ROOT LAYOUT (Institutional v9.6.5)
 * Architecture: Tiered Provider Ingress.
 * Hardened: Hydration Bunker prevents tg-theme injection mismatches.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // 🛡️ HYDRATION BUNKER: Prevents 'tg-theme' class injection mismatches in Mini Apps
      suppressHydrationWarning
      className={cn(
        "dark scroll-smooth antialiased selection:bg-primary/30",
        geistSans.variable,
        geistMono.variable
      )}
    >
      <head>
        {/* 🛰️ SCRIPT INGRESS: Critical for window.Telegram access before mount */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={cn(
          "font-sans bg-background text-foreground",
          "min-h-[100dvh] w-full overflow-x-hidden",
          "flex flex-col relative overscroll-none tabular-nums"
        )}
        suppressHydrationWarning
      >
        [Image of the Next.js hydration process]
        {/* 🛰️ GLOBAL TELEGRAM INGRESS: Wraps everything */}
        <TelegramProvider>
          {/* 🎭 1. PARENT CONTEXT: Orchestrates Flavor (Amber/Emerald) and UI State */}
          <LayoutProvider>
            {/* 🛰️ 2. HARDWARE HANDSHAKE: Authenticates Telegram Identity Nodes */}
            <AppClientProvider>
              <main className="flex-1 flex flex-col w-full relative z-10">
                {children}
              </main>

              {/* 🍞 NOTIFICATION TERMINAL: Institutional Toaster */}
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
          </LayoutProvider>

          <Analytics />
        </TelegramProvider>
      </body>
    </html>
  );
}

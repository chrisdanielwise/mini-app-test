import { TelegramProvider } from "@/components/providers/telegram-provider";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { LayoutProvider } from "@/context/layout-provider";
import { AppClientProvider } from "@/components/providers/app-client-provider";
import { AuthSyncProvider } from "@/components/auth/auth-sync-provider"; // 🛰️ NEW: Auth Sync Ingress
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
       
        <TelegramProvider>
          <LayoutProvider>
            {/* 🛰️ AUTH SYNC: Listens for the "Identity Anchored" pulse from Tab B */}
            <AuthSyncProvider>
              <AppClientProvider>
                <main className="flex-1 flex flex-col w-full relative z-10">
                  {children}
                </main>

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
      </body>
    </html>
  );
}
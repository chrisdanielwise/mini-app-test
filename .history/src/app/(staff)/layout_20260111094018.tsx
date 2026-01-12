import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { LayoutProvider } from '@/context/layout-provider'
import { TelegramProvider } from '@/components/telegram/telegram-provider' 
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

// 🔐 IDENTITY IMPORTS
import { requireMerchantSession } from "@/lib/auth/merchant-session"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardTopNav } from "@/components/dashboard/top-nav"
import DashboardLayoutClient from "./dashboard/layout-client" // Ensure correct path
import { redirect } from "next/navigation"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans", display: 'swap' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Zipha Terminal | Merchant Command', template: '%s | Zipha' },
  description: 'High-resiliency infrastructure for Telegram subscription management.',
  metadataBase: new URL('https://zipha.finance'),
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Zipha' },
}

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false, viewportFit: 'cover', themeColor: '#000000',
}

export default async function StaffRootLayout({ children }: { children: React.ReactNode }) {
  
  // 🛡️ 1. SERVER-SIDE IDENTITY HANDSHAKE
  // This is the "First Wall". If this fails, the UI never renders.
  let session;
  try {
    session = await requireMerchantSession();
  } catch (error) {
    return redirect("/dashboard/login?reason=auth_required");
  }

  // 🛡️ 2. SECURITY PERIMETER
  // Hard-block standard 'user' roles from the (staff) route group.
  if (session.user.role === "user") {
    return redirect("/unauthorized?reason=insufficient_clearance");
  }

  // 🛰️ 3. CONTEXT MAPPING: Standardizing data for Sidebar & TopNav
  const dashboardContext = { 
    merchantId: session.user.merchantId ?? null, 
    role: session.user.role, 
    user: session.user,
    config: session.config || { companyName: "Zipha Terminal", planStatus: "Starter" } 
  };

  return (
    <html lang="en" suppressHydrationWarning className={cn("dark scroll-smooth antialiased", "selection:bg-primary/20")}>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={cn(
        geistSans.variable, geistMono.variable,
        "font-sans bg-background text-foreground min-h-[100dvh] w-full overflow-hidden flex flex-col relative overscroll-none tabular-nums"
      )} suppressHydrationWarning>
        
        <TelegramProvider>
          <LayoutProvider>
            
            {/* ✅ UNIFIED DASHBOARD CHASSIS */}
            <div className="flex h-screen w-screen overflow-hidden bg-background">
              
              {/* --- LEFT: TACTICAL SIDEBAR --- */}
              <DashboardSidebar context={dashboardContext} />

              {/* --- RIGHT: OPERATIONAL VIEWPORT --- */}
              <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                
                {/* TOPNAV: Identity Node & Search */}
                <DashboardTopNav context={dashboardContext} />

                {/* MAIN CONTENT AREA: Handed over to Client Engine */}
                <DashboardLayoutClient userRole={session.user.role}>
                  {children}
                </DashboardLayoutClient>
              </div>
            </div>

            {/* 📢 SYSTEM BROADCAST NODE */}
            <Toaster position="top-center" expand={false} richColors theme="dark" closeButton />
            
          </LayoutProvider>
        </TelegramProvider>
        
        <Analytics />
      </body>
    </html>
  );
}
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { getMerchantSession } from "@/lib/auth/merchant-auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading" // Ensure you have a loading.tsx in the same folder

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Merchant Dashboard | Zipha",
  description: "Manage your Telegram subscription business",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Session Validation
  // The session object contains telegramId (string) and userId (UUID) 
  // already formatted by our Service layer
  const session = await getMerchantSession()

  // 2. Auth Guard
  if (!session) {
    redirect("/dashboard/login")
  }

  // 3. UI Structure
  // We use a flexbox height-screen layout to prevent body scrolling 
  // while keeping the main content area scrollable.
  return (
    <div className={`${inter.className} flex h-screen w-full bg-background text-foreground antialiased`}>
      {/* Sidebar: Receives the merchant profile. 
          BigInt IDs inside the merchant object are strings here. 
      */}
      <DashboardSidebar merchant={session.merchant} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header: Displays User profile and Merchant brand */}
        <DashboardHeader user={session.user} merchant={session.merchant} />

        {/* Main Content: Wrapped in Suspense to handle 
            Server Component data fetching in child pages.
        */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8">
          <Suspense fallback={<Loading />}>
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  )
}
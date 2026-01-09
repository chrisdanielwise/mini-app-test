import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { getMerchantSession } from "@/lib/auth/merchant-auth"
import { redirect } from "next/navigation"

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
  const session = await getMerchantSession()

  if (!session) {
    redirect("/dashboard/login")
  }

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <div className="flex h-screen">
          <DashboardSidebar merchant={session.merchant} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardHeader user={session.user} merchant={session.merchant} />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}

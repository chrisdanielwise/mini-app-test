import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation"; // Added for redirection
import "@/app/globals.css";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { getMerchantSession } from "@/lib/auth/merchant-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Merchant Dashboard | Zipha",
  description: "Manage your Telegram subscription business",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Session Retrieval
  const session = await getMerchantSession();

  /**
   * 2. Auth Guard [FIXED]
   * If there is no session, redirect to the login page immediately.
   * This prevents "Access Denied" or 404 loops in nested routes.
   */
  if (!session) {
    redirect("/dashboard/login");
  }

  return (
    <div
      className={`${inter.className} flex h-screen w-full bg-background text-foreground antialiased`}
    >
      {/* Sidebar: Now guaranteed to have a merchant object */}
      <DashboardSidebar merchant={session.merchant} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header: Now guaranteed to have user/merchant data */}
        <DashboardHeader user={session.user} merchant={session.merchant} />

        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
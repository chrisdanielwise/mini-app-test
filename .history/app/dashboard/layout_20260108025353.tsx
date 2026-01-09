import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
  /**
   * 1. Session Retrieval
   * We fetch the session here to pass profile data to UI components.
   * Authentication redirects are handled in middleware.ts to prevent 307 loops.
   */
  const session = await getMerchantSession();

  /**
   * 2. UI Structure
   * We use a flexbox h-screen layout to keep the sidebar fixed
   * while the main content area remains scrollable.
   */
  return (
    <div
      className={`${inter.className} flex h-screen w-full bg-background text-foreground antialiased`}
    >
      {/* Sidebar: Handles Merchant profile display and navigation */}
      {session && <DashboardSidebar merchant={session.merchant} />}

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header: Displays User identity and Merchant branding */}
        {session && (
          <DashboardHeader user={session.user} merchant={session.merchant} />
        )}

        {/* Main Content Area: 
            The bg-muted/20 provides a subtle contrast for the dashboard cards.
        */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

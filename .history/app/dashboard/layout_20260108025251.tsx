import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { getMerchantSession } from "@/lib/auth/merchant-auth";
import { redirect } from "next/navigation";

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

  return (
    <div
      className={`${inter.className} flex h-screen w-full bg-background text-foreground antialiased`}
    >
      {/* Sidebar: Merchant BigInt IDs are handled as strings here */}
      <DashboardSidebar merchant={session.merchant} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header: Displays User profile and Merchant brand */}
        <DashboardHeader user={session.user} merchant={session.merchant} />

        {/* Main Content: Next.js automatically wraps children 
            in the loading.tsx boundary found in this folder.
        */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

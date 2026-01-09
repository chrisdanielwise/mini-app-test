import type React from "react";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { getMerchantSession } from "@/lib/auth/merchant-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Session Retrieval - Prisma call
  const session = await getMerchantSession();

  /**
   * 2. Critical Safety Check
   * If Middleware passed but session is null, it means the cookie is valid
   * but the Database (Neon) is likely unreachable or the user was deleted.
   */
  if (!session) {
    console.error("Layout: Cookie exists but Database session failed.");
    redirect("/dashboard/login");
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground antialiased">
      <DashboardSidebar merchant={session.merchant} />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <DashboardHeader user={session.user} merchant={session.merchant} />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

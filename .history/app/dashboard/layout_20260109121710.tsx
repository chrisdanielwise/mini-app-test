import { Metadata } from "next";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";

export const metadata: Metadata = {
  title: "Zipha | Command Center",
  description: "Merchant Operation Node",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔐 Fetch the real session on the server side
  const session = await requireMerchantSession();

  return (
    <DashboardLayoutClient merchant={session.merchant}>
      {children}
    </DashboardLayoutClient>
  );
}
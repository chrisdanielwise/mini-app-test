import { Metadata } from "next";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";

// ✅ Metadata is safe here because this is a Server Component
export const metadata: Metadata = {
  title: "Zipha | Command Center",
  description: "Merchant Operation Node",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔐 1. Verify Identity on the Server
  const session = await requireMerchantSession();

  // 🏁 2. Pass data to the Client Wrapper
  return (
    <DashboardLayoutClient merchant={session.merchant}>
      {children}
    </DashboardLayoutClient>
  );
}

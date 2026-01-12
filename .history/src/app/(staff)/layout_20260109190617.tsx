import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client"

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  // 🔐 1. Identity Handshake (Server-Side)
  // If no session exists, middleware or this function will redirect to /login
  const session = await requireMerchantSession();

  // 🏁 2. Load the Immersive Staff Interface
  return (
    <DashboardLayoutClient merchant={session.merchant}>
      {children}
    </DashboardLayoutClient>
  );
}
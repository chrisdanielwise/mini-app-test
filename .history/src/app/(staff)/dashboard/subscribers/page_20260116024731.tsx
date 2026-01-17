import { requireAuth, sanitizeData } from "@/lib/auth/session";
import prisma from "@/lib/db";
import SubscribersClientPage from "./subscriber-client";

/**
 * 🏛️ SUBSCRIBER LEDGER CLUSTER (Server)
 * Strategy: High-speed indexing with universal RBAC filtering.
 */
export default async function SubscribersPage() {
  // 🔐 1. Identity & Role Handshake
  const session = await requireAuth();
  const realMerchantId = session.merchantId;
  const isSuperAdmin = session.isStaff;

  // 🛡️ 2. Dynamic Protocol Filter
  const whereClause = realMerchantId ? { merchantId: realMerchantId } : {};

  // 🏁 3. Data Fetch (Parallelized Cluster Sync)
  const rawSubscriptions = await prisma.subscription.findMany({
    where: whereClause,
    include: {
      user: true,
      service: {
        include: { merchant: true } 
      },
      serviceTier: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 🧼 4. Serialization Cleanup (BigInt Safe)
  const subscriptions = sanitizeData(rawSubscriptions);

  return (
    <SubscribersClientPage 
      initialSubscriptions={subscriptions}
      isSuperAdmin={isSuperAdmin}
      role={session.user.role}
    />
  );
}
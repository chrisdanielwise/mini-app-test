import { requireAuth, sanitizeData } from "@/lib/auth/session";
import prisma from "@/lib/db";
import PaymentsClientPage from "./PaymentsClientPage";

/**
 * 🏛️ CAPITAL INGRESS LEDGER (Server)
 * Strategy: High-speed indexing with universal RBAC filtering.
 */
export default async function PaymentsPage() {
  // 🔐 1. Identity & Role Handshake
  const session = await requireAuth();
  const realMerchantId = session.merchantId;
  const isSuperAdmin = session.isStaff;

  // 🛡️ 2. Dynamic Protocol Filter
  const whereClause = realMerchantId ? { merchantId: realMerchantId } : {};

  // 🏁 3. Data Fetch (Prisma Cluster Sync)
  const rawTransactions = await prisma.payment.findMany({
    where: whereClause,
    include: {
      user: { select: { fullName: true, username: true } },
      service: {
        select: { 
          name: true,
          merchant: { select: { companyName: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 🧼 4. Serialization Cleanup (BigInt & Decimal Safe)
  const transactions = sanitizeData(rawTransactions);

  return (
    <PaymentsClientPage 
      initialTransactions={transactions}
      isSuperAdmin={isSuperAdmin}
      role={session.user.role}
    />
  );
}
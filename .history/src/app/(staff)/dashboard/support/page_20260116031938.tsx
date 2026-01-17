import { requireAuth, sanitizeData } from "@/lib/auth/session";
import prisma from "@/lib/db";
import SupportClientPage from "./support-client";

/**
 * 🛰️ CENTRALIZED SUPPORT LEDGER (Server)
 * Strategy: Dynamic Cluster Ingress with BigInt Serialization.
 */
export default async function SupportPage() {
  // 🔐 1. Identity Handshake
  const session = await requireAuth();
  
  // 🛡️ ROLE PROTOCOL
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isSuperAdmin = role === "super_admin";
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 2. DATA INGRESS: Dynamic Protocol Filter
  // If Staff, we fetch all. If Merchant, we strictly filter by their cluster ID.
  const whereClause = isPlatformStaff ? {} : { merchantId: realMerchantId };

  const rawTickets = await prisma.ticket.findMany({
    where: whereClause,
    include: { 
      user: { 
        select: { username: true, fullName: true, id: true } 
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 🧼 3. Serialization Cleanup (Crucial for BigInt and DateTime Handover)
  const tickets = sanitizeData(rawTickets);

  return (
    <SupportClientPage 
      initialTickets={tickets}
      isPlatformStaff={isPlatformStaff}
      isSuperAdmin={isSuperAdmin}
      role={role}
      realMerchantId={realMerchantId}
    />
  );
}
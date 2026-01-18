import { requireAuth, sanitizeData } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import SubscriberClientView from "./subscriber-client";

/**
 * 🛰️ SUBSCRIBER_AUDIT_ENGINE (Server)
 * Path: /dashboard/subscribers/[id]/page.tsx
 */
export default async function SubscriberAuditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const { id } = await props.params;
  
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isSuperAdmin = ["super_admin", "platform_manager", "amber"].includes(role);

  // 🏁 1. Fetch the specific Subscription Ledger
  const rawSubscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, fullName: true } },
      service: { select: { name: true } },
      serviceTier: { select: { name: true, interval: true } },
      payments: {
        orderBy: { createdAt: 'desc' }
      }
    },
  });

  // 🛡️ SECURITY: If not admin, ensure this subscriber belongs to the merchant
  if (!rawSubscription) return notFound();
  
  // Logic check: If merchant, verify service ownership
  const serviceOwner = await prisma.service.findFirst({
      where: { 
          id: rawSubscription.serviceId,
          merchantId: realMerchantId 
      }
  });
  
  if (!isSuperAdmin && !serviceOwner) return notFound();

  const subscription = sanitizeData(rawSubscription);

  return (
    <SubscriberClientView 
      subscription={subscription}
      isSuperAdmin={isSuperAdmin}
      id={id}
    />
  );
}
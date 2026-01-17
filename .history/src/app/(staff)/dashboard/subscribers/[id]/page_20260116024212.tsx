import { requireAuth, sanitizeData } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import SubscriberClientView from "./subscriber-client";
// import SubscriberClientView from "./SubscriberClientView";

/**
 * 🛰️ SUBSCRIBER IDENTITY NODE (Server)
 * Strategy: Sanitize database primitives and authorize ingress.
 */
export default async function SubscriberDeepView(props: {
  params: Promise<{ id: string }>;
}) {
  // 🔐 1. Identity Handshake
  const session = await requireAuth();
  const { id } = await props.params;
  const isSuperAdmin = session.isStaff;
  const realMerchantId = session.merchantId;

  // 🏁 2. Data Fetch
  const rawSubscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      user: true,
      service: true,
      serviceTier: true,
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  // 🛡️ 3. Access Protocol Check
  // Merchant restricted to their own cluster; Staff has global ingress.
  if (!rawSubscription) return notFound();
  
  const isOwner = rawSubscription.service.merchantId === realMerchantId;
  if (!isSuperAdmin && !isOwner) {
    redirect("/dashboard/subscribers?error=access_denied");
  }

  // 🧼 4. Serialization Cleanup
  const subscription = sanitizeData(rawSubscription);

  return (
    <SubscriberClientView 
      subscription={subscription}
      isSuperAdmin={isSuperAdmin}
      id={id}
    />
  );
}
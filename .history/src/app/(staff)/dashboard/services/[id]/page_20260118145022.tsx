import { requireAuth, sanitizeData } from "@/lib/auth/session";
import prisma from "@/lib/db";
import ServicesClientPage from "./services-client"; // 🛰️ Hand-off

export default async function ServicesPage() {
  const session = await requireAuth();
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  const rawServices = await prisma.service.findMany({
    where: realMerchantId ? { merchantId: realMerchantId } : {},
    include: {
      merchant: { select: { companyName: true } },
      _count: { select: { subscriptions: true } },
      tiers: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const services = sanitizeData(rawServices);

  return (
    <ServicesClientPage 
      initialServices={services} 
      isPlatformStaff={isPlatformStaff}
      role={role}
      realMerchantId={realMerchantId}
      companyName={session.config?.companyName}
    />
  );
}
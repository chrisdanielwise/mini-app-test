import { requireAuth, sanitizeData } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
// import ServiceConfigClient from "./ServiceConfigClient";

/**
 * 🛰️ SERVICE CONFIGURATION ENGINE (Server)
 * Strategy: High-speed Prisma ingress with RBAC Security Bypass.
 */
export default async function ServiceConfigPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const { id } = await props.params;
  
  // 🛡️ IDENTITY PROTOCOLS
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 1. Fetch Service Protocol
  const rawService = await prisma.service.findUnique({
    where: {
      id,
      // If Staff, bypass ownership check. If Merchant, enforce it.
      ...(realMerchantId ? { merchantId: realMerchantId } : {}),
    },
    include: {
      merchant: { select: { companyName: true } },
      tiers: {
        orderBy: { price: "asc" },
      },
    },
  });

  if (!rawService) return notFound();

  // 🧼 2. Serialization Cleanup (BigInt & Decimal Safe)
  const service = sanitizeData(rawService);

  return (
    <ServiceConfigClient 
      service={service}
      isPlatformStaff={isPlatformStaff}
    />
  );
}
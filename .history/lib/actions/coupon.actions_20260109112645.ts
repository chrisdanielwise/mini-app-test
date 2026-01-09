"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCouponAction(prevState: any, formData: FormData) {
  const merchantId = formData.get("merchantId") as string;
  const serviceId = formData.get("serviceId") as string;
  const code = (formData.get("code") as string).toUpperCase();
  const discountPercent = parseInt(formData.get("discountPercent") as string);
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null;

  try {
    // 🛡️ Ensure code is unique for this merchant
    const existing = await prisma.coupon.findFirst({
      where: { code, merchantId }
    });

    if (existing) return { error: "This coupon code already exists." };

    await prisma.coupon.create({
      data: {
        merchantId,
        serviceId: serviceId === "global" ? null : serviceId,
        code,
        discountPercent,
        maxUses,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error) {
    console.error("❌ Coupon Creation Failed:", error);
    return { error: "Failed to create campaign." };
  }
}
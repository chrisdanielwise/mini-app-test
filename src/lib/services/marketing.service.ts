"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { DiscountType, CouponScope } from "@/generated/prisma";
// import { Decimal } from "@prisma/client/runtime/library";

export const MarketingService = {
  /**
   * 🏷️ VALIDATE_COUPON
   * Logic: Checks if a code exists, is active, hasn't expired, and meets scope rules.
   */
  async validateCoupon(params: {
    code: string;
    merchantId: string;
    userId: string;
    serviceId?: string;
  }) {
    const coupon = await prisma.coupon.findUnique({
      where: { merchantId_code: { merchantId: params.merchantId, code: params.code.toUpperCase() } },
    });

    if (!coupon || !coupon.isActive) throw new Error("COUPON_ERROR: INVALID_CODE");

    // 1. Temporal Guard
    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) throw new Error("COUPON_ERROR: NOT_STARTED");
    if (coupon.expiresAt && now > coupon.expiresAt) throw new Error("COUPON_ERROR: EXPIRED");

    // 2. Usage Guard
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      throw new Error("COUPON_ERROR: MAX_USAGE_REACHED");
    }

    // 3. Scope Guard
    if (coupon.scope === CouponScope.SPECIFIC_SERVICE && coupon.serviceId !== params.serviceId) {
      throw new Error("COUPON_ERROR: SCOPE_MISMATCH");
    }

    return coupon;
  },

  /**
   * ⛓️ AFFILIATE_ATTRIBUTION
   * Logic: Links a payment to an affiliate for commission tracking.
   */
  async recordAffiliateConversion(params: {
    affiliateCode: string;
    paymentId: string;
    referredUserId: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      const link = await tx.affiliateLink.findUnique({
        where: { code: params.affiliateCode },
      });

      if (!link || !link.isActive) return null;

      // 🏁 1. Create Conversion Entry
      const conversion = await tx.affiliateConversion.create({
        data: {
          affiliateLinkId: link.id,
          referredUserId: params.referredUserId,
          paymentId: params.paymentId,
          status: "PENDING",
        },
      });

      // 📈 2. Update Link Telemetry
      await tx.affiliateLink.update({
        where: { id: link.id },
        data: { conversions: { increment: 1 } },
      });

      revalidateTag("marketing_node", CACHE_PROFILES.DATA);
      return conversion;
    });
  },

  /**
   * 🎫 REDEEM_COUPON
   * Logic: Increments usage count and creates a redemption audit node.
   */
  async redeemCoupon(couponId: string, userId: string, subscriptionId?: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.coupon.update({
        where: { id: couponId },
        data: { currentUses: { increment: 1 } },
      });

      return await tx.couponRedemption.create({
        data: {
          userId,
          couponId,
          subscriptionId,
        },
      });
    });
  },
};
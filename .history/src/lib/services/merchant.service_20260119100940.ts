

/**
 * 🕵️ 8. GET_IDENTITY_BY_TELEGRAM
 */
export const getByAdminTelegramId = cache(async (telegramId: bigint) => {
  const merchant = await prisma.merchantProfile.findUnique({
    where: { adminUserId: telegramId },
    include: {
      adminUser: { select: { fullName: true, username: true } },
      plan: true,
      analytics: true,
    },
  });
  return sanitize(merchant);
});

/**
 * 🎫 9. CREATE_COUPON
 */
export async function createCoupon(merchantId: string, data: CreateCouponInput) {
  const coupon = await prisma.coupon.create({
    data: { ...data, merchantId }
  });
  revalidateTag(`coupons-${merchantId}`);
  return sanitize(coupon);
}

/**
 * ❓ 10. GET_MERCHANT_FAQS
 */
export const getMerchantFAQs = cache(async (merchantId: string) => {
  const faqs = await prisma.faqItem.findMany({
    where: { merchantId, isActive: true },
    orderBy: { orderIndex: 'asc' }
  });
  return sanitize(faqs);
});
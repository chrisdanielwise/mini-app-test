

/**
 * 🔄 UPDATE_MERCHANT_IDENTITY
 * Hardened: Atomic update with sanitized return payload.
 */
export async function updateMerchant(merchantId: string, data: any) {
  if (!isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data,
  });

  return sanitize(updated);
}

/**
 * 🕵️ GET_IDENTITY_BY_TELEGRAM
 */
export const getByAdminTelegramId = cache(async (telegramId: bigint) => {
  const merchant = await prisma.merchantProfile.findUnique({
    where: { adminUserId: telegramId },
    include: {
      adminUser: { select: { fullName: true, username: true } },
      plan: true,
    },
  });

  return sanitize(merchant);
});
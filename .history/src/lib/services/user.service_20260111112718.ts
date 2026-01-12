import prisma from "@/lib/db";
import type { TelegramUser } from "@/lib/auth/telegram";
import type { LanguageCode } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

// =================================================================
// 🚀 INTERFACES
// =================================================================

export interface CreateUserInput {
  telegramId: bigint;
  fullName?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  language?: LanguageCode;
}

export interface UpdateUserInput {
  fullName?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  displayName?: string;
  language?: LanguageCode;
}

// =================================================================
// 🛠️ INTERNAL HELPERS
// =================================================================

/**
 * 🛰️ HYDRATION TRANSLATOR
 * Essential for Next.js 15+ to handle BigInts safely.
 */
function sanitizeUser(user: any) {
  if (!user) return null;
  return JSON.parse(
    JSON.stringify(user, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

/**
 * 🚀 DB RESILIENCE HELPER
 * Hardened for Neon Serverless. Incremental backoff for cold starts.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxAttempts = 5
): Promise<T> {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      return await fn();
    } catch (error: any) {
      attempts++;
      
      const isRetryable =
        error.message.includes("timeout") ||
        error.message.includes("terminated") ||
        error.code === 'P1001' || 
        error.code === 'P2024' || 
        error.code === 'P2028';   

      if (isRetryable && attempts < maxAttempts) {
        const waitTime = attempts * 2000;
        console.warn(
          `[Database_Sync] ${label}: Connectivity issue (Code: ${error.code || 'TIMEOUT'}). Attempt ${attempts}/${maxAttempts}. Retrying in ${waitTime/1000}s...`
        );
        await new Promise((res) => setTimeout(res, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Critical: Database node unreachable for ${label} after ${maxAttempts} attempts.`);
}

// =================================================================
// 🛡️ USER COMMANDS (Hardened Named Exports)
// =================================================================

/**
 * 🛰️ IDENTITY HANDSHAKE: findOrCreateFromTelegram
 */
export async function findOrCreateFromTelegram(telegramUser: TelegramUser) {
  const telegramId = BigInt(telegramUser.id);

  return withRetry(async () => {
    let user = await prisma.user.findUnique({
      where: { telegramId },
      include: {
        merchantProfile: { select: { id: true, companyName: true, planStatus: true } },
        platformSubscription: true,
      },
    });

    if (user) {
      const updates: UpdateUserInput = {};
      if (telegramUser.first_name && telegramUser.first_name !== user.firstName) {
        updates.firstName = telegramUser.first_name;
      }
      if (telegramUser.last_name !== user.lastName) {
        updates.lastName = telegramUser.last_name;
      }
      if (telegramUser.username !== user.username) {
        updates.username = telegramUser.username;
      }

      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates,
          include: {
            merchantProfile: { select: { id: true, companyName: true, planStatus: true } },
            platformSubscription: true,
          },
        });
      }
      return sanitizeUser(user);
    }

    const fullName = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(" ");
    const languageMap: Record<string, LanguageCode> = { en: "EN", ru: "RU", fr: "FR", es: "ES" };

    const newUser = await prisma.user.create({
      data: {
        telegramId,
        fullName: fullName || undefined,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        language: languageMap[telegramUser.language_code || "en"] || "EN",
        role: "USER",
      },
      include: {
        merchantProfile: { select: { id: true, companyName: true, planStatus: true } },
        platformSubscription: true,
      },
    });

    return sanitizeUser(newUser);
  }, "findOrCreateFromTelegram");
}

/**
 * 🔍 FETCH USER BY ID (Staff Aware)
 */
export async function getUserById(userId: string) {
  if (!isUUID(userId)) return null;

  return withRetry(async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        merchantProfile: true,
        platformSubscription: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          include: { service: true, serviceTier: true },
        },
      },
    });

    return sanitizeUser(user);
  }, "getUserById");
}

/**
 * 🛰️ GET ACTIVE SUBSCRIPTIONS
 */
export async function getUserSubscriptions(userId: string) {
  if (!isUUID(userId)) return [];

  return withRetry(async () => {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
      include: {
        service: true,
        serviceTier: true,
        merchant: { select: { id: true, companyName: true, botUsername: true } },
      },
      orderBy: { expiresAt: "asc" },
    });

    return sanitizeUser(subscriptions);
  }, "getUserSubscriptions");
}

/**
 * 🏦 GET PAYMENT HISTORY
 */
export async function getUserPayments(userId: string, limit = 20) {
  if (!isUUID(userId)) return [];

  return withRetry(async () => {
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        service: { select: { name: true } },
        merchant: { select: { companyName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return sanitizeUser(payments);
  }, "getUserPayments");
}

/**
 * 🔄 UPDATE USER PROFILE
 */
export async function updateUser(userId: string, data: UpdateUserInput) {
  if (!isUUID(userId)) throw new Error("Invalid User ID format");

  return withRetry(async () => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });
    return sanitizeUser(updatedUser);
  }, "updateUser");
}

/**
 * 🔍 FETCH BY TELEGRAM ID
 */
export async function getUserByTelegramId(telegramId: bigint) {
  return withRetry(async () => {
    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: { merchantProfile: true, platformSubscription: true },
    });
    return sanitizeUser(user);
  }, "getUserByTelegramId");
}

/**
 * 📦 GET USER ORDERS
 */
export async function getUserOrders(userId: string, limit = 20) {
  if (!isUUID(userId)) return [];
  return withRetry(async () => {
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        items: { include: { product: { select: { name: true, imageUrl: true } } } },
        merchant: { select: { companyName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return sanitizeUser(orders);
  }, "getUserOrders");
}
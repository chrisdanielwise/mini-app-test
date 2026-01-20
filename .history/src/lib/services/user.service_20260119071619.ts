"use server";

import prisma from "@/lib/db";
import type { TelegramUser } from "@/lib/auth/telegram";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Logic: Recursively handles BigInt and Decimal for JSON transport.
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

/**
 * 🛡️ RESILIENCE_NODE
 * Logic: Exponential backoff for serverless cold-starts.
 */
async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  let attempts = 0;
  while (attempts < 5) {
    try {
      return await fn();
    } catch (error: any) {
      attempts++;
      const isRetryable = error.code === 'P1001' || error.message.includes("timeout");
      if (!isRetryable || attempts >= 5) throw error;
      await new Promise(res => setTimeout(res, attempts * 2000));
    }
  }
  throw new Error(`CRITICAL: Database_Node_Isolation for ${label}`);
}

// =================================================================
// 🛡️ IDENTITY PROTOCOLS (Hardened v16.16.20)
// =================================================================

/**
 * 🛰️ FIND_OR_CREATE_FROM_TELEGRAM
 * Fix: Standardized Enum casing (lowercase) and fixed revalidateTag signature.
 */
export async function findOrCreateFromTelegram(telegramUser: TelegramUser) {
  const telegramId = BigInt(telegramUser.id);

  return withRetry(async () => {
    const fullName = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(" ");
    
    // ✅ FIX: "EN" -> "en" (Prisma enums are case-sensitive)
    const languageMap: Record<string, any> = { en: "en", ru: "ru", fr: "fr", es: "es" };
    const lang = languageMap[telegramUser.language_code || "en"] || "en";

    const user = await prisma.user.upsert({
      where: { telegramId },
      update: {
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        fullName: fullName || undefined,
      },
      create: {
        telegramId,
        fullName: fullName || undefined,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        language: lang,
        role: "user", // ✅ FIX: "USER" -> "user"
      },
      include: {
        merchantProfile: { select: { id: true, companyName: true, planStatus: true } },
      }
    });

    // ✅ FIX: revalidateTag only takes ONE argument in most Next.js versions
    revalidateTag("auth");

    return sanitize(user);
  }, "findOrCreateFromTelegram");
}

/**
 * 🔍 GET_USER_BY_ID
 */
export const getUserById = cache(async (userId: string) => {
  if (!isUUID(userId)) return null;

  return withRetry(async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        merchantProfile: { select: { id: true, companyName: true } },
        subscriptions: {
          where: { status: "active" }, // ✅ FIX: "ACTIVE" -> "active"
          select: { id: true, expiresAt: true, service: { select: { name: true } } }
        },
      },
    });

    return sanitize(user);
  }, "getUserById");
});

/**
 * 🏦 GET_USER_LEDGER
 */
export const getUserPayments = cache(async (userId: string, limit = 20) => {
  if (!isUUID(userId)) return [];

  return withRetry(async () => {
    const payments = await prisma.payment.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        service: { select: { name: true } },
        merchant: { select: { companyName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return sanitize(payments);
  }, "getUserPayments");
});

/**
 * 🔄 UPDATE_USER_PROFILE
 */
export async function updateUser(userId: string, data: any) {
  if (!isUUID(userId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

  return withRetry(async () => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    revalidateTag("auth");

    return sanitize(updatedUser);
  }, "updateUser");
}

/**
 * 🛰️ Master Identity Resolver
 */
export async function getUserByTelegramId(telegramId: string | number | bigint) {
  return await prisma.user.findUnique({
    where: { 
      telegramId: BigInt(telegramId) 
    },
    select: {
      id: true,
      telegramId: true,
      username: true,
      role: true,
      securityStamp: true,
    }
  });
}

/**
 * 🛰️ GET_USER_SUBSCRIPTIONS (v16.16.20)
 * Fix: "ACTIVE" -> "active" to satisfy TS2367 comparison errors.
 */
export async function getUserSubscriptions(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: { 
      userId,
      status: "active" // ✅ FIX: Standardized casing
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          description: true,
          currency: true
        }
      },
      serviceTier: {
        select: {
          id: true,
          name: true,
          price: true,
          interval: true
        }
      },
      merchant: {
        select: {
          id: true,
          companyName: true,
          botUsername: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return sanitize(subscriptions);
}
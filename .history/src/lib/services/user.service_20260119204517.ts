"use server";

import prisma from "@/lib/db";
import type { TelegramUser } from "@/lib/auth/telegram";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Prisma Types and Enums
import { 
  UserRole, 
  SubscriptionStatus, 
  Prisma, 
  User,
  LanguageCode // Assuming your schema defines this for en, ru, etc.
} from "@/generated/prisma";
// ✅ CORRECTED DECIMAL PATH: Ensuring consistency across all services
import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Architecture: Hydration safety for Next.js 15+ & Turbopack.
 * Logic: Recursively handles BigInt (Telegram IDs) and Decimals for JSON transport.
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (value?.constructor?.name === 'Decimal') return value.toString();
      return value;
    })
  );
}

/**
 * 🛡️ RESILIENCE_NODE
 * Logic: Exponential backoff for serverless cold-starts (P1001/P2024).
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
// 🛡️ IDENTITY PROTOCOLS (Hardened v2026.1.20)
// =================================================================

/**
 * 🛰️ FIND_OR_CREATE_FROM_TELEGRAM
 * Logic: Synchronizes Telegram binary data with the User node.
 */
export async function findOrCreateFromTelegram(telegramUser: TelegramUser): Promise<User> {
  const telegramId = BigInt(telegramUser.id);

  return withRetry(async () => {
    const fullName = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(" ");
    
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
        // ✅ FIX: Use Enum if defined, or cast to match your schema string constraints
        role: UserRole.USER, 
      },
      include: {
        merchantProfile: { select: { id: true, companyName: true, planStatus: true } },
      }
    });

    // ✅ FIX: Provided mandatory second argument "default" for Next.js 15
    revalidateTag("auth", "default");

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
          // ✅ FIX: Use SubscriptionStatus.ACTIVE enum (maps to "active" in DB)
          where: { status: SubscriptionStatus.ACTIVE },
          select: { id: true, expiresAt: true, service: { select: { name: true } } }
        },
      },
    });

    return sanitize(user);
  }, "getUserById");
});

/**
 * 🔄 UPDATE_USER_PROFILE
 */
export async function updateUser(userId: string, data: Partial<User>) {
  if (!isUUID(userId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

  return withRetry(async () => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    revalidateTag("auth", "default");

    return sanitize(updatedUser);
  }, "updateUser");
}

/**
 * 🛰️ GET_USER_SUBSCRIPTIONS (v2026.1.20)
 * Logic: Fetches all active service nodes for the user dashboard.
 */
export async function getUserSubscriptions(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: { 
      userId,
      // ✅ FIX: Standardized to use Prisma Enum
      status: SubscriptionStatus.ACTIVE 
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          description: true,
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

// Update user.service.ts:
export async function getUserPayments(userId: string) {
  return await prisma.payment.findMany({ where: { userId } });
}
/**
 * 🕵️ SERVICE: GET_USER_BY_TELEGRAM_ID
 * Logic: Direct node resolution via 64-bit Telegram ID.
 */
export async function getUserByTelegramId(telegramId: bigint) {
  return await prisma.user.findUnique({
    where: { telegramId },
    select: {
      id: true,
      role: true,
      firstName: true,
      username: true,
      deletedAt: true,
    }
  });
}
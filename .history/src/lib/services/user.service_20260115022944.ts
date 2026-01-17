"use server";

import prisma from "@/lib/db";
import type { TelegramUser } from "@/lib/auth/telegram";
import type { LanguageCode } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Architecture: Hydration safety for Next.js 15+ & Turbopack.
 * Logic: Recursively handles BigInt (Telegram IDs) for JSON transport.
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
// 🛡️ IDENTITY PROTOCOLS (Hardened v16.16.12)
// =================================================================

/**
 * 🛰️ FIND_OR_CREATE_FROM_TELEGRAM
 * Logic: Upserts user identity based on incoming TMA handshake data.
 * Action: Synchronizes Display Name and Language preferences.
 */
export async function findOrCreateFromTelegram(telegramUser: TelegramUser) {
  const telegramId = BigInt(telegramUser.id);

  return withRetry(async () => {
    // Attempt Atomic Upsert to minimize DB round-trips
    const fullName = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(" ");
    const languageMap: Record<string, LanguageCode> = { en: "EN", ru: "RU", fr: "FR", es: "ES" };
    const lang = languageMap[telegramUser.language_code || "en"] || "EN";

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
        role: "USER",
      },
      include: {
        merchantProfile: { select: { id: true, companyName: true, planStatus: true } },
      }
    });

    return sanitize(user);
  }, "findOrCreateFromTelegram");
}

/**
 * 🔍 GET_USER_BY_ID
 * Performance: Memoized via React Cache for layout-level hydration.
 */
export const getUserById = cache(async (userId: string) => {
  if (!isUUID(userId)) return null;

  return withRetry(async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        merchantProfile: { select: { id: true, companyName: true } },
        subscriptions: {
          where: { status: "ACTIVE" },
          select: { id: true, expiresAt: true, service: { select: { name: true } } }
        },
      },
    });

    return sanitize(user);
  }, "getUserById");
});

/**
 * 🏦 GET_USER_LEDGER
 * Logic: Fetches payment history with service context.
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
 * Logic: Atomic update with sanitized response.
 */
export async function updateUser(userId: string, data: any) {
  if (!isUUID(userId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

  return withRetry(async () => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });
    return sanitize(updatedUser);
  }, "updateUser");
}

/**
 * 🛰️ Master Identity Resolver replacement
 * Logic: Query user directly using Prisma findUnique
 */
export async function getUserByTelegramId(telegramId: string | number | bigint) {
  return await prisma.user.findUnique({
    where: { 
      // Ensure BigInt conversion for the query
      telegramId: BigInt(telegramId) 
    },
    // Optional: Use select to keep the fetch 'thin'
    select: {
      id: true,
      telegramId: true,
      username: true,
      role: true,
      securityStamp: true,
    }
  });
}
import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

// Use the same secret as your middleware
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "zipha_secure_secret_2026");

/**
 * Validates the JWT and returns the session.
 * Used in Layouts to prevent crashes if the DB is slow.
 */
export async function getMerchantSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. Verify JWT Signature (Stateless/Fast)
    const { payload } = await jose.jwtVerify(token, SECRET);
    const merchantId = payload.merchantId as string;

    // 2. Fetch Merchant from DB
    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      include: { 
        adminUser: true 
      }
    });

    if (!merchant) return null;

    return {
      user: merchant.adminUser,
      merchant: {
        id: merchant.id,
        companyName: merchant.companyName,
        botUsername: merchant.botUsername,
        role: merchant.adminUser.role
      }
    };
  } catch (error) {
    console.error("Auth Error:", error);
    return null;
  }
}

/**
 * Strict guard for individual dashboard pages.
 */
export async function requireMerchantSession() {
  const session = await getMerchantSession();
  if (!session) {
    redirect("/dashboard/login");
  }
  return session;
}
import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "zipha_secure_secret_2026");

export async function getMerchantSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. Verify JWT (Stateless - No DB needed)
    const { payload } = await jose.jwtVerify(token, SECRET);
    const merchantId = payload.merchantId as string;

    /**
     * 2. DB FETCH WITH TIMEOUT
     * If the DB doesn't respond in 3 seconds, we fail the session
     * rather than keeping the user on a blank white screen.
     */
    const merchant = await Promise.race([
      prisma.merchantProfile.findUnique({
        where: { id: merchantId },
        include: { adminUser: true }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB_TIMEOUT")), 3000))
    ]) as any;

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
    console.error("Auth Speed Error:", error);
    return null;
  }
}

export async function requireMerchantSession() {
  const session = await getMerchantSession();
  if (!session) redirect("/dashboard/login");
  return session;
}
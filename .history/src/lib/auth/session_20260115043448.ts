import { cookies, headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import {  verifySession} from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";

/**
 * 🌊 UNIVERSAL_SESSION_RESOLVER (v16.16.12)
 * Logic: Memoized Deep-Trace Telemetry with Security-Stamp Alignment.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const headerList = await headers();

    // 🛡️ SHIELD 0: EXTRACTION
    let token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    // 🚀 TMA FALLBACK: Bearer Ingress
    if (!token) {
      const authHeader = headerList.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    // 🛡️ SHIELD 1: CRYPTOGRAPHIC VERIFICATION
    const payload = await verifySession(token);
    if (!payload || !payload.sub) return null;

    const userId = payload.sub as string;
    const tokenStamp = (payload.user as any)?.securityStamp;

    // 🛡️ SHIELD 2: THIN-FETCH NODE VERIFICATION
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        telegramId: true, 
        firstName: true, 
        role: true,
        deletedAt: true,
        securityStamp: true, 
        merchantProfile: { 
          select: { id: true, companyName: true, botUsername: true, planStatus: true } 
        }
      }
    });

    if (!user || user.deletedAt) return null;

    // 🛡️ SHIELD 3: REVOCATION CHECK (Security Stamp)
    // If the stamp in the DB changed (Global Logout), the token is immediately invalid.
    if (tokenStamp && user.securityStamp && tokenStamp !== user.securityStamp) {
      console.warn(`🚨 [Security_Revocation]: Stamp Mismatch for UID: ${user.id}`);
      return null;
    }

    // 🛡️ SHIELD 4: ROLE CALIBRATION
    const role = user.role.toLowerCase();
    const isStaff = JWT_CONFIG.staffRoles.includes(role);

    return {
      user: {
        id: user.id,
        role,
        firstName: user.firstName,
        telegramId: user.telegramId?.toString() || null,
      },
      isStaff,
      merchantId: user.merchantProfile?.id || null,
      config: {
        companyName: user.merchantProfile?.companyName || (isStaff ? "Zipha HQ" : "Node"),
        botUsername: user.merchantProfile?.botUsername || null,
        planStatus: user.merchantProfile?.planStatus || "FREE",
        isOwner: !!user.merchantProfile,
      }
    };
  } catch (error) {
    return null;
  }
});

/**
 * 🛡️ SERVER_GATEKEEPERS
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login?reason=auth_required");
  return session;
}

export async function requireStaff() {
  const session = await getSession();
  if (!session || !session.isStaff) redirect("/dashboard?error=unauthorized");
  return session;
}
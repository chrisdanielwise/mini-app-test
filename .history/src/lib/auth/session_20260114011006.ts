import { cookies, headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { AuthService } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";

/**
 * 🛰️ UNIVERSAL SESSION RESOLVER (Institutional v14.28.0)
 * Logic: Dual-Ingress Extraction with Deep-Trace Telemetry.
 */
export const getSession = cache(async (): Promise<any | null> => {
  const startTime = Date.now();
  try {
    const cookieStore = await cookies();
    const headerList = await headers();

    // 🛡️ SHIELD 0: EXTRACTION
    let token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    if (!token) {
      const authHeader = headerList.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      // console.log("🔍 [Session_Trace]: No token found in cookies or headers.");
      return null;
    }

    // 🛡️ SHIELD 1: CRYPTOGRAPHIC VERIFICATION
    const payload = await AuthService.verifySession(token);
    
    if (!payload || !payload.sub) {
      console.error("❌ [Session_Trace]: JWT Verification Failed. Payload empty or expired.");
      return null;
    }

    const userId = payload.sub as string;
    const tokenStamp = payload.securityStamp as string | undefined;

    // 🛡️ SHIELD 2: RELATIONAL CROSS-CHECK
    // We fetch the user AND the securityStamp to ensure no mismatch
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        telegramId: true, 
        firstName: true, 
        username: true,
        role: true,
        deletedAt: true,
        securityStamp: true, // 🚨 CRITICAL for validation
        merchantProfile: { 
          select: { id: true, companyName: true, botUsername: true, planStatus: true } 
        },
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    });

    if (!user) {
      console.error(`❌ [Session_Trace]: User Node ${userId} not found in Database.`);
      return null;
    }

    if (user.deletedAt) {
      console.error(`🚫 [Session_Trace]: User Node ${userId} is marked as DELETED.`);
      return null;
    }

    // 🛡️ SHIELD 3: SECURITY STAMP ALIGNMENT (The Loop Killer)
    if (tokenStamp && user.securityStamp && tokenStamp !== user.securityStamp) {
      console.error(`🚨 [Session_Trace]: STAMP MISMATCH. Token=${tokenStamp?.slice(0,8)} | DB=${user.securityStamp?.slice(0,8)}`);
      return null;
    }

    // 🛡️ SHIELD 4: IDENTITY CONVERGENCE
    const normalizedRole = user.role.toLowerCase();
    const isPlatformStaff = JWT_CONFIG.staffRoles.includes(normalizedRole) || !!payload.isStaff;

    const currentMerchantId = 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      (payload.merchantId as string | null);

    const duration = Date.now() - startTime;
    console.log(`✅ [Session_Trace]: Identity Verified (${duration}ms) | User: ${user.id.slice(0,8)} | Role: ${normalizedRole}`);

    return {
      user: {
        id: user.id,
        role: normalizedRole,
        firstName: user.firstName,
        username: user.username,
        telegramId: user.telegramId?.toString() || null,
      },
      isStaff: isPlatformStaff,
      merchantId: currentMerchantId,
      config: {
        companyName: user.merchantProfile?.companyName || (isPlatformStaff ? "Zipha HQ" : "Standard Node"),
        botUsername: user.merchantProfile?.botUsername || null,
        planStatus: user.merchantProfile?.planStatus || "FREE",
        isOwner: !!user.merchantProfile,
        isSetup: !!user.merchantProfile?.botUsername,
      }
    };

  } catch (error: any) {
    console.error("🔥 [Session_Critical] Resolution Failure:", error.message);
    return null;
  }
});

/**
 * 🛡️ THE GATEKEEPERS (Server Component Guards)
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    const headerList = await headers();
    const xPath = headerList.get("x-invoke-path") || "";
    const xUrl = headerList.get("x-url") || "";
    const referer = headerList.get("referer") || "";
    
    // 🛡️ THE CIRCUIT BREAKER
    const isLoginPage = [xPath, xUrl, referer].some(val => val.toLowerCase().includes("login"));
    
    if (isLoginPage) {
      console.log("🟢 [Guard_Bypass]: Already on Login. Redirect suppressed.");
      return null;
    }
    
    return redirect("/dashboard/login?reason=auth_required");
  }
  
  return session;
}

export async function requireStaff() {
  const session = await getSession();
  
  if (!session) {
    // We return null so the Layout's own Loop Breaker handles the login page redirect
    return null; 
  }
  
  if (!session.isStaff) {
    console.warn(`⛔ [Guard_Fail]: Insufficient clearance for User ${session.user.id}`);
    return redirect("/dashboard/login?reason=access_denied");
  }
  
  return session;
}
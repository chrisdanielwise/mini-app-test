import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function getMerchantSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    console.log("🔍 [Auth] No token found in cookies.");
    return null;
  }

  try {
    // 🚀 DEBUG: Let's see what token we are searching for
    console.log(`🔍 [Auth] Attempting DB lookup for token: ${token.slice(0, 10)}...`);

    const session = await prisma.merchantProfile.findFirst({
      where: { 
        lastLoginToken: token,
        // If your DB is slow, the Date check might be sensitive. 
        // Let's ensure tokenExpires is actually in the future.
        tokenExpires: { gt: new Date() } 
      },
      include: { adminUser: true },
    });

    if (!session) {
      console.log("❌ [Auth] Cookie exists but NO MATCHING MERCHANT in DB or Token Expired.");
      return null;
    }

    console.log("✅ [Auth] Session verified for:", session.companyName);
    return {
      user: session.adminUser,
      merchant: { id: session.id, companyName: session.companyName },
    };
  } catch (e) {
    console.error("🚨 [Auth] DATABASE CRASH DURING SESSION CHECK:", e);
    return null;
  }
}

export async function requireMerchantSession() {
  const session = await getMerchantSession();
  if (!session) {
    console.log("🔁 [Auth] Redirecting to login because session is null.");
    redirect("/dashboard/login");
  }
  return session;
}
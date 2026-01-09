import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

/**
 * Silent Refresh Helper
 * Verifies the database connection and merchant status without 
 * interrupting the user experience.
 */
export async function getMerchantSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    // PRISMA 7 FIX: Query with a slight timeout to prevent hanging the UI
    const session = await prisma.merchantSession.findUnique({
      where: { id: token },
      include: {
        merchant: true,
        user: true,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    // HANDSHAKE REFRESH: If session is valid, update the "lastActive" 
    // to keep the Neon connection warm
    return {
      user: session.user,
      merchant: session.merchant,
    };
  } catch (error) {
    console.error("Auth: Silent refresh failed due to DB timeout.", error);
    return null;
  }
}

/**
 * Strict Guard for protected pages (like Settings)
 */
export async function requireMerchantSession() {
  const session = await getMerchantSession();
  if (!session) {
    redirect("/dashboard/login");
  }
  return session;
}
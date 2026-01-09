import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

/**
 * Silent Refresh Helper
 * Verifies the database connection and merchant status.
 */
export async function getMerchantSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // 1. No token, no session.
  if (!token) return null;

  try {
    // 2. Validate the session against the database (MerchantProfile table)
    const session = await prisma.merchantProfile.findFirst({
      where: { 
        lastLoginToken: token,
        tokenExpires: { gt: new Date() } // Ensure token is still valid
      },
      include: {
        adminUser: true, 
      },
    });

    // 3. Return null if no record found (Middleware will handle the loop break)
    if (!session) return null;

    // 4. Standardized session object
    return {
      user: session.adminUser,
      merchant: {
        id: session.id,
        companyName: session.companyName,
        botUsername: session.botUsername,
        role: session.adminUser.role,
      },
    };
  } catch (error) {
    console.error("Auth: Database verification failed.", error);
    return null;
  }
}

/**
 * Strict Guard for protected dashboard pages.
 * Simply redirects to login. 
 */
export async function requireMerchantSession() {
  const session = await getMerchantSession();

  if (!session) {
    /**
     * ❌ CRITICAL FIX: Removed cookieStore.delete()
     * Next.js 15 does not allow cookie modification in Server Components.
     * The Middleware is now configured to delete 'auth_token' when 
     * it detects a user landing on /dashboard/login with an invalid token.
     */
    redirect("/dashboard/login");
  }

  return session;
}
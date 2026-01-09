import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

/**
 * Silent Refresh Helper
 * Verifies the database connection and merchant status.
 * This is the core logic that "validates" the auth_token cookie.
 */
export async function getMerchantSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // No token, no session.
  if (!token) return null;

  try {
    // 1. Validate the session against the database
    // Ensure 'merchantSession' exists in your schema with an 'id' field
    const session = await prisma.merchantProfile.findFirst({
      where: {
        lastLoginToken: token,
        // Ensure token hasn't expired (Bot login logic)
        tokenExpires: { gt: new Date() },
      },
      include: {
        adminUser: true, // This is the 'User' relation in your schema
      },
    });

    // 2. If no record found or token is invalid
    if (!session) {
      return null;
    }

    // 3. Return a standardized session object
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
    console.error("Auth: Session verification failed.", error);
    return null;
  }
}

/**
 * Strict Guard for protected dashboard pages.
 * Redirects to login if the session is missing or invalid.
 */
export async function requireMerchantSession() {
  const session = await getMerchantSession();

  if (!session) {
    const cookieStore = await cookies();

    // 🚀 THE LOOP BREAKER:
    // We explicitly delete the invalid token before redirecting.
    // This prevents the middleware from seeing a "dead" token and looping.
    cookieStore.delete("auth_token");

    redirect("/dashboard/login");
  }

  return session;
}

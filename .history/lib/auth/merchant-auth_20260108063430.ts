import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function getMerchantSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const session = await prisma.merchantProfile.findFirst({
      where: { 
        lastLoginToken: token,
        tokenExpires: { gt: new Date() } 
      },
      include: { adminUser: true },
    });

    if (!session) return null;

    return {
      user: session.adminUser,
      merchant: {
        id: session.id,
        companyName: session.companyName,
      },
    };
  } catch (e) {
    return null;
  }
}

export async function requireMerchantSession() {
  const session = await getMerchantSession();
  if (!session) {
    // We JUST redirect. The Middleware will see the token + login path 
    // and delete the cookie for us safely.
    redirect("/dashboard/login");
  }
  return session;
}
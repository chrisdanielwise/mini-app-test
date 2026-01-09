import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "zipha_secure_secret_2026");

export async function requireMerchantSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/dashboard/login");

  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    const merchantId = payload.merchantId as string;

    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      include: { adminUser: true }
    });

    if (!merchant) redirect("/dashboard/login");

    return { user: merchant.adminUser, merchant };
  } catch (err) {
    redirect("/dashboard/login");
  }
}
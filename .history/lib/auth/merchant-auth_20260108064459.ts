import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export async function requireMerchantSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/dashboard/login");

  try {
    // 1. Decode JWT (fast)
    const decoded = jwt.verify(token, JWT_SECRET) as { merchantId: string };

    // 2. Fetch Merchant (only once per page load)
    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: decoded.merchantId },
      include: { adminUser: true }
    });

    if (!merchant) redirect("/dashboard/login");

    return {
      user: merchant.adminUser,
      merchant: { id: merchant.id, companyName: merchant.companyName }
    };
  } catch (err) {
    redirect("/dashboard/login");
  }
}
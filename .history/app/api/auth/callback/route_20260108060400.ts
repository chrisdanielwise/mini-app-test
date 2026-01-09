import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma"; // Your prisma client

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const merchantId = searchParams.get("merchantId");

  if (!token || !merchantId) {
    return NextResponse.redirect(new URL("/dashboard/login?error=missing_params", request.url));
  }

  // 1. Validate the token against the DB
  const merchant = await prisma.merchant.findUnique({
    where: { 
      id: merchantId,
      lastLoginToken: token 
    }
  });

  // Check if merchant exists and token isn't expired
  if (!merchant || (merchant.tokenExpires && new Date() > merchant.tokenExpires)) {
    return NextResponse.redirect(new URL("/dashboard/login?error=invalid_token", request.url));
  }

  // 2. Clear the used token so it can't be used again
  await prisma.merchant.update({
    where: { id: merchant.id },
    data: { lastLoginToken: null, tokenExpires: null }
  });

  // 3. Set the 'auth_token' cookie (The loop breaker!)
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // Valid for 7 days
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
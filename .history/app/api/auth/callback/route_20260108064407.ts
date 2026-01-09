import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const merchantId = searchParams.get("merchantId");
  const telegramId = searchParams.get("telegramId"); // Passed from bot

  if (!merchantId || !telegramId) {
    return NextResponse.redirect(new URL("/dashboard/login?error=auth_failed", request.url));
  }

  // 1. Create a Stateless JWT
  // This contains the ID and doesn't require a DB look-up to verify
  const token = jwt.sign(
    { merchantId, telegramId: telegramId.toString() },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
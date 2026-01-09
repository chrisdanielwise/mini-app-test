import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "zipha_secure_secret_2026");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const merchantId = searchParams.get("merchantId");
  const telegramId = searchParams.get("telegramId");

  if (!merchantId) return NextResponse.redirect(new URL("/dashboard/login", request.url));

  // Create JWT (The "Standard Way")
  const token = await new jose.SignJWT({ merchantId, telegramId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
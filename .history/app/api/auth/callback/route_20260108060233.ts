import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // 1. Get the token or data sent back by your Telegram Bot
  const token = searchParams.get("token"); 
  const merchantId = searchParams.get("merchantId");

  if (!token || !merchantId) {
    return NextResponse.redirect(new URL("/dashboard/login?error=invalid_session", request.url));
  }

  // 2. Set the cookie that the Middleware expects
  // We use 'auth_token' because that's what your middleware is looking for
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  // 3. Redirect to the actual dashboard
  // Now the middleware will see the token and let the user in!
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
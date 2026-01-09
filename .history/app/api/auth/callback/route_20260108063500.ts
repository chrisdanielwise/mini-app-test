import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.redirect("/dashboard/login?error=no_token");

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", // CRITICAL: Must be root path
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Use a hard URL to ensure the browser registers the cookie before redirecting
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
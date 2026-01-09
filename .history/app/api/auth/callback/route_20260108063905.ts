import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.redirect(new URL("/dashboard/login", request.url));

  const cookieStore = await cookies();
  
  // 🚀 THE FIX: Ensure path is exactly "/"
  cookieStore.set("auth_token", token, {
    path: "/", 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Use a full URL for the redirect to ensure the cookie is flushed to the browser
  const dashboardUrl = new URL("/dashboard", request.url);
  return NextResponse.redirect(dashboardUrl);
}
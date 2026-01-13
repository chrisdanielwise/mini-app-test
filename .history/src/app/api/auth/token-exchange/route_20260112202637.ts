import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createJWT } from "@/lib/auth/telegram";
import { JWT_CONFIG } from "@/lib/auth/config";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token_Missing" }, { status: 400 });
    }

    // 1. Find the user with this valid token
    const user = await prisma.user.findFirst({
      where: {
        lastLoginToken: token,
        tokenExpires: { gt: new Date() }, // Ensure not expired
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid_or_Expired_Token" }, { status: 401 });
    }

    // 2. Generate the Long-Term JWT Session
    const jwt = await createJWT({
      userId: user.id,
      telegramId: user.telegramId.toString(),
      role: user.role,
      merchantId: user.merchantId || null,
    });

    // 3. Clear the token so it can't be reused (Security Best Practice)
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginToken: null, tokenExpires: null },
    });

    // 4. Set the Cookie using Next.js 16 Await Protocol
    const cookieStore = await cookies();
    cookieStore.set(JWT_CONFIG.cookieName, jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔥 [Token_Exchange_Error]:", error.message);
    return NextResponse.json({ error: "Internal_Handshake_Failure" }, { status: 500 });
  }
}
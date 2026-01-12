import { NextRequest, NextResponse } from "next/server";
import { createJWT } from "@/lib/auth/telegram";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // 🔍 FIX: Prisma expects 'SUPER_ADMIN' (the key), not 'super_admin' (the @map value)
    const testUser = await prisma.user.findFirst({ 
      where: { 
        role: 'SUPER_ADMIN' // 🚀 Must be UPPERCASE to match Schema Key
      } 
    });

    if (!testUser) {
      return NextResponse.json({ 
        error: "No Super Admin found. Run your migration/seed first." 
      }, { status: 404 });
    }

    // 🔐 Generate production-grade JWT
    const token = await createJWT({
      telegramId: testUser.telegramId.toString(), // Standardize BigInt to String
      userId: testUser.id,
      role: testUser.role.toLowerCase(), // Normalize for Middleware
      merchantId: null,
    });

    const response = NextResponse.json({ 
      status: "SUCCESS", 
      message: "Session manually injected into browser cookies.",
      user_id: testUser.id 
    });
    
    // 🏁 TUNNEL-HARDENED COOKIE
    response.cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: true,   // Required for HTTPS Tunnels
      sameSite: "lax", // Mandatory for Telegram Mini App handshakes
      maxAge: 60 * 60 * 24 * 7,
    });

    // Prevents Cloudflare/Ngrok from intercepting with warning pages
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;
  } catch (error: any) {
    console.error("🔥 [Debug_Inject_Error]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { createJWT } from "@/lib/auth/telegram";
import prisma from "@/lib/db";
import { JWT_CONFIG } from "@/lib/auth/config"; // 🛡️ Your Source of Truth

/**
 * 🛰️ SESSION INJECTOR (Institutional v9.2.3)
 * Hardened: Uses JWT_CONFIG to prevent decryption mismatches.
 * Turbopack-Ready: Optimized for Next.js 16/Turbopack engine.
 */
export async function GET(request: NextRequest) {
  try {
    // 🔍 IDENTITY LOOKUP
    // Prisma requires the Enum Key (UPPERCASE) defined in your schema
    const testUser = await prisma.user.findFirst({ 
      where: { role: 'SUPER_ADMIN' } 
    });

    if (!testUser) {
      return NextResponse.json({ 
        error: "No Super Admin found. Ensure your database is seeded." 
      }, { status: 404 });
    }

    // 🔐 JWT GENERATION
    // Standardizes BigInt IDs to Strings for Next.js hydration safety
    const token = await createJWT({
      telegramId: testUser.telegramId.toString(),
      userId: testUser.id,
      role: testUser.role.toLowerCase(), // Normalizes for Middleware RBAC
      merchantId: null,
    });

    const response = NextResponse.json({ 
      status: "SUCCESS", 
      message: "Session injected via Universal Config.",
      user_id: testUser.id 
    });
    
    // 🏁 TUNNEL-HARDENED COOKIE
    // Uses centralized naming from JWT_CONFIG
    response.cookies.set(JWT_CONFIG.cookieName, token, {
      path: "/",
      httpOnly: true,
      secure: true,   // Mandatory for HTTPS Tunnels
      sameSite: "lax", // Mandatory for Telegram Webview handshakes
      maxAge: 60 * 60 * 24 * 7,
    });

    // Bypass proxy warning pages (Ngrok/Cloudflare)
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;
  } catch (error: any) {
    console.error("🔥 [Debug_Inject_Error]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
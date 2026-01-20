import { NextRequest, NextResponse } from "next/server";
import { createJWT } from "@/lib/services/auth.service"; // ✅ Corrected path
import prisma from "@/lib/db";
import { JWT_CONFIG } from "@/lib/auth/config"; 
import { UserRole } from "@/generated/prisma"; // ✅ IMPORTING ENUMS

/**
 * 🛰️ SESSION INJECTOR (Institutional v2026.1.20)
 * Hardened: Uses JWT_CONFIG to prevent decryption mismatches.
 * Purpose: Development-only bypass to inject a valid staff session.
 */
export async function GET(request: NextRequest) {
  try {
    // 🔍 IDENTITY LOOKUP
    // Prisma requires the strictly UPPERCASE Enum Key defined in your schema
    const testUser = await prisma.user.findFirst({ 
      where: { 
        role: UserRole.SUPER_ADMIN, // ✅ FIXED: Using UPPERCASE Enum member
        deletedAt: null 
      } 
    });

    if (!testUser) {
      return NextResponse.json({ 
        error: "No Super Admin found. Ensure your database is seeded with role: 'SUPER_ADMIN'." 
      }, { status: 404 });
    }

    // 🔐 JWT GENERATION
    // Standardizes BigInt IDs to Strings for Next.js hydration safety
    // payload must match the JWTPayload interface defined in auth.service
    const token = await createJWT({
      sub: testUser.id, // userId (JWT Standard Subject)
      telegramId: testUser.telegramId.toString(),
      role: testUser.role.toLowerCase(), // Normalizes for Middleware RBAC
      merchantId: null,
      isStaff: true,
      securityStamp: testUser.securityStamp || "initial_debug_stamp",
    });

    const response = NextResponse.json({ 
      status: "SUCCESS", 
      message: "Session injected via Universal Config.",
      user_id: testUser.id,
      role: testUser.role.toLowerCase()
    });
    
    // 🏁 TUNNEL-HARDENED COOKIE
    // 'partitioned: true' is added for 2026 Telegram Iframe compatibility
    response.cookies.set(JWT_CONFIG.cookieName, token, {
      path: "/",
      httpOnly: true,
      secure: true,   
      sameSite: "none", // Required for partitioned cookies in iframes
      partitioned: true, // 🛰️ Vital for 2026 cross-site contexts
      maxAge: 60 * 60 * 24 * 7,
    });

    // Bypass proxy warning pages (Ngrok/Localhost Tunnels)
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;
  } catch (error: any) {
    console.error("🔥 [Debug_Inject_Error]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
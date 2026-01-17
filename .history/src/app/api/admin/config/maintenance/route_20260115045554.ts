import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { AuthService, verifySession } from "@/lib/services/auth.service";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🛠️ ADMIN CONFIG: Maintenance Toggle (v16.16.12)
 * Logic: Updates global SystemConfig and optionally rotates all security stamps.
 */
export async function PATCH(request: Request) {
  try {
    // 🔐 1. STAFF AUTHENTICATION GATE
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    if (!token) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const payload = await verifySession(token);
    if (!payload || !payload.sub) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: { id: true, role: true, username: true }
    });

    const isStaff = user && JWT_CONFIG.staffRoles.includes(user.role.toLowerCase());
    if (!isStaff) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

    // 📥 2. DATA EXTRACTION
    const { active, message, forceLogout } = await request.json();

    // 🔄 3. ATOMIC PERSISTENCE
    // We use findFirst to get the existing singleton ID
    const currentConfig = await prisma.systemConfig.findFirst();

    const updatedConfig = await prisma.$transaction(async (tx) => {
      const config = await tx.systemConfig.upsert({
        where: { id: currentConfig?.id || crypto.randomUUID() }, 
        update: { 
          maintenanceMode: active,
          maintenanceMessage: message || "Node offline for scheduled maintenance.",
          updatedBy: user.id
        },
        create: {
          maintenanceMode: active,
          maintenanceMessage: message || "Node offline for scheduled maintenance.",
          updatedBy: user.id
        }
      });

      // 🚨 OPTIONAL: SECURITY PURGE
      // If forceLogout is true, we rotate EVERY user's securityStamp.
      // This kills every active session immediately.
      if (active && forceLogout) {
        await tx.user.updateMany({
          data: { securityStamp: crypto.randomUUID() }
        });
      }

      return config;
    });

    return NextResponse.json({ 
      success: true,
      maintenance: updatedConfig.maintenanceMode,
      message: updatedConfig.maintenanceMessage 
    });

  } catch (error: any) {
    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
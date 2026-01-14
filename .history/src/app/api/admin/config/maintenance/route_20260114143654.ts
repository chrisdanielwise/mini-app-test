import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { AuthService } from "@/lib/services/auth.service";
import { JWT_CONFIG } from "@/lib/auth/config";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

/**
 * 🛠️ ADMIN CONFIG: Maintenance Toggle (v16.9.5)
 * Logic: Updates global SystemConfig and rotates security stamps if needed.
 */
export async function PATCH(request: Request) {
  try {
    // 🔐 1. STAFF AUTHENTICATION GATE
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    if (!token) return errorResponse("UNAUTHORIZED", 401);

    const payload = await AuthService.verifySession(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string }
    });

    const isStaff = user && JWT_CONFIG.staffRoles.includes(user.role.toLowerCase());
    if (!isStaff) return errorResponse("FORBIDDEN: STAFF_CLEARANCE_REQUIRED", 403);

    // 📥 2. DATA EXTRACTION
    const { active, message } = await request.json();

    // 🔄 3. PERSISTENCE
    const config = await prisma.systemConfig.findFirst();
    
    const updatedConfig = await prisma.systemConfig.upsert({
      where: { id: config?.id || '00000000-0000-0000-0000-000000000000' }, // Seed ID or fallback
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

    console.log(`🛠️ [System_Override]: Maintenance ${active ? 'ENABLED' : 'DISABLED'} by ${user.username}`);

    return successResponse({ 
      status: updatedConfig.maintenanceMode,
      message: updatedConfig.maintenanceMessage 
    });

  } catch (error: any) {
    console.error("🔥 [Admin_Config_Fault]:", error.message);
    return errorResponse("CONFIG_UPDATE_FAILED", 500);
  }
}
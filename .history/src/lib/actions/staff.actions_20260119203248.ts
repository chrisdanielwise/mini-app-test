"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { rotateSecurityStamp } from "@/lib/services/auth.service";

/**
 * ✅ FIX: TS2322 - Role must match strict Prisma Enum members.
 * Standardizing on uppercase ingress for the $Enums.UserRole type.
 */
import { $Enums, UserRole } from "@/generated/prisma";

export async function updateStaffRoleAction(userId: string, newRole: string) {
  // 🔐 1. Clearance Check (Super Admin Only for role changes)
  const session = await requireStaff();
  
  // Note: Standardizing check against uppercase Enum if defined as such in schema
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "super_admin") {
    return { error: "SECURITY_ALERT: Insufficient clearance for identity modification." };
  }

  if (!isUUID(userId)) return { error: "INVALID_NODE_ID" };

  try {
    await prisma.$transaction(async (tx) => {
      // 🏁 2. Update Database Node
      // ✅ FIX: TS2322 - Convert to uppercase and cast to the Prisma Enum type
      await tx.user.update({
        where: { id: userId },
        data: { 
          role: newRole.toUpperCase() as UserRole 
        }
      });

      // 🛡️ 3. Rotate Security Stamp
      // Forces the user to re-login with their new permissions
      await rotateSecurityStamp(userId);
    });

    // 🔄 4. Purge Auth Caches
    // ✅ FIX: Next.js 15 simplified revalidateTag
    revalidateTag("auth");

    return { success: true };
  } catch (error: any) {
    console.error("🔥 [Staff_Action_Fault]:", error.message);
    return { error: `PROTOCOL_FAILURE: ${error.message || "Database sync failed."}` };
  }
}
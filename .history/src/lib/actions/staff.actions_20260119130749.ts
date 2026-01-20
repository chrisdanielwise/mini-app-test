"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { rotateSecurityStamp } from "@/lib/services/auth.service";

export async function updateStaffRoleAction(userId: string, newRole: string) {
  // 🔐 1. Clearance Check (Super Admin Only for role changes)
  const session = await requireStaff();
  if (session.user.role !== "super_admin") {
    return { error: "SECURITY_ALERT: Insufficient clearance for identity modification." };
  }

  if (!isUUID(userId)) return { error: "INVALID_NODE_ID" };

  try {
    await prisma.$transaction(async (tx) => {
      // 🏁 2. Update Database Node
      await tx.user.update({
        where: { id: userId },
        data: { role: newRole.toLowerCase() }
      });

      // 🛡️ 3. Rotate Security Stamp
      // This forces the user to re-login with their new permissions
      await rotateSecurityStamp(userId);
    });

    // 🔄 4. Purge Auth Caches
    revalidateTag("auth", "default");

    return { success: true };
  } catch (error) {
    return { error: "PROTOCOL_FAILURE: Database sync failed." };
  }
}
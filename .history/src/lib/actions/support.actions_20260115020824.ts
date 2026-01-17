"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🔒 PROTOCOL: RESOLVE TICKET
 * Clearance: Staff Only
 * Securely marks a support ticket node as resolved after verification.
 */
export async function resolveTicketAction(ticketId: string) {
  // 🔐 1. IDENTITY HANDSHAKE
  // Ensures only users with 'super_admin' or 'platform_manager' roles can execute.
  const session = await requireStaff();

  // 🛡️ 2. DATA AUDIT
  if (!isUUID(ticketId)) {
    return { error: "Validation Protocol: Target ticket node ID is malformed." };
  }

  try {
    // 🏁 3. DATABASE COMMIT
    // Note: We could also log which staff member resolved it in a 'resolvedBy' field
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { 
        status: 'RESOLVED',
        // Optional: track the operator who performed the action
        resolvedBy: session.user.id 
      }
    });

    // 🔄 4. CACHE REVALIDATION
    revalidatePath("/dashboard/support");
    revalidatePath("/dashboard"); // Updates "Open Tickets" count on HUD
    
    return { success: true };
  } catch (error) {
    console.error("❌ Support Action Failed:", error);
    return { error: "Node Error: Could not update ticket status. Verify database link." };
  }
}
"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { CACHE_PROFILES } from "@/lib/auth/config";

/**
 * 🔒 PROTOCOL: RESOLVE TICKET (v16.16.20 - Hardened)
 * Clearance: Staff Only
 * Fix: Replaced path revalidation with Tagged Profile purge for 2026 standards.
 */
export async function resolveTicketAction(ticketId: string) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await requireStaff();

  // 🛡️ 2. DATA AUDIT
  if (!isUUID(ticketId)) {
    return { error: "Validation Protocol: Target ticket node ID is malformed." };
  }

  try {
    // 🏁 3. DATABASE COMMIT
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { 
        status: 'RESOLVED',
        resolvedBy: session.user.id 
      }
    });

    // 🔄 4. ATOMIC CACHE REVALIDATION
    // Fix: Using the DATA profile ("api") to refresh support counts and ticket lists.
    // This resolves the ts(2554) error found in standard revalidateTag calls.
    revalidateTag("support_node", CACHE_PROFILES.DATA);
    
    return { success: true };
  } catch (error) {
    console.error("❌ Support Action Failed:", error);
    return { error: "Node Error: Could not update ticket status. Verify database link." };
  }
}
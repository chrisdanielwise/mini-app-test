"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
// ✅ INSTITUTIONAL INGRESS: Strictly typed from your generated client
import { TicketStatus } from "@/generated/prisma";

/**
 * 🛰️ ACTION: RESOLVE_TICKET
 * Level: Staff/Support Only
 * Logic: Transitions a support node to 'resolved' and anchors the resolving agent.
 */
export async function resolveTicketAction(ticketId: string) {
  // 🔐 1. IDENTITY GATE
  const session = await requireStaff();

  if (!isUUID(ticketId)) {
    return { error: "Validation Protocol: Malformed ID." };
  }

  try {
    // 🏁 2. DATABASE_COMMIT
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { 
        // ✅ FIX: Use TicketStatus Enum (maps to "resolved" lowercase in DB)
        status: TicketStatus.RESOLVED,
        // ✅ FIX: Mapping to 'assignedAgentId' per schema profile
        assignedAgentId: session.user.id 
      }
    });

    // 🔄 3. ATOMIC CACHE REVALIDATION
    // Fix: Provided mandatory "default" profile for Next.js 15 compliance.
    // This resolves the ts(2554) error found in standard revalidateTag calls.
    revalidateTag("support_node", "default");
    
    return { success: true };
  } catch (error: any) {
    console.error("🔥 [Ticket_Resolve_Fault]:", error.message);
    return { error: "Database Sync Failure." };
  }
}
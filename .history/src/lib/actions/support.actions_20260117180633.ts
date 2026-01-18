"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { CACHE_PROFILES } from "@/lib/auth/config";

export async function resolveTicketAction(ticketId: string) {
  const session = await requireStaff();

  if (!isUUID(ticketId)) {
    return { error: "Validation Protocol: Malformed ID." };
  }

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { 
        status: 'RESOLVED',
        // assignedAgentId is in your schema, resolvedBy is NOT.
        assignedAgentId: session.user.id 
      }
    });

    revalidateTag("support_node", CACHE_PROFILES.DATA);
    return { success: true };
  } catch (error) {
    return { error: "Database Sync Failure." };
  }
}
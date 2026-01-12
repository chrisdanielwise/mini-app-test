"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function resolveTicketAction(ticketId: string) {
  try {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: 'RESOLVED' }
    });

    revalidatePath("/dashboard/support");
    return { success: true };
  } catch (error) {
    console.error("❌ Support Action Failed:", error);
    return { error: "Could not update ticket status." };
  }
}
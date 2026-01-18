"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";

export const SupportService = {
  async openTicket(params: {
    merchantId: string;
    subject: string;
    description: string;
    priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  }) {
    if (!isUUID(params.merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Merchant_ID");

    const ticket = await prisma.ticket.create({
      data: {
        merchantId: params.merchantId,
        subject: params.subject,
        status: "OPEN",
        priority: params.priority || "NORMAL",
        messages: {
          create: {
            content: params.description,
            senderType: "MERCHANT",
          }
        }
      }
    });

    // 🏛️ ATOMIC CACHE PURGE
    // Fix: Replaces revalidatePath with a tagged purge for the 'DATA' profile.
    revalidateTag("support_node", CACHE_PROFILES.DATA);
    return ticket;
  },

  async appendMessage(params: {
    ticketId: string;
    content: string;
    senderType: "MERCHANT" | "STAFF";
    staffId?: string;
  }) {
    if (!isUUID(params.ticketId)) throw new Error("PROTOCOL_ERROR: Invalid_Ticket_ID");

    return prisma.$transaction(async (tx) => {
      const message = await tx.ticketMessage.create({
        data: {
          ticketId: params.ticketId,
          content: params.content,
          senderType: params.senderType,
          staffId: params.staffId,
        }
      });

      await tx.ticket.update({
        where: { id: params.ticketId },
        data: { 
          updatedAt: new Date(),
          ...(params.senderType === "MERCHANT" ? { status: "OPEN" } : { status: "AWAITING_REPLY" })
        }
      });

      // 🚀 PURGE: Ensures the chat bubble appears for the recipient instantly.
      revalidateTag("support_node", CACHE_PROFILES.DATA);

      return message;
    });
  }
};
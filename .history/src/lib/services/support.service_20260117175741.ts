"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
// 🛰️ IMPORT GENERATED ENUMS: Resolves ts(2322)
import { TicketPriority, SenderType, TicketStatus } from "@/generated/prisma";

export const SupportService = {
  /**
   * 🛰️ OPEN_TICKET
   * Fix: Uses TicketPriority enum to satisfy Prisma strict typing.
   */
  async openTicket(params: {
    merchantId: string;
    subject: string;
    description: string;
    priority?: keyof typeof TicketPriority; 
  }) {
    if (!isUUID(params.merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Merchant_ID");

    return await prisma.ticket.create({
      data: {
        merchantId: params.merchantId,
        subject: params.subject,
        status: "OPEN" as TicketStatus,
        // Using the Enum ensures "URGENT" matches the DB definition
        priority: (params.priority as TicketPriority) || TicketPriority.NORMAL,
        messages: {
          create: {
            content: params.description,
            senderType: SenderType.MERCHANT,
          }
        }
      }
    });
  },

  /**
   * 💬 APPEND_MESSAGE
   * Fix: Casts senderType to the Prisma-generated SenderType Enum.
   */
  async appendMessage(params: {
    ticketId: string;
    content: string;
    senderType: keyof typeof SenderType; // "MERCHANT" | "STAFF"
    staffId?: string;
  }) {
    if (!isUUID(params.ticketId)) throw new Error("PROTOCOL_ERROR: Invalid_Ticket_ID");

    return prisma.$transaction(async (tx) => {
      const message = await tx.ticketMessage.create({
        data: {
          ticketId: params.ticketId,
          content: params.content,
          senderType: params.senderType as SenderType,
          staffId: params.staffId,
        }
      });

      // Update parent ticket "Last Activity" and Status
      await tx.ticket.update({
        where: { id: params.ticketId },
        data: { 
          updatedAt: new Date(),
          // Auto-Status Logic: Flip to OPEN if merchant, AWAITING_REPLY if staff
          status: params.senderType === "MERCHANT" ? "OPEN" : "AWAITING_REPLY"
        }
      });

      // 🚀 ATOMIC CACHE PURGE: Synchronizes the Mobile Dashboard
      revalidateTag("support_node", CACHE_PROFILES.DATA);

      return message;
    });
  },

  /**
   * 🔍 GET_MERCHANT_TICKETS
   */
  getMerchantTickets: cache(async (merchantId: string) => {
    if (!isUUID(merchantId)) return [];
    
    return await prisma.ticket.findMany({
      where: { merchantId },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { messages: true } }
      }
    });
  })
};
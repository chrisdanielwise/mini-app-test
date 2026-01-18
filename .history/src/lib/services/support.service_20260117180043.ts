"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
// 🛰️ IMPORT GENERATED ENUMS: Pull directly from the client to see actual values
import { SenderType } from "@/generated/pr";

export const SupportService = {
  /**
   * 🛰️ OPEN_TICKET
   * Logic: Standardized to use CUSTOMER (Merchant) and AGENT (Staff) enums.
   */
  async openTicket(params: {
    merchantId: string;
    subject: string;
    description: string;
    // Fallback to string if Priority enum is missing, or use actual enum if available
    priority?: any; 
  }) {
    if (!isUUID(params.merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Merchant_ID");

    return await prisma.ticket.create({
      data: {
        merchantId: params.merchantId,
        subject: params.subject,
        status: "OPEN", // Use string literal if Enum import fails
        priority: params.priority || "NORMAL",
        messages: {
          create: {
            // 💡 FIX: Changed 'content' to 'text' (Check your schema.prisma!)
            text: params.description, 
            senderType: SenderType.CUSTOMER, // Maps to your "MERCHANT"
          }
        }
      }
    });
  },

  /**
   * 💬 APPEND_MESSAGE
   */
  async appendMessage(params: {
    ticketId: string;
    text: string;
    senderType: "CUSTOMER" | "AGENT"; 
    staffId?: string;
  }) {
    if (!isUUID(params.ticketId)) throw new Error("PROTOCOL_ERROR: Invalid_Ticket_ID");

    return prisma.$transaction(async (tx) => {
      const message = await tx.ticketMessage.create({
        data: {
          ticketId: params.ticketId,
          text: params.text,
          senderType: params.senderType as SenderType,
          staffId: params.staffId,
        }
      });

      // 🔄 AUTO-STATUS LOGIC
      // Fix: Compare against CUSTOMER instead of MERCHANT
      await tx.ticket.update({
        where: { id: params.ticketId },
        data: { 
          updatedAt: new Date(),
          status: params.senderType === "CUSTOMER" ? "OPEN" : "AWAITING_REPLY"
        }
      });

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
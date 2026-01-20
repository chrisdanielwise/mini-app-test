"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
// 🛰️ SCHEMA ALIGNMENT: Pulling strictly from your generated client
import { SenderType, TicketPriority } from "@/generated/prisma";

export const SupportService = {
  /**
   * 🛰️ OPEN_TICKET
   * Logic: Standardized to Schema v2.0.0.
   * Note: 'status' is a String in your schema, while 'priority' is an Enum.
   */
  async openTicket(params: {
    userId: string;       // Required by UserTickets relation
    merchantId: string;   // Required for dashboard visibility
    subject: string;
    description: string;
    priority?: TicketPriority; 
  }) {
    if (!isUUID(params.userId) || !isUUID(params.merchantId)) {
      throw new Error("PROTOCOL_ERROR: Invalid_Identity_Node");
    }

    const ticket = await prisma.ticket.create({
      data: {
        userId: params.userId,
        merchantId: params.merchantId,
        subject: params.subject,
        status: "OPEN" as , 
        priority: params.priority || TicketPriority.MEDIUM, // MEDIUM is the schema default
        messages: {
          create: {
            senderId: params.userId,
            message: params.description, // Aligned to 'message' field in schema
            senderType: SenderType.CUSTOMER, // CUSTOMER maps to Merchant/User in your enums
          }
        }
      }
    });

    // 🏛️ ATOMIC CACHE PURGE
    revalidateTag("support_node", CACHE_PROFILES.DATA);
    return ticket;
  },

  /**
   * 💬 APPEND_MESSAGE
   * Logic: Atomic transaction to update message and parent ticket status.
   */
  async appendMessage(params: {
    ticketId: string;
    senderId: string;
    message: string;
    senderType: SenderType;
  }) {
    if (!isUUID(params.ticketId) || !isUUID(params.senderId)) {
      throw new Error("PROTOCOL_ERROR: Invalid_Node_Reference");
    }

    return prisma.$transaction(async (tx) => {
      // 1. Create the Message Node
      const newMessage = await tx.ticketMessage.create({
        data: {
          ticketId: params.ticketId,
          senderId: params.senderId,
          message: params.message,
          senderType: params.senderType,
        }
      });

      // 2. Update Parent Ticket (Telemetry & Status)
      await tx.ticket.update({
        where: { id: params.ticketId },
        data: { 
          updatedAt: new Date(),
          // Logic: If user (CUSTOMER) speaks, keep/reopen. If staff (AGENT) speaks, wait for reply.
          status: params.senderType === SenderType.CUSTOMER ? "OPEN" : "AWAITING_REPLY"
        }
      });

      // 🚀 PURGE: Instant chat refresh for both parties
      revalidateTag("support_node", CACHE_PROFILES.DATA);

      return newMessage;
    });
  },

  /**
   * 🔍 GET_MERCHANT_TICKETS
   * Performance: Memoized via React Cache for server-component layout hydration.
   */
  getMerchantTickets: cache(async (merchantId: string) => {
    if (!merchantId) return [];
    
    return await prisma.ticket.findMany({
      where: { merchantId },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { messages: true } },
        user: { select: { firstName: true, lastName: true, username: true } }
      }
    });
  })
};
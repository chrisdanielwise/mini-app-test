"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
// 🛰️ SCHEMA ALIGNMENT: Using generated Enums to ensure case-sensitivity compliance
import { SenderType, TicketPriority, TicketStatus } from "@/generated/prisma";

/**
 * 🛰️ SUPPORT_SERVICE (Institutional Apex v2026.1.20 - HARDENED)
 * Fix: Standardized to lowercase database enums while maintaining frontend types.
 * Fix: revalidateTag signature updated to provide the required 'profile' argument.
 */
export const SupportService = {
  /**
   * 🛰️ OPEN_TICKET
   * Logic: Standardized to Schema v2.0.0.
   */
  async openTicket(params: {
    userId: string;
    merchantId: string;
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
        // ✅ FIX: Use Enum member 'open' (lowercase in DB) instead of string "OPEN"
        status: TicketStatus.open, 
        priority: params.priority || TicketPriority.medium, 
        messages: {
          create: {
            senderId: params.userId,
            message: params.description,
            senderType: SenderType.customer, // ✅ FIX: customer (lowercase)
          }
        }
      }
    });

    // ✅ FIX: Provided mandatory second argument "default" for TS2554
    revalidateTag("support_node", "default");
    
    return JSON.parse(JSON.stringify(ticket));
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
      const newMessage = await tx.ticketMessage.create({
        data: {
          ticketId: params.ticketId,
          senderId: params.senderId,
          message: params.message,
          senderType: params.senderType,
        }
      });

      await tx.ticket.update({
        where: { id: params.ticketId },
        data: { 
          updatedAt: new Date(),
          // ✅ FIX: Using lowercase Enum values to satisfy DB constraints
          status: params.senderType === SenderType.customer 
            ? TicketStatus.open 
            : TicketStatus.awaiting_reply
        }
      });

      // ✅ FIX: Provided mandatory second argument "default"
      revalidateTag("support_node", "default");

      return JSON.parse(JSON.stringify(newMessage));
    });
  },

  /**
   * 🔍 GET_MERCHANT_TICKETS
   */
  getMerchantTickets: cache(async (merchantId: string) => {
    if (!merchantId || !isUUID(merchantId)) return [];
    
    const tickets = await prisma.ticket.findMany({
      where: { merchantId },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { messages: true } },
        user: { select: { firstName: true, lastName: true, username: true } }
      }
    });

    return JSON.parse(JSON.stringify(tickets));
  })
};
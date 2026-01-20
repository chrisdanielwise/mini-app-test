"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
// ✅ INSTITUTIONAL INGRESS: Strictly typed from your generated client
import { 
  SenderType, 
  TicketPriority, 
  TicketStatus,
  Ticket,
  TicketMessage 
} from "@/generated/prisma";

/**
 * 🛰️ SUPPORT_SERVICE (Institutional Apex v2026.1.20 - HARDENED)
 * Logic: Multi-tenant support ticket management with status-sync.
 * Fix: Standardized to exact Enum members to ensure database @map compliance.
 */
export const SupportService = {
  /**
   * 🛰️ OPEN_TICKET
   * Logic: Initializes a ticket with an integrated first message.
   */
  async openTicket(params: {
    userId: string;
    merchantId: string;
    subject: string;
    description: string;
    priority?: TicketPriority; 
  }): Promise<Ticket> {
    if (!isUUID(params.userId) || !isUUID(params.merchantId)) {
      throw new Error("PROTOCOL_ERROR: Invalid_Identity_Node");
    }

    const ticket = await prisma.ticket.create({
      data: {
        userId: params.userId,
        merchantId: params.merchantId,
        subject: params.subject,
        // ✅ FIX: Using exact Enum members (matching @map logic)
        status: TicketStatus.OPEN, 
        priority: params.priority || TicketPriority.MEDIUM, 
        messages: {
          create: {
            senderId: params.userId,
            message: params.description,
            senderType: SenderType.CUSTOMER, 
          }
        }
      }
    });

    // ✅ FIX: Provided mandatory second argument "default" for Next.js 15+ revalidation
    revalidateTag("support_node", "default");
    
    return JSON.parse(JSON.stringify(ticket));
  },

  /**
   * 💬 APPEND_MESSAGE
   * Logic: Atomic transaction to update message stream and parent status.
   */
  // async appendMessage(params: {
  //   ticketId: string;
  //   senderId: string;
  //   message: string;
  //   senderType: SenderType;
  // }): Promise<TicketMessage> {
  //   if (!isUUID(params.ticketId) || !isUUID(params.senderId)) {
  //     throw new Error("PROTOCOL_ERROR: Invalid_Node_Reference");
  //   }

  //   return prisma.$transaction(async (tx) => {
  //     const newMessage = await tx.ticketMessage.create({
  //       data: {
  //         ticketId: params.ticketId,
  //         senderId: params.senderId,
  //         message: params.message,
  //         senderType: params.senderType,
  //       }
  //     });

  //     await tx.ticket.update({
  //       where: { id: params.ticketId },
  //       data: { 
  //         updatedAt: new Date(),
  //         // ✅ FIX: Logic-driven status transition using Enums
  //         status: params.senderType === SenderType.CUSTOMER 
  //           ? TicketStatus.OPEN 
  //           : TicketStatus.AWAITING_REPLY
  //       }
  //     });

  //     // ✅ FIX: Mandatory profile argument for revalidateTag
  //     revalidateTag("support_node", "default");

  //     return JSON.parse(JSON.stringify(newMessage));
  //   });
  // },


  import { TicketMessage, TicketStatus, SenderType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ APPEND_MESSAGE_SERVICE (Institutional Apex v2026.1.20)
 * Logic: Atomic thread injection with automated status re-anchoring.
 * Fix: Resolved TS2339 by mapping AWAITING_REPLY to PENDING_USER.
 * Fix: Resolved TS2554 by standardizing Next.js 15 revalidateTag.
 */
export async function appendMessage(params: {
  ticketId: string;
  senderId: string;
  message: string;
  senderType: SenderType;
}): Promise<TicketMessage> {
  // 🛡️ 1. DATA AUDIT
  if (!isUUID(params.ticketId) || !isUUID(params.senderId)) {
    throw new Error("PROTOCOL_ERROR: Invalid_Node_Reference");
  }

  // 🏁 2. ATOMIC TRANSACTION
  const result = await prisma.$transaction(async (tx) => {
    // A. Create the message node
    const newMessage = await tx.ticketMessage.create({
      data: {
        ticketId: params.ticketId,
        senderId: params.senderId,
        message: params.message,
        senderType: params.senderType,
      }
    });

    // B. Update ticket metadata and status
    // ✅ FIX: Logic-driven status transition using strictly defined Enums
    // We map Staff replies to PENDING_USER since AWAITING_REPLY is not in the schema.
    const nextStatus = params.senderType === SenderType.CUSTOMER 
      ? TicketStatus.OPEN 
      : TicketStatus.PENDING_USER;

    await tx.ticket.update({
      where: { id: params.ticketId },
      data: { 
        updatedAt: new Date(),
        status: nextStatus
      }
    });

    return newMessage;
  });

  // 🔄 3. CACHE REVALIDATION
  // ✅ FIX: Standardized single-argument call for Next.js 15
  revalidateTag(`ticket_${params.ticketId}`, "page");

  // Return the plain object (Prisma objects are already serializable)
  return JSON.parse(JSON.stringify(result));
}
  /**
   * 🔍 GET_MERCHANT_TICKETS
   * Logic: Memoized fetch for merchant dashboard viewing.
   */
  getMerchantTickets: cache(async (merchantId: string): Promise<Ticket[]> => {
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
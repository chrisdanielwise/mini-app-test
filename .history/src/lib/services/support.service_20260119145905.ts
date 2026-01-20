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
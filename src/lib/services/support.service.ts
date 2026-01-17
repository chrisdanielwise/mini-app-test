"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidatePath } from "next/cache";

/**
 * 🌊 SUPPORT_RELAY_SERVICE (v16.16.12)
 * Logic: Encrypted communication relay between Merchants and Platform Staff.
 * Architecture: Threaded message nodes with Status-Aware Telemetry.
 */
export const SupportService = {
  /**
   * 🛰️ OPEN_TICKET
   * Logic: Initializes a new support node for a merchant.
   */
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

    revalidatePath("/dashboard/support");
    return ticket;
  },

  /**
   * 💬 APPEND_MESSAGE
   * Logic: Adds a new message to an existing support thread.
   */
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

      // Update parent ticket "Last Activity" and Auto-Reopen if Merchant replies
      await tx.ticket.update({
        where: { id: params.ticketId },
        data: { 
          updatedAt: new Date(),
          ...(params.senderType === "MERCHANT" ? { status: "OPEN" } : { status: "AWAITING_REPLY" })
        }
      });

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
  }),

  /**
   * 🛡️ GET_GLOBAL_TICKETS (Staff Only - Amber Flavor)
   */
  getGlobalTickets: cache(async (status?: "OPEN" | "CLOSED") => {
    return await prisma.ticket.findMany({
      where: status ? { status } : {},
      include: {
        merchant: { select: { companyName: true } },
        _count: { select: { messages: true } }
      },
      orderBy: [
        { priority: "desc" },
        { updatedAt: "desc" }
      ]
    });
  })
};
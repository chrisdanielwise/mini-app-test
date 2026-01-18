"use server";

import prisma from "@/lib/db";
import { headers } from "next/headers";
import { isUUID } from "@/lib/utils/validators";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { revalidateTag } from "next/cache";

/**
 * 🛰️ ACTIVITY_LOGGER_SERVICE (Institutional v16.16.20)
 * Logic: Non-blocking audit trails for forensic accountability.
 * Standard: Aligned to ActivityLog model in Schema v2.0.0.
 */
export const ActivityService = {
  /**
   * 📝 LOG_ACTION
   * Logic: Captures the "Who, What, Where, and When" of an operation.
   */
  async log(params: {
    actorId: string;      // The User.id performing the action
    merchantId?: string;  // Optional: The merchant context
    action: string;      // e.g., "RESOLVE_TICKET", "UPDATE_PRICE"
    resource: string;    // e.g., "Ticket:uuid", "Product:uuid"
    metadata?: any;      // JSON payload of changes
  }) {
    try {
      // 🕵️ 1. Extract Network Context
      const headerList = await headers();
      const ip = headerList.get("x-forwarded-for") || "internal";

      // 🏁 2. Create the Audit Node
      const logEntry = await prisma.activityLog.create({
        data: {
          actorId: params.actorId,
          merchantId: params.merchantId || null,
          action: params.action,
          resource: params.resource,
          metadata: params.metadata || {},
          ipAddress: ip,
        },
      });

      // 🚀 3. Purge Dashboard Feed
      // Ensures the "Recent Activity" widget updates instantly for admins.
      revalidateTag("activity_node", CACHE_PROFILES.DATA);

      return logEntry;
    } catch (error) {
      // Silently fail logging to prevent blocking the main business logic
      console.error("🕵️ [Audit_Failure]: Could not record activity node.", error);
      return null;
    }
  },

  /**
   * 📜 GET_FEED
   * Logic: Optimized for high-speed Dashboard Activity Feeds.
   */
  getFeed: async (merchantId?: string, limit = 20) => {
    return await prisma.activityLog.findMany({
      where: merchantId ? { merchantId } : {},
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        actor: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            username: true
          }
        }
      }
    });
  }
};
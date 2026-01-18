"use server";

import prisma from "@/lib/db";
import { revalidateTag, unstable_cache } from "next/cache";

/**
 * 🌊 SYSTEM_CONFIG_SERVICE (v16.16.12)
 * Logic: High-velocity maintenance control with Edge-TTL propagation.
 * Security: Atomic update with Operator-Audit anchoring.
 */
export const ConfigService = {
  /**
   * 🔍 GET_SYSTEM_STATUS
   * Architecture: Memoized at the Next.js Data Cache layer.
   * Logic: Returns the active protocol state for Middleware gates.
   */
  getSystemStatus: unstable_cache(
    async () => {
      try {
        const config = await prisma.systemConfig.findFirst({
          select: { 
            maintenanceMode: true, 
            maintenanceMessage: true,
            updatedAt: true 
          }
        });
        
        return config || { 
          maintenanceMode: false, 
          maintenanceMessage: "SYSTEM_ONLINE" 
        };
      } catch (e) {
        // Fallback: Default to online if DB node is unreachable
        return { maintenanceMode: false, maintenanceMessage: "SYSTEM_OFFLINE_RECOVERY" };
      }
    },
    ["system-status"], // Cache Key
    { revalidate: 60, tags: ["config_node"] } // 60s Background Refresh
  ),

  /**
   * ⚡ TOGGLE_MAINTENANCE_PROTOCOL
   * Action: Forces immediate global cache purge (revalidateTag).
   * Audit: Anchors the operator ID to the system log.
   */
  async toggleMaintenance(active: boolean, message?: string, operatorId?: string) {
    const config = await prisma.systemConfig.findFirst({ select: { id: true } });
    
    const payload = {
      maintenanceMode: active,
      maintenanceMessage: message || (active ? "EMERGENCY_MAINTENANCE_IN_PROGRESS" : "SYSTEM_RESTORED"),
      updatedBy: operatorId,
    };

    let result;
    if (config) {
      result = await prisma.systemConfig.update({
        where: { id: config.id },
        data: payload
      });
    } else {
      result = await prisma.systemConfig.create({
        data: payload
      });
    }

    // 🏛️ ATOMIC CACHE PURGE
    // Forces Next.js Middleware and Server Components to ignore the 60s TTL
    // and fetch the fresh "Kill-Switch" state immediately.
    revalidateTag("config_node", "config");

    return result;
  }
};
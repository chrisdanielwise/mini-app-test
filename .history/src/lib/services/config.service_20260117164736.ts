"use server";

import prisma from "@/lib/db";
import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";

/**
 * 🌊 SYSTEM_CONFIG_SERVICE (v16.16.20 - Hardened)
 * Logic: High-velocity maintenance control with Edge-TTL propagation.
 * Fix: Implements dual-argument revalidateTag for 2026 cache profiles.
 */
export const ConfigService = {
  /**
   * 🔍 GET_SYSTEM_STATUS
   * Architecture: Memoized at the Next.js Data Cache layer.
   * Standard: Revalidates every 60s or on-demand via 'config_node' tag.
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
    ["system-status"],
    { revalidate: 60, tags: ["config_node"] }
  ),

  /**
   * ⚡ TOGGLE_MAINTENANCE_PROTOCOL
   * Action: Forces immediate global cache purge via the 'SYSTEM' profile.
   * Fix: Resolved ts(2554) by providing CACHE_PROFILES.SYSTEM ("config").
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
    // Profile: CACHE_PROFILES.SYSTEM maps to "config"
    // Requirement: Ensures zero-latency propagation to the EmergencyBanner.
    revalidateTag("config_node", CACHE_PROFILES.SYSTEM);

    return result;
  }
};
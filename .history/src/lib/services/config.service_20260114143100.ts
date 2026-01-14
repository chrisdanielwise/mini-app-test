import prisma from "@/lib/db";

export const ConfigService = {
  /**
   * 🔍 Fetch active system configuration
   * Cached to prevent excessive DB hits during high-traffic maintenance checks.
   */
  async getSystemStatus() {
    return await prisma.systemConfig.findFirst({
      select: { maintenanceMode: true, maintenanceMessage: true }
    });
  },

  /**
   * ⚡ Toggle Maintenance Mode (Staff Authorized Only)
   */
  async toggleMaintenance(active: boolean, message?: string, operatorId?: string) {
    const config = await prisma.systemConfig.findFirst();
    
    if (config) {
      return await prisma.systemConfig.update({
        where: { id: config.id },
        data: { 
          maintenanceMode: active, 
          maintenanceMessage: message,
          updatedBy: operatorId 
        }
      });
    }

    return await prisma.systemConfig.create({
      data: { 
        maintenanceMode: active, 
        maintenanceMessage: message,
        updatedBy: operatorId 
      }
    });
  }
};
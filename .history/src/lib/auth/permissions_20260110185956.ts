/**
 * 🛰️ PERMISSION PROTOCOL
 * Centralized logic for mapping MerchantRoles to specific dashboard actions.
 */
export const PERMISSIONS = {
  // Owners can do everything
  MANAGE_TEAM: ["OWNER"],
  DELETE_SERVICE: ["OWNER"],
  
  // Admins can manage operations but not the team
  CREATE_SERVICE: ["OWNER", "ADMIN"],
  VIEW_REVENUE: ["OWNER", "ADMIN"],
  
  // Agents can only handle tickets
  SUPPORT_TICKETS: ["OWNER", "ADMIN", "AGENT"]
};

export function hasPermission(role: string, action: keyof typeof PERMISSIONS) {
  return PERMISSIONS[action].includes(role);
}
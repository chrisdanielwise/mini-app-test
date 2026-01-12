/**
 * 🛰️ PERMISSION PROTOCOL (Universal Tier)
 * Centralized logic for mapping both Platform Roles and Merchant Roles 
 * to specific dashboard actions.
 */

// 🏛️ Platform-Wide Roles (Staff)
export const STAFF_ROLES = ["super_admin", "platform_manager", "platform_support"];

// 🏛️ Merchant-Specific Roles (Cluster)
export const MERCHANT_ROLES = ["owner", "admin", "agent"];

export const PERMISSIONS = {
  // --- PLATFORM LEVEL (Staff Only) ---
  GLOBAL_OVERSIGHT: ["super_admin", "platform_manager"],
  MANAGE_MERCHANTS: ["super_admin", "platform_manager"],
  SYSTEM_CONFIG: ["super_admin"],

  // --- MERCHANT LEVEL (Owner/Admin + Staff Oversight) ---
  MANAGE_TEAM: ["owner", "super_admin"],
  DELETE_SERVICE: ["owner", "super_admin"],
  
  // Operations
  CREATE_SERVICE: ["OWNER", "ADMIN", "super_admin", "platform_manager"],
  VIEW_REVENUE: ["OWNER", "ADMIN", "super_admin", "platform_manager"],
  
  // Support
  SUPPORT_TICKETS: ["OWNER", "ADMIN", "AGENT", "super_admin", "platform_manager", "platform_support"]
};

/**
 * 🛡️ UNIVERSAL CLEARANCE CHECK
 * Logic: Checks if the user's platform role or merchant role grants access.
 */
export function hasPermission(
  userRole: string, 
  action: keyof typeof PERMISSIONS
) {
  // Normalize roles to uppercase/lowercase depending on your DB storage
  const normalizedRole = userRole.toLowerCase();
  const allowedRoles = PERMISSIONS[action];

  // We check both the specific role and the uppercase variant 
  // (to support both platform roles like 'super_admin' and merchant roles like 'OWNER')
  return allowedRoles.some(
    (role) => role.toLowerCase() === normalizedRole || role === userRole
  );
}

/**
 * 🔍 STAFF CHECK
 */
export const isStaff = (role: string) => STAFF_ROLES.includes(role.toLowerCase());
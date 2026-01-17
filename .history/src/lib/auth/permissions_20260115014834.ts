/**
 * 🛰️ PERMISSION PROTOCOL (v16.16.12)
 * Logic: Hierarchical Clearance Mapping.
 * Standard: Inherited permissions to prevent manual array bloat.
 */

// 🏛️ STAFF_HIERARCHY (Amber Flavor)
// Lower index = higher power. super_admin inherits everything below it.
export const STAFF_ROLES = [
  "super_admin", 
  "platform_manager", 
  "platform_support"
] as const;

// 🏛️ MERCHANT_HIERARCHY (Emerald Flavor)
export const MERCHANT_ROLES = [
  "owner", 
  "admin", 
  "agent"
] as const;

export type PlatformRole = typeof STAFF_ROLES[number] | "user";
export type MerchantRole = typeof MERCHANT_ROLES[number];

/**
 * 🔒 PERMISSION_MAP
 * Logic: Defines the MINIMUM role required to perform an action.
 */
const PERMISSION_REQUIREMENTS = {
  // --- PLATFORM_LEVEL ---
  SYSTEM_CONFIG: "super_admin",
  MANAGE_MERCHANTS: "platform_manager",
  PLATFORM_ANALYTICS: "platform_manager",
  SUPPORT_OVERSIGHT: "platform_support",

  // --- MERCHANT_LEVEL ---
  DELETE_SERVICE: "owner",
  MANAGE_TEAM: "owner",
  WITHDRAW_FUNDS: "owner",
  CREATE_SERVICE: "admin",
  MANAGE_PRODUCTS: "admin",
  VIEW_REVENUE: "admin",
  REPLY_TICKETS: "agent",
} as const;

export type AppAction = keyof typeof PERMISSION_REQUIREMENTS;

/**
 * 🛡️ HAS_PERMISSION (Clearance Check)
 * Logic: Verifies if userRole meets or exceeds the required threshold.
 */
export function hasPermission(userRole: string, action: AppAction): boolean {
  const normalizedRole = userRole.toLowerCase();
  const requiredRole = PERMISSION_REQUIREMENTS[action];

  // 1. Check Staff Hierarchy
  const staffIndex = STAFF_ROLES.indexOf(normalizedRole as any);
  const requiredStaffIndex = STAFF_ROLES.indexOf(requiredRole as any);

  // If both roles are staff, check if userRole is higher or equal (lower index)
  if (staffIndex !== -1 && requiredStaffIndex !== -1) {
    return staffIndex <= requiredStaffIndex;
  }

  // 2. Staff Bypass: Staff roles automatically clear all Merchant-level actions
  if (staffIndex !== -1) return true;

  // 3. Check Merchant Hierarchy
  const merchantIndex = MERCHANT_ROLES.indexOf(normalizedRole as any);
  const requiredMerchantIndex = MERCHANT_ROLES.indexOf(requiredRole as any);

  if (merchantIndex !== -1 && requiredMerchantIndex !== -1) {
    return merchantIndex <= requiredMerchantIndex;
  }

  return false;
}

/**
 * 🛰️ UTILITY_GATES
 */
export const isStaff = (role: string) => STAFF_ROLES.includes(role.toLowerCase() as any);
export const isOwner = (role: string) => role.toLowerCase() === "owner" || role.toLowerCase() === "super_admin";
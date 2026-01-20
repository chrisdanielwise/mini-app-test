/**
 * 🛰️ PERMISSION PROTOCOL (Institutional Apex v2026.1.20)
 * Logic: Hierarchical Clearance Mapping with Domain Isolation.
 * Standard: Inherited permissions (Staff Index 0 > 2).
 */

// 🏛️ STAFF_HIERARCHY
// Lower index = higher power.
export const STAFF_ROLES = [
  "super_admin", 
  "platform_manager", 
  "platform_support"
] as const;

// 🏛️ MERCHANT_HIERARCHY
export const MERCHANT_ROLES = [
  "owner", 
  "admin", 
  "agent"
] as const;

export type PlatformRole = typeof STAFF_ROLES[number] | "user";
export type MerchantRole = typeof MERCHANT_ROLES[number];

/**
 * 🔒 PERMISSION_REQUIREMENTS
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

// ✅ FIX: Exported as AppPermission to resolve middleware ts(2724)
export type AppPermission = keyof typeof PERMISSION_REQUIREMENTS;

/**
 * 🛡️ HAS_PERMISSION (Clearance Check)
 * Logic: Verifies if userRole meets or exceeds the required threshold.
 */
export function hasPermission(
  userRole: string | undefined | null, 
  action: AppPermission
): boolean {
  if (!userRole) return false;
  
  const normalizedRole = userRole.toLowerCase();
  const requiredRole = PERMISSION_REQUIREMENTS[action];

  // 1. Staff Hierarchy Resolution
  const staffIndex = STAFF_ROLES.indexOf(normalizedRole as any);
  const requiredStaffIndex = STAFF_ROLES.indexOf(requiredRole as any);

  // If both are staff, lower index wins (Hierarchy Inheritance)
  if (staffIndex !== -1 && requiredStaffIndex !== -1) {
    return staffIndex <= requiredStaffIndex;
  }

  // 2. Staff Universal Clearance: Staff roles bypass all Merchant-level barriers
  if (staffIndex !== -1) return true;

  // 3. Merchant Hierarchy Resolution
  const merchantIndex = MERCHANT_ROLES.indexOf(normalizedRole as any);
  const requiredMerchantIndex = MERCHANT_ROLES.indexOf(requiredRole as any);

  if (merchantIndex !== -1 && requiredMerchantIndex !== -1) {
    return merchantIndex <= requiredMerchantIndex;
  }

  // 4. Default: Access Denied
  return false;
}

/**
 * 🛰️ UTILITY_GATES
 */
export const isStaff = (role: string) => 
  STAFF_ROLES.includes(role.toLowerCase() as any);

export const isOwner = (role: string) => 
  role.toLowerCase() === "owner" || role.toLowerCase() === "super_admin";
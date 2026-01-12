import {
  LayoutDashboard, Package, Users, CreditCard, Settings,
  BarChart3, MessageSquare, Bot, Tag, Wallet, User
} from "lucide-react";

export const NAVIGATION_CONFIG = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["merchant", "super_admin"] },
  { name: "Services", href: "/dashboard/services", icon: Package, roles: ["merchant", "super_admin"] },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Users, roles: ["merchant", "super_admin", "platform_manager"] },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard, roles: ["merchant", "super_admin"] },
  { name: "Payouts", href: "/dashboard/payouts", icon: Wallet, roles: ["merchant", "super_admin"] },
  { name: "Coupons", href: "/dashboard/coupons", icon: Tag, roles: ["merchant", "super_admin"] },
  { name: "Global Support", href: "/dashboard/support", icon: MessageSquare, roles: ["super_admin", "platform_manager", "platform_support", "merchant"] },
  { name: "Bot Config", href: "/dashboard/bot", icon: Bot, roles: ["merchant", "super_admin"] },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["merchant", "super_admin", "platform_manager"] },
  { name: "Business Settings", href: "/dashboard/settings", icon: Settings, roles: ["merchant", "super_admin"] },
  { name: "My Profile", href: "/dashboard/profile", icon: User, roles: ["merchant", "super_admin", "platform_manager", "platform_support"] },
];
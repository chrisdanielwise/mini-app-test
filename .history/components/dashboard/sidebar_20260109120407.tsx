"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  MessageSquare,
  Bot,
  Tag,
  Wallet,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏁 Using your exact Navigation List
const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Services", href: "/dashboard/services", icon: Package },
  { name: "Subscribers", href: "/dashboard/subscribers", icon: Users },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Payouts", href: "/dashboard/payouts", icon: Wallet },
  { name: "Coupons", href: "/dashboard/coupons", icon: Tag },
  { name: "Support", href: "/dashboard/support", icon: MessageSquare },
  { name: "Bot Config", href: "/dashboard/bot", icon: Bot },
  { name: "Business Settings", href: "/dashboard/settings", icon: Settings },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardSidebar({ merchant }: { merchant: any }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
      <div className="flex h-20 items-center gap-3 border-b border-border px-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
          <span className="text-sm font-black text-primary-foreground italic">
            Z
          </span>
        </div>
        <span className="font-black tracking-tighter uppercase text-sm truncate italic">
          {merchant.companyName}
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-tight transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border">
        <div className="rounded-[2rem] bg-card border border-border p-5">
          <p className="text-[10px] font-black text-primary uppercase mb-1">
            Tier: {merchant.planStatus || "Starter"}
          </p>
          <Link
            href="/dashboard/billing"
            className="text-[9px] font-bold underline uppercase"
          >
            Upgrade Suite
          </Link>
        </div>
      </div>
    </aside>
  );
}

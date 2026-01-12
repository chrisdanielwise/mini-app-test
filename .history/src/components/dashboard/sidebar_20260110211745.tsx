"use client";

import { useState, useEffect } from "react";
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
  User,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏁 Unified Navigation Protocol
export const navigation = [
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
  const [isOpen, setIsOpen] = useState(false);

  // 🔒 Auto-close sidebar on mobile after navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 📱 MOBILE OVERLAY TRIGGER: Only visible on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl text-primary"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* 🛰️ UNIFIED COMMAND COLUMN */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/20 bg-background/95 backdrop-blur-2xl transition-transform duration-300 lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header: Identity Node */}
        <div className="flex h-20 items-center gap-3 border-b border-border/10 px-8 shrink-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <span className="text-sm font-black text-primary-foreground italic">Z</span>
          </div>
          <span className="font-black tracking-tighter uppercase text-[10px] truncate italic opacity-80">
            {merchant.companyName || "Merchant_Node"}
          </span>
        </div>

        {/* Navigation: Scoped Logic */}
        <nav className="flex-1 space-y-1 p-6 overflow-y-auto custom-scrollbar">
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
                  "group flex items-center gap-4 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer: Tier Status */}
        <div className="p-6 border-t border-border/10">
          <div className="rounded-[1.5rem] bg-muted/20 border border-border/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">
                Tier: {merchant.planStatus || "Starter"}
              </p>
            </div>
            <Link href="/dashboard/billing" className="text-[9px] font-black underline uppercase opacity-40 hover:opacity-100 transition-opacity">
              Upgrade Suite
            </Link>
          </div>
        </div>
      </aside>

      {/* 📱 MOBILE BACKDROP: Closes sidebar when clicking outside */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300" 
        />
      )}
    </>
  );
}
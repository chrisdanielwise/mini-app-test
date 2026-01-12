"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Clock, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 📱 MOBILE BOTTOM NAV
 * Tier 3: Native-feel navigation for the Telegram Mini App interface.
 */
export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Services",
      href: "/services",
      icon: ShoppingBag,
    },
    {
      label: "History",
      href: "/history",
      icon: Clock,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
      <nav className="mx-auto max-w-md h-16 rounded-[2rem] border border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl flex items-center justify-around px-4 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full group"
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute -top-1 h-1 w-8 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-in slide-in-from-top-1" />
              )}

              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive 
                    ? "text-primary scale-110" 
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              
              <span 
                className={cn(
                  "text-[8px] font-black uppercase tracking-widest mt-1.5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
import {
  Zap,
  Crown,
  LogOut,
  Loader2,
  Activity,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { toast } from "sonner";

export function DashboardSidebar({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const role = (context?.role || "merchant").toLowerCase();
  const themeAmber = flavor === "AMBER";
  const config = context?.config || {};

  const displayName =
    config?.companyName || (themeAmber ? "PLATFORM_ROOT" : "INITIALIZING...");
  const nodeStatus = themeAmber
    ? role.replace("_", " ")
    : config?.planStatus || "Starter";

  const filteredNav = NAVIGATION_CONFIG.filter((item) =>
    item.roles.includes(role)
  );

  if (!isReady) return <div className="flex-1 bg-black animate-pulse" />;

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-full overflow-hidden",
        themeAmber ? "bg-[#050300]" : "bg-zinc-950"
      )}
    >
      {/* --- IDENTITY NODE --- */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 shrink-0 bg-white/[0.01] h-14 leading-none">
        <div
          className={cn(
            "size-8 shrink-0 flex items-center justify-center rounded-lg shadow-lg",
            themeAmber
              ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
              : "bg-primary/10 border-primary/20 text-primary"
          )}
        >
          {role === "super_admin" ? (
            <Crown className="size-4" />
          ) : (
            <Zap className="size-4 fill-current" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className={cn(
              "font-black tracking-[0.25em] uppercase text-[7px] italic",
              themeAmber ? "text-amber-500/40" : "text-primary/40"
            )}
          >
            NODE_v16.apex
          </span>
          <span className="font-black text-[10px] uppercase tracking-tighter text-foreground truncate mt-0.5 italic">
            {displayName}
          </span>
        </div>
      </div>

      {/* --- NAVIGATION: HIGH-DENSITY PROTOCOL --- */}
      <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto scrollbar-none">
        <div className="flex items-center gap-2 mb-4 px-2 opacity-20 italic">
          <Cpu
            className={cn(
              "size-2.5",
              themeAmber ? "text-amber-500" : "text-primary"
            )}
          />
          <p className="text-[7.5px] font-black uppercase tracking-[0.4em]">
            Node_Vector
          </p>
        </div>

        {filteredNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => impact("light")}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                isActive
                  ? themeAmber
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-white/[0.04] text-primary"
                  : "text-muted-foreground/20 hover:bg-white/[0.02] hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "size-3.5 shrink-0 transition-transform group-hover:scale-110",
                  isActive && "animate-pulse"
                )}
              />

              {/* 🖋️ TYPOGRAPHY REFINEMENT: Smaller, tighter, and black-weighted */}
              <span className="text-[9px] font-black uppercase tracking-[0.15em] italic truncate">
                {item.name}
              </span>

              {isActive && (
                <div
                  className={cn(
                    "absolute left-0 w-0.5 h-4 rounded-full",
                    themeAmber ? "bg-amber-500" : "bg-primary"
                  )}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* --- SYSTEM HUD --- */}
      <div
        className="p-4 border-t border-white/5 bg-white/[0.01] space-y-3"
        style={{
          paddingBottom: isMobile
            ? `calc(${safeArea.bottom}px + 1rem)`
            : "1.25rem",
        }}
      >
        <div
          className={cn(
            "rounded-xl border p-3 transition-all",
            themeAmber
              ? "bg-amber-500/[0.02] border-amber-500/10"
              : "bg-white/[0.01] border-white/5"
          )}
        >
          <div className="flex items-center justify-between mb-2 opacity-10 italic">
            <div className="flex items-center gap-1.5">
              <ShieldCheck
                className={cn(
                  "size-2.5",
                  themeAmber ? "text-amber-500" : "text-primary"
                )}
              />
              <p className="text-[7px] font-black uppercase tracking-[0.2em]">
                Oversight_OK
              </p>
            </div>
            <Activity
              className={cn(
                "size-2 animate-pulse",
                themeAmber ? "text-amber-500" : "text-primary"
              )}
            />
          </div>
          <p
            className={cn(
              "text-[9px] font-black uppercase tracking-[0.2em] italic leading-none",
              themeAmber ? "text-amber-500/60" : "text-primary/60"
            )}
          >
            {nodeStatus}
          </p>
        </div>

        <button
          onClick={async () => {
            /* logout logic */
          }}
          className="w-full h-10 flex items-center justify-between px-3 rounded-lg border border-rose-500/10 bg-rose-500/[0.02] text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95 group"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.25em] italic">
            Disconnect_Node
          </span>
          <LogOut className="size-2.5 opacity-20 group-hover:opacity-100" />
        </button>
      </div>
    </aside>
  );
}

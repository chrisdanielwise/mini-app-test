"use client";

import * as React from "react";
import { useEffect } from "react";
import {
  Terminal,
  Crown,
  Activity as ActivityIcon,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional UI & Shell Nodes
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";

// 🏛️ Contexts & Hardware Handshake
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface DashboardClientViewProps {
  session: any;
  children: React.ReactNode; 
}

/**
 * 🛰️ DASHBOARD_CLIENT_VIEW 
 * Strategy: Viewport-Locked Chassis.
 * Mission: Establishes a stationary Command HUD and delegates scroll-control to children.
 */
export function DashboardClientView({
  session,
  children,
}: DashboardClientViewProps) {
  const { impact } = useHaptics();
  const { isReady } = useDeviceContext();

  // 🎭 IDENTITY_RESOLUTION: Unified for Merchant & Staff
  const user = session?.user || session;
  const rawRole = (user?.role || "user").toLowerCase();
  const realMerchantId = user?.merchantId || user?.id;

  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support", "amber"].includes(rawRole);

  useEffect(() => {
    if (isReady) impact("light");
  }, [isReady, impact]);

  // ⏳ HARDWARE_BOOT_SEQUENCE
  if (!isReady)
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-4">
        <Cpu className="size-8 text-primary/20 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">
          Syncing_Hardware_Node...
        </p>
      </div>
    );

  return (
    /* 🏛️ PRIMARY CHASSIS: Locked at 100vh to prevent window-level scroll-fighting */
    <div className="w-full h-screen flex flex-col min-w-0 overflow-hidden text-foreground bg-black relative">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Horizon --- */}
      <div className={cn(
        "shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b pb-4 pt-2 transition-colors duration-1000",
        isPlatformStaff ? "border-amber-500/10" : "border-white/5"
      )}>
        <div className="px-6">
          <DashboardHeader
            title={isPlatformStaff ? "Platform Oversight" : "Merchant Terminal"}
            subtitle={`Node_ID: ${realMerchantId?.slice(0, 8).toUpperCase() || "ROOT_GLOBAL"}`}
          />

          <div className="flex items-center gap-3 mt-3">
            <div className={cn(
              "flex items-center gap-2 px-2 py-0.5 rounded-md border text-[7px] font-black uppercase tracking-[0.3em] shadow-sm",
              isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              {rawRole === "super_admin" ? <Crown className="size-2.5" /> : <ActivityIcon className="size-2.5 animate-pulse" />}
              {rawRole.replace("_", " ")}
            </div>
            
            <div className="flex items-center gap-2 opacity-30">
              <Terminal className="size-3" />
              <p className="text-[7px] font-black uppercase tracking-[0.4em] italic leading-none">
                {isPlatformStaff ? "ROOT_ACCESS_GRANTED" : `ENCRYPTED_NODE: ${realMerchantId?.slice(0, 8)}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🌊 PASSIVE VOLUME: The Reservoir --- 
          The 'flex-1' container makes room for the DashboardPage children.
      */}
      <div className="flex-1 min-h-0 w-full relative">
        <div className="h-full w-full overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
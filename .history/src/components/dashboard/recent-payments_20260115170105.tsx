"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  DollarSign, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Activity,
  ArrowRight
} from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface Payment {
  id: string;
  amount: string;
  currency: string;
  createdAt: string; 
  user: {
    fullName: string | null;
    username: string | null;
  };
  service: {
    name: string;
  } | null;
}

interface RecentPaymentsProps {
  payments: Payment[];
  className?: string;
}

/**
 * 🌊 RECENT_PAYMENTS_LEDGER (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Ingress | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with role-flavored haptics.
 */
export function RecentPayments({ payments, className }: RecentPaymentsProps) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, isMobile, screenSize } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevent Layout Shifting
  if (!isReady) return (
    <div className={cn("h-96 w-full bg-card/20 animate-pulse rounded-[3rem]", className)} />
  );

  return (
    <div className={cn(
      "relative group flex flex-col overflow-hidden border backdrop-blur-3xl shadow-apex transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      "rounded-[3rem] md:rounded-[4rem]",
      isStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-card/30 border-white/5",
      className
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE: Subsurface Role-Based Aura */}
      <div className={cn(
        "absolute -right-32 -top-32 size-80 blur-[140px] opacity-10 pointer-events-none transition-colors duration-[2000ms]",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- HEADER NODE: Terminal Ingress --- */}
      <div className="border-b border-white/5 p-8 md:p-12 flex items-center justify-between bg-white/[0.02] relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4 italic opacity-40">
            {isStaff ? (
              <Globe className="size-4 text-amber-500 animate-pulse" />
            ) : (
              <Activity className="size-4 text-primary animate-pulse" />
            )}
            <div className="flex flex-col">
              <h3 className={cn(
                "text-[10px] font-black uppercase tracking-[0.5em] leading-none",
                isStaff ? "text-amber-500" : "text-foreground"
              )}>
                {isStaff ? "Global_Node_Liquidity" : "Node_Liquidity_Vector"}
              </h3>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1">Audit_Protocol_v16.31</span>
            </div>
          </div>
          <p className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Recent <span className={isStaff ? "text-amber-500" : "text-primary"}>Ledger</span>
          </p>
        </div>
        <div className={cn(
          "size-14 md:size-16 rounded-2xl md:rounded-[1.4rem] flex items-center justify-center shadow-inner border shrink-0 transition-all duration-700 group-hover:rotate-12",
          isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
        )}>
           <DollarSign className="size-8" />
        </div>
      </div>

      {/* --- TRANSACTION STREAM --- */}
      <div className="p-6 md:p-10 relative z-10">
        <div className="space-y-4 md:space-y-6">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
              <div className="size-16 rounded-3xl bg-white/5 mb-8 flex items-center justify-center border border-white/10 opacity-10">
                <Clock className="size-8" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">
                  Awaiting_Sync
                </p>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/10">
                  Institutional_Memory_Isolated
                </p>
              </div>
            </div>
          ) : (
            payments.map((payment, index) => (
              <div
                key={payment.id}
                onMouseEnter={() => impact("light")}
                onClick={() => { selectionChange(); impact("medium"); }}
                style={{ animationDelay: `${index * 60}ms` }}
                className="group/item flex items-center justify-between p-5 md:p-6 rounded-[2rem] transition-all duration-700 border border-transparent hover:border-white/10 hover:bg-white/[0.04] active:scale-[0.97] cursor-pointer animate-in fade-in slide-in-from-bottom-6"
              >
                <div className="flex items-center gap-6 min-w-0">
                  {/* Avatar Node */}
                  <div className="relative shrink-0">
                    <div className={cn(
                      "flex size-14 md:size-16 items-center justify-center rounded-2xl md:rounded-[1.2rem] border text-xl font-black italic shadow-inner transition-all duration-1000 group-hover/item:rotate-6 group-hover/item:bg-white/5",
                      isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                    )}>
                      {(payment.user.fullName || payment.user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-background flex items-center justify-center border border-white/10 shadow-apex">
                      <ShieldCheck className={cn("size-4", isStaff ? "text-amber-500" : "text-primary")} />
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <p className="text-base md:text-lg font-black uppercase italic tracking-tighter leading-none transition-colors group-hover/item:text-foreground truncate text-foreground/80">
                      {payment.user.fullName || payment.user.username || "Legacy_Node"}
                    </p>
                    <div className="flex items-center gap-3 mt-2.5">
                       <span className={cn("size-1.5 rounded-full shrink-0 animate-pulse", isStaff ? "bg-amber-500/40" : "bg-primary/40")} />
                       <p className="text-[9px] md:text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] italic truncate">
                        {payment.service?.name || "Universal_Mesh_Node"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-2.5 shrink-0 ml-6">
                  <p className="text-lg md:text-2xl font-black italic tracking-tighter leading-none text-foreground tabular-nums">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency || 'USD',
                    }).format(parseFloat(payment.amount))}
                  </p>
                  <p className="text-[8px] md:text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] italic whitespace-nowrap">
                    {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- VIEW ALL ACTION --- */}
        {payments.length > 0 && (
          <button 
            onClick={() => impact("medium")}
            className={cn(
              "mt-12 w-full group flex items-center justify-center gap-4 py-6 rounded-[2rem] border transition-all duration-1000",
              isStaff ? "bg-amber-500/5 border-amber-500/10 hover:border-amber-500/40 hover:bg-amber-500/10" : "bg-white/[0.02] border-white/5 hover:border-primary/20 hover:bg-white/[0.05]"
            )}
          >
            <span className={cn(
              "text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] transition-all italic",
              isStaff ? "text-amber-500/40 group-hover:text-amber-500" : "text-muted-foreground/40 group-hover:text-primary"
            )}>
              {isStaff ? "Access_Global_Ledger" : "Full_Telemetry_Stream"}
            </span>
            <ArrowRight className={cn(
              "size-5 transition-all group-hover:translate-x-2",
              isStaff ? "text-amber-500" : "text-primary"
            )} />
          </button>
        )}
      </div>
    </div>
  );
}
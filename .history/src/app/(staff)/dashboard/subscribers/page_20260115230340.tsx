"use client";

import * as React from "react";
import Link from "next/link";
import { 
  MoreHorizontal, Calendar, Zap, Search, Filter, Download, 
  ChevronRight, Terminal, UserPlus, Trash2, Building2, 
  Activity, Globe, Cpu, CheckCircle2, ShieldAlert
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { DashboardShell, DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SubscribersPage({ subscriptions = [], session }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  const isSuperAdmin = flavor === "AMBER";

  // 🛡️ HYDRATION GUARD
  if (!isReady) return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="size-12 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <DashboardShell>
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-4 italic opacity-40">
            <UserPlus className={cn("size-4", isSuperAdmin ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                {isSuperAdmin ? "Global_Network_Hub" : "Merchant_Identity_Hub"}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1">Audit_Protocol_v16.31</span>
            </div>
          </div>
          
          <DashboardHeader 
            title="Subscriber Ledger" 
            subtitle={`Node: ${session?.config?.companyName || "PLATFORM_ROOT"} // Cluster: Verified`}
          />
        </div>

        {/* --- TACTICAL COMMAND HUB --- */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto shrink-0 relative z-20">
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
            <Input 
              onFocus={() => impact("light")}
              placeholder="SEARCH_NODE_ID..." 
              className="h-14 pl-12 pr-6 rounded-2xl border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest italic focus:ring-primary/10 transition-all"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="h-14 px-6 rounded-2xl border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest italic hover:bg-white/10 transition-all">
              <Filter className="mr-3 size-4 opacity-40" /> Filter
            </Button>
            <Button className="h-14 px-6 rounded-2xl bg-primary text-white font-black uppercase italic tracking-[0.2em] text-[10px] shadow-apex hover:scale-[1.02] active:scale-95 transition-all">
              <Download className="mr-3 size-4" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* --- DATA GRID: Fluid Responsive Ingress --- */}
      <div className="mt-12 rounded-[3rem] border border-white/5 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-apex">
        {isMobile ? (
          /* 📱 MOBILE VIEW: Kinetic Identity Nodes */
          <div className="p-6 space-y-6">
            {subscriptions.length === 0 ? <NoData /> : subscriptions.map((sub: any, i: number) => (
              <IdentityCard key={sub.id} sub={sub} isSuperAdmin={isSuperAdmin} index={i} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP VIEW: Institutional Ledger */
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity_Node</th>
                  {isSuperAdmin && <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin</th>}
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol_Status</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Expiry_Horizon</th>
                  <th className="px-10 py-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscriptions.map((sub: any, index: number) => (
                  <tr key={sub.id} className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="size-12 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-primary font-black italic border border-white/5 shadow-inner group-hover:rotate-12 transition-all">
                          {(sub.user.username || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">@{sub.user.username || "node_anon"}</span>
                          <span className="text-[9px] font-mono text-muted-foreground/20 mt-1 uppercase">UID_{sub.user.id.slice(-12)}</span>
                        </div>
                      </div>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest">
                          <Building2 className="size-4" />
                          {sub.service?.merchant?.companyName || "PLATFORM"}
                        </div>
                      </td>
                    )}
                    <td className="px-10 py-8">
                       <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-10 py-8">
                       <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
                         {sub.expiresAt ? format(new Date(sub.expiresAt), "dd MMM yyyy") : "LIFETIME_PROTO"}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-10 rounded-xl bg-white/5 border border-white/5 hover:bg-primary transition-all">
                               <MoreHorizontal className="size-5" />
                            </Button>
                         </DropdownMenuTrigger>
                         {/* Action menu content... */}
                       </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER SIGNAL */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5">
        <Activity className="size-4 animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center">
          Verified_Link_Established // Handshake: Optimal
        </p>
      </div>
    </DashboardShell>
  );
}

/** 🧪 ATOMIC HELPER COMPONENTS */

function IdentityCard({ sub, isSuperAdmin, index }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] space-y-6 shadow-apex animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
           <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary font-black italic border border-white/5">
              {(sub.user.username || "U")[0].toUpperCase()}
           </div>
           <div className="min-w-0">
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground truncate leading-none">@{sub.user.username}</h3>
              <p className="text-[8px] font-black text-muted-foreground/30 uppercase mt-2 italic tracking-[0.2em]">UID_{sub.user.id.slice(-8)}</p>
           </div>
        </div>
        <StatusBadge status={sub.status} />
      </div>
      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
         <div className="space-y-1">
            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/20 italic">Expiry_Horizon</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">{sub.expiresAt ? format(new Date(sub.expiresAt), "MMM dd") : "LIFETIME"}</p>
         </div>
         <Button variant="ghost" size="icon" className="size-10 rounded-xl bg-white/5">
            <ChevronRight className="size-5" />
         </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  return (
    <div className={cn(
      "inline-flex items-center rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border shadow-apex italic",
      isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
    )}>
      <div className={cn("size-1.5 rounded-full mr-2.5 animate-pulse", isActive ? "bg-emerald-500" : "bg-amber-500")} />
      {status}
    </div>
  );
}

function NoData() {
  return (
    <div className="py-32 flex flex-col items-center gap-8 opacity-20 animate-in zoom-in duration-1000">
      <ShieldAlert className="size-20" />
      <p className="text-[14px] font-black uppercase tracking-[0.5em] italic">Zero_Identity_Nodes_Sync</p>
    </div>
  );
}
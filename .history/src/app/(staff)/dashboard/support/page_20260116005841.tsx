"use client";

import * as React from "react";
import { 
  LifeBuoy, Terminal, Search, Zap, 
  Activity, MessageSquare, ShieldCheck, 
  Globe, Clock, ArrowUpRight, Filter,
  Send, User, Cpu
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * 🌊 SUPPORT_PAGE (Institutional Apex v2026.1.16)
 * Strategy: Defensive Session Resolution + Restored Chroma Protocol.
 * Fix: Implements optional chaining on 'session' to prevent runtime crashes.
 */
export default function SupportPage({ session, tickets = [] }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  // 🛡️ ROLE & CHROMA RESOLUTION
  // Fix: Safe-null fallback prevents the 'session.user' crash
  const role = session?.user?.role?.toLowerCase() || "guest"; 
  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = session?.merchantId || "ROOT";

  // 🛡️ CRASH SHIELD: Defensive array evaluation
  const safeTickets = React.useMemo(() => 
    Array.isArray(tickets) ? tickets : [], 
    [tickets]
  );

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-screen bg-black/40 animate-pulse rounded-[3rem]" />;

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto space-y-8 md:space-y-16 pb-24 px-6 md:px-12",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <LifeBuoy className={cn("size-4", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.5em] leading-none",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Global_Support_Terminal" : "Node_Help_Desk"}
              </span>
              <span className="text-[7px] font-mono uppercase tracking-widest mt-1 opacity-50">Audit_v16.31_Stable</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Ticket <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Oversight</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Terminal className={cn("size-3.5", isPlatformStaff ? "text-amber-500/40" : "text-primary/40")} />
            <span className="tracking-[0.2em]">OPERATOR_{role.toUpperCase()}</span>
            <div className="h-px w-8 bg-white/5" />
            <span className="tracking-[0.1em]">{safeTickets.length} active_signals</span>
          </div>
        </div>

        {/* --- TACTICAL COMMAND HUB --- */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto shrink-0 relative z-20">
          <div className="relative flex-1 sm:w-80 group">
            <Search className={cn(
              "absolute left-5 top-1/2 -translate-y-1/2 size-4 transition-colors",
              isPlatformStaff ? "text-amber-500/20 group-focus-within:text-amber-500" : "text-primary/20 group-focus-within:text-primary"
            )} />
            <Input 
              onFocus={() => impact("light")}
              placeholder="SEARCH_TICKETS..."
              className={cn(
                "h-14 pl-12 pr-6 rounded-2xl border bg-black/40 text-[10px] font-black uppercase tracking-widest italic transition-all",
                isPlatformStaff ? "border-amber-500/10 focus:border-amber-500/30" : "border-white/5 focus:border-primary/30"
              )}
            />
          </div>
          <Button 
            className={cn(
              "h-14 px-8 rounded-2xl shadow-2xl font-black uppercase italic tracking-widest text-[10px] transition-all active:scale-95",
              isPlatformStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
            )}
          >
            <MessageSquare className="mr-3 size-4" /> Open_Transmission
          </Button>
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Ledger --- */}
      <div className={cn(
        "rounded-[2.8rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10",
        isPlatformStaff ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        <div className="p-8 md:p-12 space-y-8">
          {safeTickets.length === 0 ? (
            <div className="py-32 flex flex-col items-center gap-6 opacity-10">
              <Cpu className="size-16 animate-pulse" />
              <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">Zero_Support_Packets</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeTickets.map((ticket, index) => (
                <TicketCard key={ticket.id} ticket={ticket} isStaff={isPlatformStaff} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div 
        className="flex items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <Activity className={cn("size-4 animate-pulse", isPlatformStaff ? "text-amber-500" : "text-primary")} />
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center">
          Support_Mesh_Synchronized // Secure_Node: {realMerchantId.slice(0, 8)}
        </p>
      </div>
    </div>
  );
}

/** 📱 ATOMIC: Ticket Node Card */
function TicketCard({ ticket, isStaff, index }: { ticket: any, isStaff: boolean, index: number }) {
  const { impact } = useHaptics();
  return (
    <div 
      onClick={() => impact("light")}
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "p-6 rounded-[2rem] border transition-all duration-700 space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-6 cursor-pointer group",
        isStaff ? "bg-amber-500/[0.03] border-amber-500/10 hover:border-amber-500/30" : "bg-white/[0.01] border-white/5 hover:border-white/10"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={cn(
            "size-10 rounded-xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6",
            isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <User className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[11px] font-black uppercase italic tracking-widest text-foreground leading-none truncate">
              {ticket.subject || "No_Subject"}
            </h3>
            <p className="text-[8px] font-mono text-muted-foreground/30 mt-2 uppercase tracking-widest">
              ID_{ticket.id.slice(-8)}
            </p>
          </div>
        </div>
        <Badge className={cn(
          "rounded-lg text-[7px] font-black uppercase tracking-widest px-2 py-1",
          ticket.status === 'OPEN' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-muted-foreground border-white/10"
        )}>
          {ticket.status}
        </Badge>
      </div>

      <p className="text-[9px] font-bold text-muted-foreground/40 leading-relaxed italic line-clamp-2">
        {ticket.lastMessage || "Awaiting initial signal..."}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 opacity-20">
          <Clock className="size-3" />
          <span className="text-[8px] font-black uppercase">{format(new Date(ticket.updatedAt), "dd MMM")}</span>
        </div>
        <ArrowUpRight className={cn("size-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1", isStaff ? "text-amber-500" : "text-primary")} />
      </div>
    </div>
  );
}
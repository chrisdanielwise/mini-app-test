"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2,
  User,
  Terminal,
  Zap,
  Globe,
  Activity,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface SupportTicket {
  id: string;
  user: {
    fullName: string;
    telegramId: string;
  };
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
  lastMessageSnippet: string;
  merchantNode?: string;
}

/**
 * 🛰️ SUPPORT_TICKET_QUEUE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Hardware Bridge Sync.
 * Integration: Merged Legacy Adaptive Flavor-Shift with Hardened Viewport.
 */
export function SupportTicketQueue({ tickets }: { tickets: SupportTicket[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  const filteredTickets = useMemo(() => 
    tickets.filter(t => 
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.telegramId.includes(searchTerm)
    ), [tickets, searchTerm]);

  // 🛡️ HYDRATION_SHIELD: Prevents "Bogus" layout snaps during mobile ingress
  if (!isReady) return <div className="h-full w-full bg-white/[0.02] border border-white/5 animate-pulse rounded-2xl" />;

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden space-y-4">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Utility Hub --- */}
      <div className={cn(
        "shrink-0 z-30 border backdrop-blur-xl transition-all shadow-2xl",
        "rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4",
        isStaff ? "bg-amber-500/[0.01] border-amber-500/10 shadow-amber-500/5" : "bg-zinc-950/40 border-white/5"
      )}>
        <div className="relative w-full md:max-w-xs lg:max-w-md group">
          <Search className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors",
            isStaff ? "group-focus-within:text-amber-500 text-muted-foreground/20" : "group-focus-within:text-primary text-muted-foreground/20"
          )} />
          <Input 
            onFocus={() => impact("light")}
            placeholder={isStaff ? "QUERY_GLOBAL_NODES..." : "FILTER_TICKETS..."} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
                "pl-10 h-11 rounded-xl border-white/5 bg-zinc-950/60 font-black text-[9px] uppercase tracking-[0.2em] italic",
                isStaff ? "focus:border-amber-500/20" : "focus:border-primary/20"
            )}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={() => impact("light")}
            className="h-11 px-5 rounded-xl border-white/5 bg-white/[0.02] text-[8px] font-black uppercase tracking-widest italic"
          >
            <Filter className="mr-2 size-3.5 opacity-20" /> Filter
          </Button>
          <Button 
            onClick={() => impact("medium")}
            className={cn(
              "flex-1 md:flex-none h-11 px-6 rounded-xl font-black uppercase tracking-widest text-[8px] shadow-lg italic transition-all active:scale-95",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
            )}
          >
            <CheckCircle2 className="mr-2 size-3.5" /> Resolve_Batch
          </Button>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Fault Stream --- */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto scrollbar-hide space-y-3 px-1">
        {filteredTickets.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center opacity-10 italic border-2 border-dashed border-white/5 rounded-3xl">
            <MessageSquare className="size-10 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero_Pending_Faults</p>
          </div>
        ) : (
          filteredTickets.map((ticket, index) => (
            <div 
              key={ticket.id}
              onMouseEnter={() => !isMobile && impact("light")}
              onClick={() => { selectionChange(); }}
              style={{ animationDelay: `${index * 40}ms` }}
              className={cn(
                "group relative overflow-hidden transition-all duration-500 rounded-xl border",
                "bg-zinc-950/40 border-white/5 hover:bg-white/[0.02] py-3.5 px-5 animate-in fade-in slide-in-from-bottom-2 cursor-pointer active:scale-[0.99]",
                ticket.priority === 'CRITICAL' && "border-rose-500/20 bg-rose-500/[0.02]"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 leading-none">
                
                {/* Identity & Content */}
                <div className="flex items-center gap-4 min-w-0">
                   <div className={cn(
                     "size-9 shrink-0 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6",
                     isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                   )}>
                      <User className="size-5" />
                   </div>
                   <div className="flex flex-col min-w-0 gap-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">
                           ID_{ticket.user.telegramId}
                        </span>
                        {isStaff && (
                           <span className="text-[7.5px] font-black uppercase tracking-[0.3em] text-amber-500/40 italic">
                             NODE_{ticket.merchantNode}
                           </span>
                        )}
                        <div className={cn(
                          "flex items-center gap-1.5 text-[7px] font-black uppercase tracking-[0.2em] italic px-1.5 py-0.5 rounded-md",
                          ticket.priority === 'CRITICAL' ? "text-rose-500 bg-rose-500/5 animate-pulse" : "text-muted-foreground/10"
                        )}>
                           {ticket.priority === 'CRITICAL' && <AlertTriangle className="size-2.5" />}
                           {ticket.priority}
                        </div>
                      </div>
                      <h3 className="text-sm md:text-base font-black uppercase italic tracking-tighter text-foreground/80 truncate">
                        {ticket.subject}
                      </h3>
                   </div>
                </div>

                {/* Status & Action */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none border-white/5 pt-3 md:pt-0">
                   <div className="flex items-center gap-3 opacity-20 italic">
                      <Clock className="size-3" />
                      <span className="text-[7.5px] font-black uppercase tracking-[0.2em]">
                        {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                      </span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className={cn(
                       "rounded-md text-[7px] font-black uppercase tracking-[0.1em] px-2 py-1 border italic",
                       getStatusStyles(ticket.status)
                     )}>
                       {ticket.status}
                     </div>
                     <Button variant="ghost" className="h-8 w-8 md:w-auto md:px-3 rounded-lg border border-white/5 text-[8px] font-black uppercase tracking-widest italic hover:text-primary hover:bg-primary/5">
                        <span className="hidden md:inline mr-2">Open</span>
                        <ChevronRight className="size-3.5" />
                     </Button>
                   </div>
                </div>
              </div>

              {ticket.priority === 'CRITICAL' && (
                <div className="absolute top-0 left-0 h-0.5 w-full bg-rose-500 opacity-50 animate-pulse" />
              )}
            </div>
          ))
        )}
      </div>

      {/* --- 🌊 SLIM FOOTER: Mobile Safe Area Sync --- */}
      <div 
        className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-white/5 opacity-10 italic"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "1.25rem" }}
      >
         <div className="flex items-center gap-3">
            {isStaff ? <Globe className="size-3 text-amber-500 animate-pulse" /> : <Zap className="size-3 text-primary animate-pulse" />}
            <p className="text-[7.5px] font-black uppercase tracking-[0.3em]">
              {isStaff ? "Global_Comm-Node_Stability" : "Comm-Node_Stability"}
            </p>
         </div>
         <span className="text-[7.5px] font-mono tabular-nums">[AES_256_STABLE]</span>
      </div>
    </div>
  );
}

/** --- STATUS STYLE PROTOCOLS --- */
function getStatusStyles(status: string) {
  switch (status) {
    case "RESOLVED": return "bg-emerald-500/5 text-emerald-500 border-emerald-500/10";
    case "IN_PROGRESS": return "bg-blue-500/5 text-blue-500 border-blue-500/10";
    case "OPEN": return "bg-amber-500/5 text-amber-500 border-amber-500/10";
    default: return "bg-white/5 text-muted-foreground/30 border-white/5";
  }
}
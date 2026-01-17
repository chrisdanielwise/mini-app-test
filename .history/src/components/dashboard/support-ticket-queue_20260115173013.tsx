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
 * 🌊 SUPPORT_TICKET_QUEUE (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Ingress | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with Priority-Aware Radiance.
 */
export function SupportTicketQueue({ tickets }: { tickets: SupportTicket[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  const filteredTickets = useMemo(() => 
    tickets.filter(t => 
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.telegramId.includes(searchTerm)
    ), [tickets, searchTerm]);

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-[600px] w-full bg-card/20 animate-pulse rounded-[3rem]" />;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* 🌊 COMMAND UTILITY HUB: Morphology-Aware Filtering */}
      <div className={cn(
        "flex flex-col lg:flex-row gap-6 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border backdrop-blur-3xl shadow-apex",
        isStaff ? "bg-amber-500/[0.04] border-amber-500/20 shadow-apex-amber" : "bg-card/30 border-white/5"
      )}>
        <div className="relative w-full lg:max-w-md group">
          <Search className={cn(
            "absolute left-6 top-1/2 -translate-y-1/2 size-5 transition-colors duration-500",
            isStaff ? "group-focus-within:text-amber-500 text-muted-foreground/20" : "group-focus-within:text-primary text-muted-foreground/20"
          )} />
          <Input 
            onFocus={() => impact("light")}
            placeholder={isStaff ? "SEARCH_GLOBAL_NODES..." : "FILTER_BY_TICKET_ID..."} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-16 h-16 rounded-2xl md:rounded-[1.8rem] border bg-white/[0.03] font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-700 italic placeholder:opacity-10",
              isStaff ? "border-amber-500/10 focus:ring-amber-500/5 focus:border-amber-500/40" : "border-white/5 focus:ring-primary/5 focus:border-primary/40"
            )}
          />
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <Button 
            variant="outline" 
            onClick={() => impact("light")}
            className="flex-1 lg:flex-none h-16 px-10 rounded-2xl md:rounded-[1.6rem] border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-white/[0.08]"
          >
            <Filter className="mr-3 size-4 opacity-30" /> Filter_Logs
          </Button>
          <Button 
            onClick={() => impact("medium")}
            className={cn(
              "flex-1 lg:flex-none h-16 px-10 rounded-2xl md:rounded-[1.6rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-apex active:scale-95 transition-all italic",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-white shadow-primary/30"
            )}
          >
            <CheckCircle2 className="mr-3 size-4" /> Resolve_Batch
          </Button>
        </div>
      </div>

      {/* --- FAULT STREAM: Kinetic Item Ingress --- */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {filteredTickets.length === 0 ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[3.5rem] border border-dashed border-white/5 bg-card/20 p-12 text-center backdrop-blur-3xl">
             <div className="mb-10 rounded-[2.5rem] bg-white/[0.03] p-10 border border-white/5 opacity-10">
                <MessageSquare className="size-16" />
             </div>
             <p className="text-[14px] font-black uppercase tracking-[0.6em] opacity-20 italic">Zero_Pending_Faults</p>
          </div>
        ) : (
          filteredTickets.map((ticket, index) => (
            <div 
              key={ticket.id}
              onMouseEnter={() => impact("light")}
              onClick={() => { selectionChange(); }}
              style={{ animationDelay: `${index * 60}ms` }}
              className={cn(
                "group relative overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-apex hover:translate-y-[-4px]",
                "rounded-[3rem] md:rounded-[3.5rem] border",
                isStaff ? "bg-amber-500/[0.03] border-amber-500/10 hover:border-amber-500/30" : "bg-card/40 border-white/5 hover:border-primary/30",
                "animate-in fade-in slide-in-from-bottom-8",
                isMobile ? "p-8" : "p-10"
              )}
            >
              {/* 🌫️ VAPOUR RADIANCE: Priority Energy Aura */}
              {ticket.priority === 'CRITICAL' && (
                <div className="absolute -top-16 -right-16 size-48 bg-rose-500/10 blur-[80px] animate-pulse pointer-events-none" />
              )}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                
                {/* User Identity & Subject */}
                <div className="flex items-start gap-6 md:gap-8 min-w-0">
                   <div className={cn(
                     "size-16 md:size-20 shrink-0 rounded-[1.4rem] md:rounded-[1.8rem] flex items-center justify-center shadow-inner border transition-all duration-1000 group-hover:rotate-6",
                     isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                   )}>
                      <User className="size-8 md:size-10" />
                   </div>
                   <div className="space-y-3 min-w-0">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                           ID_{ticket.user.telegramId}
                        </span>
                        {isStaff && (
                          <Badge variant="outline" className="bg-amber-500/5 border-amber-500/20 text-amber-500 text-[8px] font-black tracking-widest px-2 py-0.5">
                            NODE_{ticket.merchantNode}
                          </Badge>
                        )}
                        <div className={cn(
                          "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] italic px-2 py-0.5 rounded-lg",
                          ticket.priority === 'CRITICAL' ? "text-rose-500 bg-rose-500/5 animate-pulse" : "text-muted-foreground/20"
                        )}>
                           {ticket.priority === 'CRITICAL' && <AlertTriangle className="size-3" />}
                           {ticket.priority}_PRIORITY
                        </div>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none group-hover:text-foreground transition-colors truncate text-foreground/80">
                        {ticket.subject}
                      </h3>
                      <p className="text-[12px] font-bold text-muted-foreground/30 line-clamp-1 italic tracking-[0.1em] mt-1">
                        "{ticket.lastMessageSnippet}"
                      </p>
                   </div>
                </div>

                {/* Meta Data & Terminal Action */}
                <div className="flex items-center justify-between lg:flex-col lg:items-end gap-6 pt-8 lg:pt-0 border-t lg:border-t-0 border-white/5">
                   <Badge className={cn(
                     "rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 border shadow-apex italic transition-all duration-700",
                     getStatusStyles(ticket.status)
                   )}>
                     {ticket.status}
                   </Badge>
                   <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
                      <div className="flex items-center gap-3 text-muted-foreground/20 italic">
                         <Clock className="size-4" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] tabular-nums">
                           {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                         </span>
                      </div>
                      <Button variant="ghost" className={cn(
                        "rounded-[1.4rem] h-14 w-full lg:w-auto px-8 text-[11px] font-black uppercase tracking-[0.3em] border transition-all active:scale-95 italic group/btn",
                        isStaff ? "border-amber-500/10 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/5" : "border-white/5 hover:border-primary hover:text-primary hover:bg-primary/5"
                      )}>
                        Open_Signal_Node <ChevronRight className="ml-3 size-5 group-hover/btn:translate-x-2 transition-transform duration-700" />
                      </Button>
                   </div>
                </div>
              </div>

              {/* 🚨 CRITICAL FAULT LINE */}
              {ticket.priority === 'CRITICAL' && (
                <div className="absolute top-0 left-0 h-2 w-full bg-rose-500 shadow-apex-rose animate-pulse pointer-events-none" />
              )}
            </div>
          ))
        )}
      </div>

      {/* --- TELEMETRY WATERMARK --- */}
      <div 
        className="flex items-center justify-between px-8 py-6 opacity-10 italic border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : '1.5rem' }}
      >
         <div className="flex items-center gap-4">
            {isStaff ? <Globe className="size-4 text-amber-500 animate-pulse" /> : <Activity className="size-4 text-primary animate-pulse" />}
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground">
              {isStaff ? "Global_Mesh_Stability: Platform_Audit" : "Comm-Link_Stability: Active_Node"}
            </p>
         </div>
         <span className="text-[8px] font-mono tabular-nums">[v16.16.31_STABLE]</span>
      </div>
    </div>
  );
}

/** --- STATUS STYLE PROTOCOLS --- */
function getStatusStyles(status: string) {
  switch (status) {
    case "RESOLVED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5";
    case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5";
    case "OPEN": return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5";
    default: return "bg-white/5 text-muted-foreground/40 border-white/10";
  }
}
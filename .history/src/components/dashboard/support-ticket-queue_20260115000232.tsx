"use client";

import * as React from "react";
import { useState } from "react";
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
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

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
 * 🌊 FLUID TICKET QUEUE (v16.16.12)
 * Logic: Haptic-synced fault scrubbing with Priority-Aware Radiance.
 * Design: v9.9.1 Hardened Glassmorphism with Momentum Ingress.
 */
export function SupportTicketQueue({ tickets }: { tickets: SupportTicket[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const isStaff = flavor === "AMBER";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* 🌊 COMMAND UTILITY HUB: Atmospheric Filtering */}
      <div className={cn(
        "flex flex-col lg:flex-row gap-6 p-8 rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700",
        isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/30 border-white/5 shadow-black/20"
      )}>
        <div className="relative w-full lg:max-w-md group">
          <Search className={cn(
            "absolute left-5 top-1/2 -translate-y-1/2 size-4 transition-colors",
            isStaff ? "group-focus-within:text-amber-500 text-muted-foreground/30" : "group-focus-within:text-primary text-muted-foreground/30"
          )} />
          <Input 
            onFocus={() => impact("light")}
            placeholder={isStaff ? "SEARCH_GLOBAL_TICKETS..." : "FILTER_BY_TICKET_ID..."} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-14 h-14 rounded-2xl md:rounded-[1.5rem] border font-black text-[10px] uppercase tracking-[0.25em] transition-all duration-500 italic placeholder:opacity-20",
              isStaff ? "bg-amber-500/5 border-amber-500/20 focus:ring-amber-500/10" : "bg-white/5 border-white/10 focus:ring-primary/10"
            )}
          />
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <Button 
            variant="outline" 
            onClick={() => impact("light")}
            className="flex-1 lg:flex-none h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest italic"
          >
            <Filter className="mr-3 size-4 opacity-40" /> Filter_Logs
          </Button>
          <Button 
            onClick={() => impact("medium")}
            className={cn(
              "flex-1 lg:flex-none h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all italic",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/40"
            )}
          >
            <CheckCircle2 className="mr-3 size-4" /> Resolve_Nodes
          </Button>
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Ticket Stream --- */}
      <div className="grid grid-cols-1 gap-6">
        {tickets.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/5 bg-card/20 p-12 text-center backdrop-blur-3xl shadow-inner">
             <div className="mb-8 rounded-[2rem] bg-white/5 p-6 border border-white/10 opacity-20">
                <MessageSquare className="size-10 text-muted-foreground" />
             </div>
             <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-20 italic">Zero_Pending_Comm-Nodes</p>
          </div>
        ) : (
          tickets.map((ticket, index) => (
            <div 
              key={ticket.id}
              onMouseEnter={() => impact("light")}
              onClick={() => { selectionChange(); }}
              style={{ animationDelay: `${index * 50}ms` }}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] border p-8 md:p-10 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-2xl active:scale-[0.99] cursor-pointer animate-in fade-in slide-in-from-bottom-4",
                isStaff ? "bg-amber-500/[0.02] border-amber-500/10 hover:border-amber-500/30" : "bg-card/40 border-white/5 hover:border-primary/30"
              )}
            >
              {/* 🌊 PRIORITY RADIANCE: Urgent Energy Vector */}
              {ticket.priority === 'CRITICAL' && (
                <div className="absolute -top-12 -right-12 size-32 bg-rose-500/10 blur-[60px] animate-pulse" />
              )}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                
                {/* User Identity & Subject */}
                <div className="flex items-start gap-6 min-w-0">
                   <div className={cn(
                     "size-14 md:size-16 shrink-0 rounded-[1.25rem] md:rounded-2xl flex items-center justify-center shadow-inner border transition-all duration-700 group-hover:rotate-6",
                     isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                   )}>
                      <User className="size-7" />
                   </div>
                   <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">
                           ID_{ticket.user.telegramId}
                        </span>
                        {isStaff && (
                          <>
                            <div className="size-1 rounded-full bg-amber-500/20 shrink-0" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500 italic">
                               NODE_{ticket.merchantNode}
                            </span>
                          </>
                        )}
                        <div className="size-1 rounded-full bg-white/5 shrink-0" />
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-[0.3em] italic",
                          ticket.priority === 'CRITICAL' ? "text-rose-500 animate-pulse" : "text-muted-foreground/30"
                        )}>
                           {ticket.priority}_PRIORITY
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors truncate text-foreground/90">
                        {ticket.subject}
                      </h3>
                      <p className="text-[11px] font-medium text-muted-foreground/40 line-clamp-1 italic tracking-wide">
                        "{ticket.lastMessageSnippet}"
                      </p>
                   </div>
                </div>

                {/* Meta Data & Terminal Action */}
                <div className="flex items-center justify-between lg:flex-col lg:items-end gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5">
                   <Badge className={cn(
                     "rounded-xl text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 border shadow-xl italic",
                     getStatusStyles(ticket.status)
                   )}>
                     {ticket.status}
                   </Badge>
                   <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2 text-muted-foreground/20 italic">
                         <Clock className="size-3.5" />
                         <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                           {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                         </span>
                      </div>
                      <Button variant="ghost" className={cn(
                        "rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 italic group/btn",
                        isStaff ? "border-amber-500/20 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/5" : "border-white/10 hover:border-primary hover:text-primary hover:bg-primary/5"
                      )}>
                        Open_Node <ChevronRight className="ml-3 size-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                   </div>
                </div>
              </div>

              {/* 🚨 CRITICAL FAULT LINE */}
              {ticket.priority === 'CRITICAL' && (
                <div className="absolute top-0 left-0 h-1.5 w-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse pointer-events-none" />
              )}
            </div>
          ))
        )}
      </div>

      {/* --- TELEMETRY WATERMARK --- */}
      <div className="flex items-center gap-3 px-6 opacity-10 italic">
         {isStaff ? <Globe className="size-3.5 text-amber-500 animate-pulse" /> : <Zap className="size-3.5 text-primary" />}
         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground">
           {isStaff ? "Global_Comm-Node_Stability: Platform_Audit" : "Comm-Node_Stability: Active_Monitoring"}
         </p>
      </div>
    </div>
  );
}

/** --- STATUS STYLE PROTOCOLS --- */
function getStatusStyles(status: string) {
  switch (status) {
    case "RESOLVED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
    case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]";
    case "OPEN": return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
    default: return "bg-muted text-muted-foreground border-white/5";
  }
}
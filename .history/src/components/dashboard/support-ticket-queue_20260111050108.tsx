"use client";

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
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hapticFeedback } from "@/lib/telegram/webapp";

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
}

/**
 * 🛰️ SUPPORT TICKET QUEUE (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive Safe-Zones and institutional haptics for mobile staff.
 */
export function SupportTicketQueue({ tickets }: { tickets: SupportTicket[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-w-0">
      
      {/* --- UTILITY OVERRIDE BAR --- */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-center justify-between bg-card/40 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-border/40 backdrop-blur-3xl shadow-xl">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="FILTER BY TICKET_ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/10 border-border/40 font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] focus:ring-primary/20 transition-all placeholder:opacity-30"
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Button 
            variant="outline" 
            onClick={() => hapticFeedback("light")}
            className="flex-1 lg:flex-none h-12 md:h-14 px-4 md:px-8 rounded-xl md:rounded-2xl border-border/40 bg-muted/5 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-muted/20 active:scale-95 transition-all"
          >
            <Filter className="mr-2 h-3.5 w-3.5" /> Filter
          </Button>
          <Button 
            onClick={() => hapticFeedback("medium")}
            className="flex-1 lg:flex-none h-12 md:h-14 px-4 md:px-8 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl shadow-primary/20 bg-primary text-primary-foreground active:scale-95 transition-all"
          >
            <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Resolve
          </Button>
        </div>
      </div>

      {/* --- TICKET GRID --- */}
      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <div className="flex min-h-[350px] md:h-[400px] flex-col items-center justify-center rounded-2xl md:rounded-[3rem] border border-dashed border-border/10 bg-card/20 p-8 md:p-12 text-center backdrop-blur-3xl shadow-inner">
             <div className="mb-6 rounded-xl md:rounded-[2rem] bg-muted/30 p-5 border border-border/10">
                <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground/20" />
             </div>
             <h3 className="text-sm font-black uppercase italic tracking-tighter opacity-40">
                Zero Pending Comm-Nodes
             </h3>
             <p className="max-w-[200px] text-[8px] md:text-[9px] font-black text-muted-foreground uppercase leading-tight mt-3 opacity-20 tracking-widest">
                Support channels are stable. No intervention required.
             </p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => hapticFeedback("selection")}
              className="group relative overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-border/40 bg-card/40 p-5 md:p-8 backdrop-blur-3xl transition-all duration-500 hover:border-primary/30 hover:shadow-2xl active:scale-[0.99] cursor-default"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                
                {/* User Identity & Subject */}
                <div className="flex items-start gap-4 md:gap-5 min-w-0">
                   <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner transition-all group-hover:scale-105">
                      <User className="h-5 w-5 md:h-6 md:w-6" />
                   </div>
                   <div className="space-y-1.5 md:space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40 italic">
                           ID_{ticket.user.telegramId}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-border opacity-30" />
                        <span className={cn(
                          "text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] italic",
                          ticket.priority === 'CRITICAL' ? "text-rose-500 animate-pulse" : "text-primary/60"
                        )}>
                           {ticket.priority}_PRIORITY
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors truncate">
                        {ticket.subject}
                      </h3>
                      <p className="text-[10px] md:text-[11px] font-medium text-muted-foreground line-clamp-1 opacity-60 italic">
                        "{ticket.lastMessageSnippet}"
                      </p>
                   </div>
                </div>

                {/* Meta Data & Action */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:gap-4 border-t md:border-t-0 border-border/10 pt-4 md:pt-0">
                   <Badge className={cn(
                     "rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 md:px-3 py-1 border shadow-sm",
                     getStatusStyles(ticket.status)
                   )}>
                     {ticket.status}
                   </Badge>
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-muted-foreground/30 mb-2 md:mb-3">
                         <Clock className="h-3 w-3 shrink-0" />
                         <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest italic">
                           {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                         </span>
                      </div>
                      <Button variant="ghost" className="rounded-lg md:rounded-xl h-9 md:h-10 px-4 md:px-5 text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-border/20 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all active:scale-95 whitespace-nowrap">
                        Open Node <ChevronRight className="ml-2 h-3 w-3 md:h-3.5 md:w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </div>
                </div>
              </div>

              {/* High Friction Visual Overlay */}
              {ticket.priority === 'CRITICAL' && (
                <div className="absolute top-0 right-0 h-1 w-full bg-rose-500 animate-pulse opacity-20 pointer-events-none" />
              )}
            </div>
          ))
        )}
      </div>

      {/* --- STATUS OVERLAY --- */}
      <div className="flex items-center gap-2 px-4 opacity-20 italic">
         <Zap className="h-2.5 w-2.5 text-primary" />
         <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">
           Comm-Node_Stability: Active_Monitoring
         </p>
      </div>
    </div>
  );
}

/** --- STATUS STYLE MAPPING --- */
function getStatusStyles(status: string) {
  switch (status) {
    case "RESOLVED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]";
    case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)]";
    case "OPEN": return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
    default: return "bg-muted text-muted-foreground border-border/40";
  }
}
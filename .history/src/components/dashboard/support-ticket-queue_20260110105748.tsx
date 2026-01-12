"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  User,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/src/components/ui/input";

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
 * 🛰️ SUPPORT TICKET QUEUE (Tier 2)
 * High-resiliency communication hub for managing user feedback loops.
 */
export function SupportTicketQueue({ tickets }: { tickets: SupportTicket[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- UTILITY OVERRIDE BAR --- */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between bg-card/40 p-6 rounded-[2rem] border border-border/40 backdrop-blur-2xl shadow-xl">
        <div className="relative w-full xl:w-[450px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="FILTER BY TICKET_ID OR USER..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-2xl bg-muted/10 border-border/40 font-black text-[10px] uppercase tracking-[0.2em] focus:ring-primary/20 transition-all placeholder:opacity-30"
          />
        </div>
        <div className="flex gap-3 w-full xl:w-auto">
          <Button variant="outline" className="flex-1 xl:flex-none h-14 px-8 rounded-2xl border-border/40 bg-muted/5 text-[10px] font-black uppercase tracking-[0.15em] hover:bg-muted/20">
            <Filter className="mr-2 h-4 w-4" /> Filter Priority
          </Button>
          <Button className="flex-1 xl:flex-none h-14 px-8 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] shadow-2xl shadow-primary/20 bg-primary text-primary-foreground">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Batch Resolve
          </Button>
        </div>
      </div>

      {/* --- TICKET GRID --- */}
      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-[3rem] border border-dashed border-border/40 bg-card/20 p-12 text-center backdrop-blur-xl">
             <div className="mb-6 rounded-[2rem] bg-muted/30 p-5 border border-border/40">
                <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
             </div>
             <h3 className="text-sm font-black uppercase italic tracking-tighter">
                No Tickets in Queue
             </h3>
             <p className="max-w-[180px] text-[10px] font-bold text-muted-foreground uppercase leading-tight mt-2 opacity-50 tracking-widest">
                Support channels are stable. No user intervention required.
             </p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div 
              key={ticket.id}
              className="group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/40 p-8 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                
                {/* User Identity & Subject */}
                <div className="flex items-start gap-5">
                   <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0 transition-transform group-hover:scale-110">
                      <User className="h-6 w-6" />
                   </div>
                   <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 italic">
                           ID: {ticket.user.telegramId}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">
                           {ticket.priority}_PRIORITY
                        </span>
                      </div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                        {ticket.subject}
                      </h3>
                      <p className="text-[11px] font-medium text-muted-foreground line-clamp-1 opacity-70">
                        "{ticket.lastMessageSnippet}"
                      </p>
                   </div>
                </div>

                {/* Meta Data & Action */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-4 border-t md:border-t-0 border-border/40 pt-4 md:pt-0">
                   <Badge variant="outline" className={cn(
                     "rounded-lg text-[8px] font-black uppercase tracking-[0.15em] px-3 py-1.5 border shadow-sm",
                     getStatusStyles(ticket.status)
                   )}>
                     {ticket.status}
                   </Badge>
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-muted-foreground/40 mb-3">
                         <Clock className="h-3 w-3" />
                         <span className="text-[9px] font-black uppercase tracking-widest">
                           {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                         </span>
                      </div>
                      <Button variant="ghost" className="rounded-xl h-10 px-5 text-[9px] font-black uppercase tracking-[0.2em] border border-border/40 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                        Open Node <ChevronRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </div>
                </div>
              </div>

              {/* Background Status Pulse for High Priority */}
              {ticket.priority === 'CRITICAL' && (
                <div className="absolute top-0 right-0 h-2 w-full bg-rose-500 animate-pulse opacity-50" />
              )}
            </div>
          ))
        )}
      </div>

      {/* --- STATUS OVERLAY --- */}
      <div className="flex items-center gap-3 px-6 opacity-30">
         <Terminal className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
           Communication protocols are monitored for compliance.
         </p>
      </div>
    </div>
  );
}

/**
 * 🛠️ STATUS STYLE MAPPING
 */
function getStatusStyles(status: string) {
  switch (status) {
    case "RESOLVED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "OPEN": return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
    default: return "bg-muted text-muted-foreground border-border/40";
  }
}
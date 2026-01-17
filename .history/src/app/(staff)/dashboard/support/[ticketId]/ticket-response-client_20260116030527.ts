"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ArrowLeft, Terminal, User, Send, Bot, History, 
  Globe, ShieldCheck, AlertCircle, Building2 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Contexts & UI
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function TicketResponseClient({ ticket, isPlatformStaff, role }: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea, viewportHeight } = useDeviceContext();

  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-6xl mx-auto transition-all duration-1000 animate-in fade-in slide-in-from-bottom-12",
        viewportHeight < 700 ? "space-y-6" : "space-y-10 md:space-y-14"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "1rem",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: isMobile ? "1.25rem" : "2rem",
        paddingRight: isMobile ? "1.25rem" : "2rem"
      }}
    >
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-6 md:items-end md:flex-row md:justify-between border-b border-white/5 pb-8 relative group">
        <div className="space-y-4">
          <Link
            href="/dashboard/support"
            onClick={() => selectionChange()}
            className="group inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all italic"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            SUPPORT_LEDGER
          </Link>

          <div className="flex flex-wrap items-center gap-5">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none text-foreground">
              Ticket <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Resolution</span>
            </h1>
            <Badge variant="outline" className="rounded-xl text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 border-white/5 bg-white/5 text-muted-foreground italic shadow-lg">
              NODE_ID: {ticket.id.slice(0, 8).toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        
        {/* --- LEFT: IDENTITY MANIFEST --- */}
        <div className="space-y-8">
           <div className={cn(
             "rounded-[2.5rem] border p-8 backdrop-blur-3xl shadow-2xl space-y-8 transition-all duration-700",
             isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-white/[0.01] border-white/5"
           )}>
              <div className="flex items-center gap-3 text-muted-foreground/30">
                 <User className="size-4" />
                 <h3 className="text-[11px] font-black uppercase tracking-[0.4em] leading-none italic">Identity_Node</h3>
              </div>

              <div className="space-y-8">
                 <div className="flex items-center gap-6">
                    <div className={cn(
                      "size-12 md:size-16 shrink-0 rounded-2xl flex items-center justify-center text-xl font-black italic border shadow-inner transition-transform hover:rotate-6",
                      isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                    )}>
                       {(ticket.user?.username || "U")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                       <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter truncate leading-none text-foreground">
                         @{ticket.user?.username || "unknown_node"}
                       </p>
                       <div className="flex items-center gap-2 mt-2 opacity-30 italic">
                          <Building2 className="size-3" />
                          <p className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase leading-none truncate">
                            {ticket.merchantId ? `CLUSTER_${ticket.merchantId.slice(-6).toUpperCase()}` : "GLOBAL_HUB"}
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5 space-y-5">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-[0.3em]">Protocol_Status</span>
                       <Badge className={cn(
                         "rounded-xl text-[10px] font-black uppercase px-4 py-1 border-none shadow-md",
                         ticket.status === 'OPEN' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                       )}>
                         {ticket.status}
                       </Badge>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                       <span className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-[0.3em] shrink-0">Priority</span>
                       <span className={cn(
                        "text-[11px] font-black uppercase italic tracking-[0.2em] truncate text-right",
                        ticket.priority === 'URGENT' ? "text-rose-500" : "text-foreground"
                       )}>
                        {ticket.priority}
                       </span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Role Context Notification */}
           {!isPlatformStaff && (
              <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-8 space-y-3 shadow-xl animate-pulse">
                <div className="flex items-center gap-3 text-amber-500">
                   <AlertCircle className="size-4" />
                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em] leading-none">Oversight_Mode</h4>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest italic">
                  Resolution is managed by <span className="text-amber-500">Platform_Hub</span>. Merchant nodes are in audit-only state.
                </p>
              </div>
           )}
        </div>

        {/* --- RIGHT: RESOLUTION CONSOLE --- */}
        <div className="lg:col-span-2 space-y-8">
           <div className="rounded-[2.8rem] border border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
              <div className="p-8 md:p-10 border-b border-white/5 bg-white/[0.01]">
                 <div className="flex items-center gap-3 mb-4 opacity-30">
                    <History className="size-4" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground leading-none italic">Inquiry_Manifest</h3>
                 </div>
                 <div className="space-y-6">
                    <p className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">{ticket.subject}</p>
                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 italic text-sm md:text-base text-foreground/70 leading-relaxed shadow-inner">
                       {ticket.description || "MANIFEST_EMPTY: No textual telemetry provided."}
                    </div>
                 </div>
              </div>

              {/* Input Area: Gated by isPlatformStaff */}
              <div className="p-8 md:p-12 space-y-8">
                 {isPlatformStaff ? (
                   <>
                     <div className="flex items-center gap-3 opacity-30">
                        <Terminal className="size-4" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground leading-none italic">Response_Console</h3>
                     </div>

                     <div className="space-y-4">
                        <Textarea 
                           onFocus={() => impact("light")}
                           placeholder="EXECUTE RESPONSE PROTOCOL..."
                           className="min-h-[200px] rounded-[2rem] border-white/5 bg-white/5 p-8 font-bold text-sm leading-relaxed focus:ring-primary/20 transition-all resize-none shadow-inner text-foreground placeholder:text-muted-foreground/10"
                        />
                        <div className="flex items-center justify-between gap-4 px-2">
                           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-20 italic">
                             Signal formatting and markdown supported.
                           </p>
                           <div className="flex items-center gap-3">
                             <ShieldCheck className="size-3.5 text-primary opacity-40" />
                             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/40 italic">Clearance: {role.toUpperCase()}</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-4">
                        <Button 
                          onClick={() => impact("medium")}
                          className={cn(
                            "w-full h-16 rounded-[1.5rem] font-black uppercase italic tracking-[0.4em] text-xs shadow-2xl transition-all active:scale-95 group",
                            isPlatformStaff ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground"
                          )}
                        >
                           <Send className="mr-3 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                           Deploy_Command
                        </Button>
                     </div>
                   </>
                 ) : (
                   <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 opacity-10">
                      <Bot className="size-20" />
                      <p className="text-sm font-black uppercase tracking-[0.5em] italic max-w-sm leading-relaxed">
                         Terminal_Locked: Access restricted to Platform_Core nodes.
                      </p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div className="flex items-center justify-center gap-5 opacity-10 py-12">
        <Globe className="size-4 text-muted-foreground" />
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
          Resolution Core synchronized // Node_ID: {ticket.id.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
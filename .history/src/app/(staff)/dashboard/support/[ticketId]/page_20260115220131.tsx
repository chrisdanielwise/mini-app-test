"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ArrowLeft, Terminal, User, Send, Bot, History, 
  Globe, ShieldCheck, AlertCircle, Building2, 
  Activity, Cpu, Lock, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

/**
 * 🌊 TICKET_RESOLUTION_TERMINAL (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Ingress | Obsidian-OLED Depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
 */
export default function TicketResponsePage({ ticket, session }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { 
    isReady, 
    isMobile, 
    screenSize, 
    safeArea, 
    isPortrait 
  } = useDeviceContext();

  // 🛡️ IDENTITY RESOLUTION
  const { role } = session.user;
  const isPlatformStaff = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="size-12 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1400px] mx-auto space-y-10 md:space-y-16 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.5rem" : "0px",
        paddingRight: isMobile ? "1.5rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <Link
            href="/dashboard/support"
            onClick={() => selectionChange()}
            className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 hover:text-primary transition-all duration-700 italic"
          >
            <ArrowLeft className="size-3 group-hover:-translate-x-2 transition-transform duration-700" />
            Support_Ledger
          </Link>

          <div className="flex flex-wrap items-center gap-6">
            <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
              Ticket <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Resolution</span>
            </h1>
            <Badge variant="outline" className="rounded-xl text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 border-white/5 bg-white/[0.02] text-muted-foreground/60 italic shadow-apex">
              NODE_ID: {ticket.id.slice(0, 8).toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        
        {/* --- LEFT: IDENTITY MANIFEST --- */}
        <div className="space-y-8">
           <div className="rounded-[3rem] border border-white/5 bg-card/30 p-8 md:p-10 backdrop-blur-3xl shadow-apex relative overflow-hidden group">
              <div className="flex items-center gap-4 text-muted-foreground/40 mb-10 opacity-40 italic">
                 <User className="size-4" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">Identity_Node</h3>
              </div>

              <div className="space-y-10">
                 <div className="flex items-center gap-6">
                    <div className={cn(
                      "size-14 md:size-16 shrink-0 rounded-2xl flex items-center justify-center text-xl font-black italic border shadow-inner transition-all duration-700 group-hover:rotate-12",
                      isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                    )}>
                       {(ticket.user?.username || "U")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                       <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground leading-none truncate">
                         @{ticket.user?.username || "NODE_ANON"}
                       </p>
                       <div className="flex items-center gap-2 mt-3 opacity-20 italic">
                          <Building2 className="size-3.5" />
                          <p className="text-[9px] font-black tracking-[0.2em] uppercase leading-none">
                            {ticket.merchantId ? `CLUSTER_${ticket.merchantId.slice(-8).toUpperCase()}` : "GLOBAL_HUB"}
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-white/5 space-y-5">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-[0.4em] italic">Protocol_Status</span>
                       <Badge className={cn(
                          "rounded-xl text-[10px] font-black uppercase px-4 py-1.5 border-none italic shadow-apex",
                          ticket.status === 'OPEN' ? "bg-amber-500/10 text-amber-500 shadow-apex-amber" : "bg-emerald-500/10 text-emerald-500 shadow-apex-emerald"
                       )}>
                          <div className={cn("size-1.5 rounded-full mr-2.5 animate-pulse", ticket.status === 'OPEN' ? "bg-amber-500" : "bg-emerald-500")} />
                          {ticket.status}
                       </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-[0.4em] italic">Priority</span>
                       <span className={cn(
                         "text-[10px] font-black uppercase italic tracking-[0.2em]",
                         ticket.priority === 'URGENT' ? "text-rose-500 animate-pulse" : "text-foreground/60"
                       )}>
                        {ticket.priority}
                       </span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Role Context Notification */}
           {!isPlatformStaff && (
              <div className="rounded-[2.5rem] border border-amber-500/20 bg-amber-500/[0.03] p-8 space-y-4 shadow-apex animate-in slide-in-from-left-4 duration-1000">
                <div className="flex items-center gap-4 text-amber-500">
                   <AlertCircle className="size-5 animate-bounce" />
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] italic leading-none">Oversight_Mode</h4>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground/30 leading-relaxed uppercase tracking-[0.2em] italic">
                  Resolution managed by <span className="text-amber-500/60">Platform_Hub</span>. Merchant nodes are in audit-only telemetry state.
                </p>
              </div>
           )}

           <div className="flex flex-col items-center gap-6 py-6 opacity-10 italic">
              <div className="flex items-center gap-4">
                 <Cpu className="size-4" />
                 <p className="text-[9px] font-black uppercase tracking-[0.5em]">Mesh_Broadcasting_Active</p>
              </div>
              <div className="flex items-center gap-3">
                 <Activity className="size-3 animate-pulse text-primary" />
                 <span className="text-[8px] font-mono tabular-nums">[AUTH_SYNC_v16.31]</span>
              </div>
           </div>
        </div>

        {/* --- RIGHT: RESOLUTION CONSOLE --- */}
        <div className="lg:col-span-2 space-y-8">
           <div className="rounded-[3rem] border border-white/5 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-apex transition-all duration-1000">
              <div className="p-8 md:p-12 border-b border-white/5 bg-white/[0.01]">
                 <div className="flex items-center gap-4 mb-8 opacity-40 italic">
                    <History className="size-4 text-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">Inquiry_Manifest</h3>
                 </div>
                 <div className="space-y-6">
                    <p className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">{ticket.subject}</p>
                    <div className="p-8 rounded-[2rem] bg-zinc-950/40 border border-white/5 italic text-[12px] md:text-sm text-foreground/60 leading-relaxed shadow-inner font-medium">
                       {ticket.description || "MANIFEST_EMPTY: No textual telemetry provided."}
                    </div>
                 </div>
              </div>

              {/* Input Area: Adaptive Gating */}
              <div className="p-8 md:p-12 space-y-10 relative">
                 {isPlatformStaff ? (
                   <>
                     <div className="flex items-center gap-4 opacity-40 italic">
                        <Terminal className="size-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">Response_Console</h3>
                     </div>

                     <div className="space-y-6">
                        <Textarea 
                           onFocus={() => impact("light")}
                           placeholder="EXECUTE_RESPONSE_PROTOCOL..."
                           className="min-h-[220px] md:min-h-[280px] rounded-[2.5rem] border-white/5 bg-white/[0.02] p-8 font-bold text-xs md:text-sm tracking-widest leading-relaxed focus:ring-primary/10 transition-all resize-none shadow-apex text-foreground/80 placeholder:text-muted-foreground/20"
                        />
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/10 italic">
                              Markdown_Signals_Encrypted
                           </p>
                           <div className="flex items-center gap-4">
                              <ShieldCheck className="size-4 text-primary opacity-20" />
                              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/30 italic">Clearance: {role.toUpperCase()}</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-4">
                        <Button 
                          onClick={() => impact("heavy")}
                          className="w-full h-16 md:h-20 rounded-[1.8rem] md:rounded-[2.2rem] bg-primary text-white font-black uppercase italic tracking-[0.4em] text-[11px] md:text-xs shadow-apex-primary hover:scale-[1.01] active:scale-95 transition-all duration-500 group"
                        >
                           <Send className="mr-4 size-5 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 duration-700" />
                           Deploy_Command_Signal
                        </Button>
                     </div>
                   </>
                 ) : (
                   <div className="py-24 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-1000">
                      <div className="relative">
                        <Bot className="size-20 text-muted-foreground/10" />
                        <Lock className="absolute -bottom-2 -right-2 size-8 text-rose-500/20" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-black uppercase tracking-[0.5em] italic text-foreground/20 leading-none">
                           Terminal_Isolated
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/10">
                           Access restricted to Platform_Core nodes.
                        </p>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
         <Globe className="size-4" />
         <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
           Resolution_Core_Synchronized // Node_Ref_{ticket.id.toUpperCase()}
         </p>
      </div>
    </div>
  );
}
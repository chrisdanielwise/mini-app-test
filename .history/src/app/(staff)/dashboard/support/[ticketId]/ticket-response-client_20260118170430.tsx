"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ArrowLeft, Terminal, User, Send, Bot, History, 
  Globe, ShieldCheck, AlertCircle, Building2, Activity, Cpu 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

/**
 * 🛰️ TICKET_RESOLUTION_CLIENT (Institutional Apex v2026.1.20 - HARDENED)
 * Strategy: Viewport-Locked Chassis & Hardware Ingress.
 * Fix: Stationed HUD + Internal Tactical Scroll + border-r for vertical lines.
 */
export default function TicketResponseClient({ ticket, isPlatformStaff, role }: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  if (!isReady) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
      <Cpu className="size-8 text-primary/20 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Establishing_Support_Link...</p>
    </div>
  );

  return (
    /* 🏛️ PRIMARY CHASSIS: Locked at 100% height to anchor the Stationary Header */
    <div className="absolute inset-0 flex flex-col min-w-0 overflow-hidden bg-black text-foreground">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Layer (shrink-0) --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            <Link
              href="/dashboard/support"
              onClick={() => {
                impact("light");
                selectionChange();
              }}
              className="group inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 hover:text-primary transition-all italic leading-none mb-1"
            >
              <ArrowLeft className="size-2.5 group-hover:-translate-x-1 transition-transform" />
              BACK_TO_SUPPORT_LEDGER
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate max-w-full">
                Ticket <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Resolution</span>
              </h1>
              <Badge variant="outline" className="rounded-lg text-[7px] font-black uppercase tracking-[0.1em] px-2 py-0.5 border-white/5 bg-white/5 text-muted-foreground/40 italic leading-none">
                NODE_ID: {ticket.id.slice(0, 8).toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: flex-1 + min-h-0 triggers independent scroll --- */}
      <div className="flex-1 min-h-0 w-full relative overflow-y-auto custom-scrollbar overscroll-contain px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- LEFT: IDENTITY MANIFEST --- */}
          <div className="space-y-6">
            <div className={cn(
              "rounded-[1.8rem] border backdrop-blur-3xl shadow-2xl relative overflow-hidden group",
              isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
            )}>
              {/* 🏁 ETCHED HEADER: Identity Section */}
              <div className="flex items-center gap-2.5 border-b border-white/5 p-6 opacity-40">
                <User className="size-3.5" />
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] leading-none italic">Identity_Node</h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "size-10 md:size-12 shrink-0 rounded-xl flex items-center justify-center text-lg font-black italic border shadow-inner transition-transform group-hover:rotate-6",
                    isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                  )}>
                    {(ticket.user?.username || "U")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <p className="text-lg font-black uppercase italic tracking-tighter truncate text-foreground">
                      @{ticket.user?.username || "unknown_node"}
                    </p>
                    <div className="flex items-center gap-2 mt-1 opacity-20 italic">
                      <Building2 className="size-3" />
                      <p className="text-[7px] font-mono font-bold tracking-[0.1em] uppercase leading-none truncate">
                        {ticket.merchantId ? `CLUSTER_${ticket.merchantId.slice(-6).toUpperCase()}` : "GLOBAL_HUB"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4 rounded-b-xl overflow-hidden divide-y divide-white/5">
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[7px] font-black uppercase text-muted-foreground/20 tracking-[0.2em] italic">Protocol_Status</span>
                    <Badge className={cn(
                      "rounded-md text-[6px] font-black uppercase px-2 py-0.5 border-none shadow-sm",
                      ticket.status === 'OPEN' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center gap-4 py-3">
                    <span className="text-[7px] font-black uppercase text-muted-foreground/20 tracking-[0.2em] italic">Priority</span>
                    <span className={cn(
                      "text-[8px] font-black uppercase italic tracking-[0.1em] truncate text-right",
                      ticket.priority === 'URGENT' ? "text-rose-500" : "text-foreground opacity-40"
                    )}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {!isPlatformStaff && (
              <div className="rounded-[1.5rem] border border-amber-500/10 bg-amber-500/5 p-6 space-y-2 shadow-xl">
                <div className="flex items-center gap-2 text-amber-500">
                  <AlertCircle className="size-3.5 animate-pulse" />
                  <h4 className="text-[8px] font-black uppercase tracking-[0.2em] leading-none italic">Oversight_Active</h4>
                </div>
                <p className="text-[8px] font-bold text-muted-foreground/40 leading-relaxed uppercase tracking-widest italic">
                  Resolution managed by <span className="text-amber-500">Platform_Hub</span>. Audit-only state.
                </p>
              </div>
            )}
          </div>

          {/* --- RIGHT: RESOLUTION CONSOLE --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[2.2rem] border border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
              {/* Inquiry Manifest Section */}
              <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-2.5 mb-4 opacity-20">
                  <History className="size-3.5" />
                  <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground leading-none italic">Inquiry_Manifest</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none text-foreground">{ticket.subject}</p>
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 italic text-[11px] md:text-xs text-foreground/50 leading-relaxed shadow-inner">
                    {ticket.description || "MANIFEST_EMPTY: No textual telemetry provided."}
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-6 md:p-10 space-y-6">
                {isPlatformStaff ? (
                  <>
                    <div className="flex items-center gap-2.5 opacity-20">
                      <Terminal className="size-3.5" />
                      <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground leading-none italic">Response_Console</h3>
                    </div>

                    <div className="space-y-3">
                      <Textarea 
                        onFocus={() => impact("light")}
                        placeholder="EXECUTE RESPONSE PROTOCOL..."
                        className="min-h-[160px] rounded-[1.5rem] border-white/5 bg-black/20 p-6 font-bold text-xs leading-relaxed focus:ring-primary/10 transition-all resize-none shadow-inner text-foreground placeholder:opacity-10"
                      />
                      <div className="flex items-center justify-between gap-4 px-1">
                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-10 italic leading-none">
                          Markdown supported // Signal formatting active.
                        </p>
                        <div className="flex items-center gap-2 opacity-20 italic">
                          <ShieldCheck className="size-3 text-primary" />
                          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-primary">Clearance: {role.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        onClick={() => impact("heavy")}
                        className={cn(
                          "w-full h-12 rounded-xl font-black uppercase italic tracking-[0.3em] text-[10px] shadow-2xl transition-all active:scale-95 group",
                          isPlatformStaff ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-primary text-primary-foreground"
                        )}
                      >
                        <Send className="mr-2.5 size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        Deploy_Command
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 opacity-10">
                    <Bot className="size-12 animate-pulse" />
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] italic max-w-[200px] leading-relaxed">
                      Terminal_Locked: Access restricted to Platform_Core nodes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 🌫️ MOBILE CLEARANCE: Ensures command signals clear the BottomNav */}
        {isMobile && (
          <div 
            style={{ height: `calc(${safeArea.bottom}px + 6.5rem)` }} 
            className="shrink-0 w-full" 
          />
        )}

        {/* --- FOOTER SIGNAL --- */}
        <div className="flex items-center justify-center gap-4 opacity-10 pt-4 pb-4">
          <Activity className={cn("size-3.5 animate-pulse", isPlatformStaff ? "text-amber-500" : "text-primary")} />
          <p className="text-[7px] font-black uppercase tracking-[0.5em] text-foreground italic text-center leading-none">
            Resolution Core synchronized // Node: {role.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ShieldCheck, MessageSquare, Terminal, Search, User, 
  Globe, ChevronRight, Crown, Building2, AlertCircle, 
  Activity, ArrowUpRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

/**
 * 🛰️ SUPPORT_CLIENT_PAGE (Institutional Apex v2026.1.20)
 * Strategy: Stationary HUD & Independent Tactical Scroll.
 * Fix: High-density row compression and stationary header protocol.
 */
export default function SupportClientPage({ 
  initialTickets = [], isPlatformStaff, isSuperAdmin, role, realMerchantId 
}: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  const contextLabel = isSuperAdmin 
    ? "System_Root_Oversight" 
    : isPlatformStaff 
      ? "Central_Intervention_Node" 
      : "Merchant_Audit_Trail";

  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground bg-black">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 italic opacity-30">
               <div className={cn(
                 "p-1 rounded-md border shadow-inner",
                 isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
               )}>
                 {isSuperAdmin ? <Crown className="size-3" /> : 
                  isPlatformStaff ? <ShieldCheck className="size-3" /> :
                  <MessageSquare className="size-3" />}
               </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.4em] leading-none",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {contextLabel}
              </span>
            </div>
            
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
              Support <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Desk</span>
            </h1>
            
            <div className="flex items-center gap-2 text-[7px] font-black text-muted-foreground/20 italic uppercase tracking-[0.2em]">
              <Terminal className="size-2.5" />
              <span>Identity: {role.toUpperCase()} // Signal: {initialTickets.length > 0 ? 'Active_Queue' : 'Idle'}</span>
            </div>
          </div>

          <div className="relative min-w-0 w-48 md:w-64 lg:w-80 group shrink-0 scale-90 origin-bottom-right">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
             <Input 
               placeholder="FILTER TELEMETRY..." 
               className="h-10 w-full pl-10 rounded-xl border-white/5 bg-white/5 font-black text-[9px] uppercase tracking-widest focus:ring-primary/20"
             />
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Fleet Grid --- */}
      <div className="flex-1 min-h-0 w-full relative flex flex-col px-6 pt-4 pb-6">
        <div className={cn(
          "flex-1 w-full rounded-[1.5rem] border backdrop-blur-3xl shadow-2xl bg-card/40 flex flex-col overflow-hidden",
          isPlatformStaff ? "border-amber-500/10" : "border-white/5"
        )}>
          {/* 🛡️ THE SCROLL ENGINE */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar">
            <Table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <TableHeader className="bg-white/[0.04] border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[30%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Identity Node</TableHead>
                  {isPlatformStaff && <TableHead className="w-[18%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-amber-500/30 italic">Origin Cluster</TableHead>}
                  <TableHead className="w-[35%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Manifest / Subject</TableHead>
                  <TableHead className="w-[17%] px-6 py-2.5 text-right text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Protocol</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody className="divide-y divide-white/5">
                {initialTickets.length === 0 ? (
                  <TableRow className="border-none">
                    <TableCell colSpan={isPlatformStaff ? 4 : 3} className="py-24 text-center opacity-10">
                       <AlertCircle className="size-12 mx-auto mb-4 animate-pulse" />
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Protocol_Queue_Clear</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  initialTickets.map((ticket: any) => (
                    <TableRow 
                      key={ticket.id} 
                      onMouseEnter={() => impact("light")}
                      className="hover:bg-white/[0.01] transition-colors border-none group"
                    >
                      <TableCell className="px-6 py-3.5">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={cn(
                            "size-9 shrink-0 rounded-lg flex items-center justify-center text-md font-black italic border shadow-inner transition-transform group-hover:rotate-12",
                            isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                          )}>
                            {(ticket.user?.username || "U")[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0 leading-tight">
                            <p className="font-black text-foreground uppercase italic tracking-tighter text-sm group-hover:text-primary transition-colors truncate">
                              @{ticket.user?.username || 'anon_node'}
                            </p>
                            <p className="text-[6px] font-mono font-bold text-muted-foreground/20 uppercase mt-0.5 truncate">
                              UID: {ticket.user?.id ? ticket.user.id.slice(-8).toUpperCase() : 'SYSTEM'}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {isPlatformStaff && (
                        <TableCell className="px-6 py-3.5">
                          <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[9px] truncate">
                            <Building2 className="size-3.5 shrink-0" />
                            <span className="truncate">
                              {ticket.merchantId ? `CLUSTER_${ticket.merchantId.slice(-6).toUpperCase()}` : "GLOBAL"}
                            </span>
                          </div>
                        </TableCell>
                      )}

                      <TableCell className="px-6 py-3.5">
                         <div className="space-y-0.5 leading-tight">
                            <p className="font-black text-sm uppercase italic tracking-tight text-foreground truncate max-w-[280px]">
                              {ticket.subject || "NO_SUBJECT_MANIFEST"}
                            </p>
                            <p className="text-[7px] font-black text-muted-foreground/20 uppercase tracking-widest italic flex items-center gap-1.5">
                              <Activity className="size-2.5" />
                              Signal: {ticket.messages[0] ? new Date(ticket.messages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </p>
                         </div>
                      </TableCell>

                      <TableCell className="px-6 py-3.5 text-right">
                         <Button 
                          asChild 
                          variant="ghost" 
                          onClick={() => selectionChange()}
                          className={cn(
                            "h-8 px-4 rounded-lg font-black uppercase italic text-[8px] tracking-widest border transition-all active:scale-95 group/btn",
                            isPlatformStaff 
                              ? "bg-amber-500/5 text-amber-500 border-amber-500/10 hover:bg-amber-500 hover:text-black" 
                              : "bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white"
                          )}
                         >
                           <Link href={`/dashboard/support/${ticket.id}`} className="flex items-center gap-2">
                             {isPlatformStaff ? "INTERVENE" : "AUDIT"}
                             <ArrowUpRight className="size-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                           </Link>
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="shrink-0 flex items-center justify-center gap-4 opacity-10 pt-8 pb-12">
        <Terminal className="size-3.5" />
        <p className="text-[7px] font-black uppercase tracking-[0.5em] text-foreground italic">
           Support Cluster Synchronized // Node: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : 'ROOT_MASTER'}
        </p>
      </div>
    </div>
  );
}
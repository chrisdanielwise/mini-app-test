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

export default function SupportClientPage({ 
  initialTickets = [], isPlatformStaff, isSuperAdmin, role, realMerchantId 
}: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea, viewportHeight } = useDeviceContext();

  const contextLabel = isSuperAdmin 
    ? "System_Root_Oversight" 
    : isPlatformStaff 
      ? "Central_Intervention_Node" 
      : "Merchant_Audit_Trail";

  // 🛡️ Prevent layout snapping
  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000",
        viewportHeight < 700 ? "space-y-6" : "space-y-10 md:space-y-14"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0px",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: isMobile ? "1.25rem" : "2rem",
        paddingRight: isMobile ? "1.25rem" : "2rem"
      }}
    >
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8 relative group">
        <div className="space-y-4">
          <div className="flex items-center gap-3 italic opacity-40">
             <div className={cn(
               "p-1.5 rounded-lg border shadow-inner transition-colors duration-500",
               isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
             )}>
               {isSuperAdmin ? <Crown className="size-4" /> : 
                isPlatformStaff ? <ShieldCheck className="size-4" /> :
                <MessageSquare className="size-4" />}
             </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
              isPlatformStaff ? "text-amber-500" : "text-primary"
            )}>
              {contextLabel}
            </span>
          </div>
          
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Support <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Desk</span>
          </h1>
          
          <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground/30 italic uppercase tracking-[0.2em]">
            <Terminal className="size-3" />
            <span>Identity: {role.toUpperCase()} // Signal: {initialTickets.length > 0 ? 'Active_Queue' : 'Idle'}</span>
          </div>
        </div>

        <div className="relative min-w-0 sm:w-80 group shrink-0">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
           <Input 
             placeholder="FILTER TELEMETRY..." 
             className="h-12 w-full pl-12 rounded-2xl border-white/5 bg-white/5 font-black text-[10px] uppercase tracking-widest focus:ring-primary/20"
           />
        </div>
      </div>

      {/* --- DATA GRID LEDGER --- */}
      <div className={cn(
        "rounded-[2.8rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10",
        isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        <div className="overflow-x-auto scrollbar-hide">
          <Table className="w-full text-left border-collapse min-w-[1000px]">
            <TableHeader className="bg-white/[0.02] border-b border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity Node</TableHead>
                {isPlatformStaff && <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin Cluster</th>}
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Manifest / Subject</th>
                <th className="px-10 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol</th>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-white/5">
              {initialTickets.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={isPlatformStaff ? 4 : 3} className="py-40 text-center opacity-10">
                    <div className="flex flex-col items-center gap-4">
                       <AlertCircle className="size-16 animate-pulse" />
                       <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">Protocol_Queue_Clear</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                initialTickets.map((ticket: any) => (
                  <TableRow 
                    key={ticket.id} 
                    onMouseEnter={() => impact("light")}
                    className="hover:bg-white/[0.02] transition-all duration-500 group border-none"
                  >
                    <TableCell className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "size-12 shrink-0 rounded-2xl flex items-center justify-center text-lg font-black italic border shadow-inner transition-transform group-hover:rotate-12",
                          isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {(ticket.user?.username || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-sm group-hover:text-primary transition-colors leading-none">
                            @{ticket.user?.username || 'anon_node'}
                          </p>
                          <p className="text-[8px] font-mono font-bold text-muted-foreground/20 uppercase mt-2">
                            UID: {ticket.user?.id ? ticket.user.id.slice(-12).toUpperCase() : 'SYSTEM_NODE'}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {isPlatformStaff && (
                      <TableCell className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest leading-none">
                          <Building2 className="size-4" />
                          <span className="truncate max-w-[140px]">
                            {ticket.merchantId ? `CLUSTER_${ticket.merchantId.slice(-6).toUpperCase()}` : "GLOBAL_HUB"}
                          </span>
                        </div>
                      </TableCell>
                    )}

                    <TableCell className="px-10 py-8">
                       <div className="space-y-1.5">
                          <p className="font-black text-sm uppercase italic tracking-tight text-foreground truncate max-w-[300px]">
                            {ticket.subject || "NO_SUBJECT_MANIFEST"}
                          </p>
                          <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest italic flex items-center gap-2">
                            <Activity className="size-2.5" />
                            Last Signal: {ticket.messages[0] ? new Date(ticket.messages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                          </p>
                       </div>
                    </TableCell>

                    <TableCell className="px-10 py-8 text-right">
                       <Button 
                        asChild 
                        variant="ghost" 
                        onClick={() => selectionChange()}
                        className={cn(
                          "h-11 px-6 rounded-xl font-black uppercase italic text-[10px] tracking-widest border transition-all active:scale-95 group/btn shadow-lg",
                          isPlatformStaff 
                            ? "bg-amber-500/5 text-amber-500 border-amber-500/10 hover:bg-amber-500 hover:text-black shadow-amber-500/5" 
                            : "bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white shadow-primary/5"
                        )}
                       >
                         <Link href={`/dashboard/support/${ticket.id}`} className="flex items-center gap-3">
                           {isPlatformStaff ? "INTERVENE" : "AUDIT"}
                           <ArrowUpRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
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

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center justify-center gap-5 opacity-10 py-16">
        <Terminal className="size-4" />
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-foreground italic">
           Support Cluster Synchronized // Node: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : 'ROOT_MASTER'}
        </p>
      </div>
    </div>
  );
}
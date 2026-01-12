import { requireStaff } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  ShieldCheck, MessageSquare, Terminal, Search, User, Globe, ChevronRight, Crown, Building2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

/**
 * 🛰️ CENTRALIZED SUPPORT LEDGER (Institutional v9.4.3)
 * Fix: Dynamic RBAC Filter prevents crash on 'null' merchantId for Super Admins.
 * Fix: Null-safe UID resolution for high-density node identification.
 */
export default async function SupportPage() {
  const session = await requireStaff();
  
  // 🛡️ 1. IDENTITY PROTOCOLS
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isSuperAdmin = role === "super_admin";
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 2. DATA INGRESS: Dynamic Protocol Filter
  // If Staff, we fetch all. If Merchant, we strictly filter by their ID.
  const whereClause = isPlatformStaff ? {} : { merchantId: realMerchantId };

  const tickets = await prisma.ticket.findMany({
    where: whereClause,
    include: { 
      user: { 
        select: { username: true, fullName: true, id: true } 
      },
      // Note: Removed 'merchant' include as per schema handshake constraints.
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const contextLabel = isSuperAdmin 
    ? "System_Root_Oversight" 
    : isPlatformStaff 
      ? "Central_Intervention_Node" 
      : "Merchant_Audit_Trail";

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-8 text-foreground">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg border shadow-inner transition-colors duration-500",
              isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              {isSuperAdmin ? <Crown className="h-4 w-4" /> : 
               isPlatformStaff ? <ShieldCheck className="h-4 w-4" /> :
               <MessageSquare className="h-4 w-4" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic opacity-60">
              {contextLabel}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none">
              Support <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Desk</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic">
               Identity: {role.toUpperCase()} // Signal: {tickets.length > 0 ? 'Active_Queue' : 'Idle'}
            </p>
          </div>
        </div>

        <div className="relative min-w-0 sm:w-64 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="FILTER TELEMETRY..."
            className="h-10 w-full pl-10 rounded-xl border-border/40 bg-card/40 font-bold text-[9px] uppercase tracking-widest focus:ring-primary/20"
          />
        </div>
      </div>

      {/* --- UNIFIED DATA LEDGER --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <Table className="w-full text-left border-collapse min-w-[900px]">
            <TableHeader className="bg-muted/30 border-b border-border/10">
              <TableRow className="hover:bg-transparent border-none"> 
                <TableHead className="px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Identity Node</TableHead>
                {isPlatformStaff && <TableHead className="px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Origin Cluster</TableHead>}
                <TableHead className="px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Manifest / Subject</TableHead>
                <TableHead className="px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Protocol</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-border/10">
              {tickets.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={isPlatformStaff ? 4 : 3} className="h-40 text-center opacity-20">
                    <div className="flex flex-col items-center gap-2">
                       <AlertCircle className="h-6 w-6" />
                       <p className="text-xs font-black uppercase italic tracking-widest">Protocol queue clear.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-muted/20 border border-border/10 flex items-center justify-center font-black italic text-primary/40 group-hover:scale-105 transition-transform shadow-inner">
                          {(ticket.user?.username || "U")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black uppercase italic text-sm truncate group-hover:text-primary transition-colors">
                            @{ticket.user?.username || 'anon_node'}
                          </p>
                          <p className="text-[8px] font-mono font-bold text-muted-foreground/40 mt-1 uppercase tracking-tighter">
                            UID: {ticket.user?.id ? ticket.user.id.slice(-12) : 'SYSTEM'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {isPlatformStaff && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                          <Building2 className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-black uppercase italic tracking-widest truncate max-w-[120px]">
                            {ticket.merchantId ? `CLUSTER_${ticket.merchantId.slice(-6).toUpperCase()}` : "GLOBAL_HUB"}
                          </span>
                        </div>
                      </td>
                    )}

                    <td className="px-6 py-4">
                       <p className="font-bold text-xs uppercase tracking-tight text-foreground/70 truncate italic leading-none">
                         {ticket.subject || "NO_SUBJECT_MANIFEST"}
                       </p>
                       <p className="text-[8px] font-bold text-muted-foreground/30 uppercase mt-2 tracking-widest">
                          Last Signal: {ticket.messages[0] ? new Date(ticket.messages[0].createdAt).toLocaleTimeString() : 'N/A'}
                       </p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button 
                        asChild 
                        variant="ghost" 
                        className={cn(
                          "h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95",
                          isPlatformStaff 
                            ? "bg-amber-500/5 text-amber-500 border-amber-500/10 hover:bg-amber-500 hover:text-black" 
                            : "bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white"
                        )}
                      >
                        <Link href={`/dashboard/support/${ticket.id}`} className="flex items-center gap-2">
                          {isPlatformStaff ? "Intervene" : "Audit"}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
         <Terminal className="h-3 w-3" />
         <p className="text-[8px] font-black uppercase tracking-[0.4em] italic leading-none">
           Support Cluster Synchronized // Node: {realMerchantId ? realMerchantId.slice(0, 8) : 'ROOT_MASTER'}
         </p>
      </div>
    </div>
  );
}
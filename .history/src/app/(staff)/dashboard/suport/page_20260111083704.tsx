import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  ShieldCheck, MessageSquare, Terminal, Search, User, Globe, ChevronRight, Crown, LifeBuoy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * 🛰️ CENTRALIZED SUPPORT LEDGER (Tactical Medium)
 * RBAC: Super Admin (100), Platform Manager (80), Platform Support (40), Merchant (10)
 */
export default async function SupportPage() {
  const session = await requireMerchantSession();
  const { role, merchantId } = session.user;

  // 🛡️ 1. IDENTITY CLUSTER MAPPING
  const isSuperAdmin = role === "super_admin";
  const isPlatformManager = role === "platform_manager";
  const isPlatformSupport = role === "platform_support";
  
  // Platform Staff includes anyone above Merchant level
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 2. DATA INGRESS: Multi-Tier Filtering
  const tickets = await prisma.ticket.findMany({
    where: isPlatformStaff ? {} : { merchantId: merchantId },
    include: { 
      user: { select: { username: true, id: true } },
      merchant: { select: { companyName: true } } 
    },
    orderBy: { createdAt: 'desc' }
  });

  // UI Context Labels
  const contextLabel = isSuperAdmin 
    ? "System_Root_Oversight" 
    : isPlatformManager 
      ? "Global_Platform_Moderation" 
      : isPlatformSupport 
        ? "Central_Intervention_Node" 
        : "Merchant_Audit_Trail";

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-8">
      
      {/* --- COMMAND HUD HEADER: TACTICAL SYNC --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg border shadow-inner",
              isSuperAdmin ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : 
              isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : 
              "bg-primary/10 border-primary/20 text-primary"
            )}>
              {isSuperAdmin ? <Crown className="h-4 w-4" /> : 
               isPlatformManager ? <ShieldCheck className="h-4 w-4" /> :
               isPlatformSupport ? <LifeBuoy className="h-4 w-4" /> :
               <MessageSquare className="h-4 w-4" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic opacity-60">
              {contextLabel}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Support <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Desk</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic">
               Clearance: <span className="text-foreground">{role.replace('_', ' ')}</span> // Active_Tickets: {tickets.length}
            </p>
          </div>
        </div>

        {/* Global Search Cluster */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full lg:w-auto shrink-0">
          <div className="relative min-w-0 sm:w-64 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30" />
            <Input 
              placeholder={isPlatformStaff ? "SEARCH ALL NODES..." : "SEARCH INQUIRIES..."}
              className="h-10 md:h-11 w-full pl-10 rounded-xl border-border/40 bg-card/40 font-bold text-[9px] uppercase tracking-widest focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* --- UNIFIED DATA LEDGER --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <Table className="w-full text-left border-collapse min-w-[900px]">
            <TableHeader className="bg-muted/30 border-b border-border/10">
              <TableRow className="hover:bg-transparent border-none"> 
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Identity Node</TableHead>
                {isPlatformStaff && (
                  <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Cluster Origin</TableHead>
                )}
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Manifest</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none text-right">Protocol</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-border/10 text-foreground">
              {tickets.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={isPlatformStaff ? 4 : 3} className="h-40 text-center opacity-20">
                    <p className="text-xs font-black uppercase italic tracking-widest">Protocol queue clear. Node state: Idle.</p>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-primary/[0.02] transition-colors group border-none">
                    {/* Identity Node */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-lg bg-muted/20 border border-border/10 flex items-center justify-center text-muted-foreground">
                          <User className="h-4 w-4" />
                        </div>
                        <p className="font-black uppercase italic text-sm leading-none truncate group-hover:text-primary transition-colors">
                          @{ticket.user?.username || 'anon_node'}
                        </p>
                      </div>
                    </TableCell>

                    {/* Cluster Origin (Platform Staff Only) */}
                    {isPlatformStaff && (
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <Globe className="h-3 w-3 text-amber-500/40" />
                           <span className="text-[10px] font-black uppercase tracking-wider text-foreground/50">
                             {ticket.merchant?.companyName || "ROOT_NODE"}
                           </span>
                        </div>
                      </TableCell>
                    )}

                    {/* Subject Manifest */}
                    <TableCell className="px-6 py-4 max-w-xs">
                       <p className="font-bold text-xs uppercase tracking-tight text-foreground/70 truncate italic">
                         {ticket.subject}
                       </p>
                    </TableCell>

                    {/* Action Entry */}
                    <TableCell className="px-6 py-4 text-right">
                      <Button 
                        asChild 
                        variant="ghost" 
                        className={cn(
                          "h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
                          isPlatformStaff 
                            ? "bg-amber-500/5 text-amber-500 border-amber-500/10 hover:bg-amber-500 hover:text-black" 
                            : "bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white"
                        )}
                      >
                        <Link href={`/dashboard/support/${ticket.id}`} className="flex items-center gap-2">
                          {isPlatformStaff ? "Intervene" : "Audit"}
                          <ChevronRight className="h-3 w-3" />
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
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
         <Terminal className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Centralized support synchronized // Session_ID: {session.user.id.slice(0, 8)}
         </p>
      </div>
    </div>
  );
}
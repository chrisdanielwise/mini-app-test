import { requireStaff } from "@/lib/auth/session";
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
 * 🛰️ CENTRALIZED SUPPORT LEDGER (Apex Tier)
 * Fixed: Prisma Validation Error by removing invalid 'merchant' include.
 * Fixed: Identity isolation to prevent 'undefined' merchantId crashes.
 */
export default async function SupportPage() {
  const session = await requireStaff();
  
  // 🛡️ 1. IDENTITY CLUSTER MAPPING
  const { role, merchantId } = session.user;
  const isSuperAdmin = role === "super_admin";
  const isPlatformManager = role === "platform_manager";
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 2. DATA INGRESS: Multi-Tier Filtering
  // We force 'null' for staff to ensure global fetch, or the specific ID for merchants.
  const tickets = await prisma.ticket.findMany({
    where: isPlatformStaff ? {} : { merchantId: merchantId || 'INVALID_NODE' },
    include: { 
      user: { 
        select: { username: true, id: true } 
      },
      // ✅ FIX: Removed 'merchant' include. 
      // Most Ticket schemas link to User; ensure you fetch 'user' for identity.
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
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-8">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg border shadow-inner",
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
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Support <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Desk</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic leading-none">
               Clearance: <span className="text-foreground">{role.replace('_', ' ')}</span> // Signal: {tickets.length > 0 ? 'Active' : 'Idle'}
            </p>
          </div>
        </div>

        <div className="relative min-w-0 sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30" />
          <Input 
            placeholder="FILTER TELEMETRY..."
            className="h-10 w-full pl-10 rounded-xl border-border/40 bg-card/40 font-bold text-[9px] uppercase tracking-widest"
          />
        </div>
      </div>

      {/* --- UNIFIED DATA LEDGER --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <Table className="w-full text-left border-collapse min-w-[800px]">
            <TableHeader className="bg-muted/30 border-b border-border/10">
              <TableRow className="hover:bg-transparent border-none"> 
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Identity Node</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Manifest / Subject</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Protocol</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-border/10 text-foreground">
              {tickets.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={3} className="h-40 text-center opacity-20">
                    <p className="text-xs font-black uppercase italic tracking-widest leading-none">Protocol queue clear.</p>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-primary/[0.02] transition-colors group border-none">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-lg bg-muted/20 border border-border/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                        <div>
                          <p className="font-black uppercase italic text-sm leading-none group-hover:text-primary transition-colors">
                            @{ticket.user?.username || 'anon_node'}
                          </p>
                          <p className="text-[8px] font-bold text-muted-foreground/40 mt-1 uppercase leading-none">
                            UID: {ticket.user?.id.slice(0, 12)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                       <p className="font-bold text-xs uppercase tracking-tight text-foreground/70 truncate italic">
                         {ticket.subject || "NO_SUBJECT_MANIFEST"}
                       </p>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-right">
                      <Button 
                        asChild 
                        variant="ghost" 
                        className={cn(
                          "h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                          isPlatformStaff 
                            ? "bg-amber-500/5 text-amber-500 border-amber-500/10 hover:bg-amber-500 hover:text-black" 
                            : "bg-primary/5 text-primary border-primary/10 hover:bg-primary"
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
         <Terminal className="h-3 w-3" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] italic leading-none">
           Support Cluster Synchronized // Clear_State: True
         </p>
      </div>
    </div>
  );
}
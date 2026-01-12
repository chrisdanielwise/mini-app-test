import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Terminal, 
  Search, 
  Filter, 
  User, 
  Globe,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * 🛰️ CENTRALIZED PLATFORM SUPPORT (Tactical Medium)
 * Route: /dashboard/support
 * Logic: Global intervention queue for Platform Support Staff.
 */
export default async function PlatformSupportPage() {
  const session = await requireMerchantSession();
  
  // 🛡️ ROLE GUARD: Verify Platform-level clearance
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(session.user.role);
  if (!isPlatformStaff) {
    throw new Error("UNAUTHORIZED_ACCESS: Identity level insufficient for global support node.");
  }

  // 🏁 DATA INGRESS: Fetching all system tickets + Merchant labels
  const tickets = await prisma.ticket.findMany({
    include: { 
      user: true,
      merchant: { select: { companyName: true } } 
    },
    orderBy: { createdAt: 'desc' }
  });

  const activeInquiries = tickets.filter(t => t.status === 'OPEN').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-8">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary/60">
            <ShieldCheck className="h-4 w-4 shrink-0 fill-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
              Platform_Intervention_Node
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Support <span className="text-primary">Master</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic">
              Open_Tickets: <span className="text-foreground tabular-nums">{activeInquiries}</span> // Identity: {session.user.fullName}
            </p>
          </div>
        </div>

        {/* Global Control Cluster */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full lg:w-auto shrink-0">
          <div className="relative min-w-0 sm:w-64 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30" />
            <Input 
              placeholder="SEARCH USER_ID OR MERCHANT..." 
              className="h-10 md:h-11 w-full pl-10 rounded-xl border-border/40 bg-card/40 font-bold text-[9px] uppercase tracking-widest focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" className="h-10 md:h-11 px-4 rounded-xl border-border/40 bg-muted/10 text-[9px] font-bold uppercase tracking-widest">
            <Filter className="mr-2 h-3.5 w-3.5 opacity-40" /> Category
          </Button>
        </div>
      </div>

      {/* --- CENTRALIZED DATA LEDGER --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <Table className="w-full text-left border-collapse min-w-[950px]">
            <TableHeader className="bg-muted/30 border-b border-border/10">
              <TableRow className="hover:bg-transparent border-none"> 
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Identity Node</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Origin Cluster</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Manifest</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-border/10 text-foreground tabular-nums">
              {tickets.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={4} className="h-40 text-center opacity-20">
                    <p className="text-xs font-black uppercase italic tracking-widest">Intervention queue clear.</p>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-primary/[0.02] transition-colors group border-none">
                    {/* User Identity */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40 border border-primary/20">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase italic tracking-tight text-sm leading-none truncate group-hover:text-primary transition-colors">
                            @{ticket.user.username || 'anon_node'}
                          </p>
                          <p className="text-[8px] font-mono font-bold text-muted-foreground/40 mt-1">
                            UID: {ticket.user.telegramId.toString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Merchant Origin Badge */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <Globe className="h-3 w-3 text-primary/30" />
                         <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70">
                           {ticket.merchant?.companyName || "PLATFORM_ROOT"}
                         </span>
                      </div>
                    </TableCell>

                    {/* Inquiry Preview */}
                    <TableCell className="px-6 py-4 max-w-xs">
                      <div className="flex flex-col">
                         <p className="font-bold text-xs uppercase tracking-tight text-foreground/80 truncate">
                           {ticket.subject}
                         </p>
                         <Badge variant="outline" className="w-fit mt-1.5 text-[7px] font-black border-primary/10 text-muted-foreground/60 uppercase px-1 py-0 rounded">
                           {ticket.category.replace('_', ' ')}
                         </Badge>
                      </div>
                    </TableCell>

                    {/* Response Node */}
                    <TableCell className="px-6 py-4 text-right">
                      <Button 
                        asChild 
                        variant="ghost" 
                        className="h-8 px-3 rounded-lg bg-primary/5 hover:bg-primary hover:text-white text-[9px] font-black uppercase tracking-widest border border-primary/10 transition-all"
                      >
                        <Link href={`/dashboard/support/${ticket.id}`} className="flex items-center gap-2">
                          Resolve Node
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
           Centralized support synchronized // Cluster_Sync: Global_Level
         </p>
      </div>
    </div>
  );
}
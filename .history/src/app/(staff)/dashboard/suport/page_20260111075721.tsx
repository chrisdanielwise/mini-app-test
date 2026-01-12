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
  LifeBuoy, 
  Terminal, 
  Search, 
  Filter, 
  User, 
  Globe,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * 🛰️ PLATFORM SUPPORT COMMAND (Tactical Medium)
 * Route: /dashboard/support
 * Logic: Centralized queue for all merchant-related inquiries.
 */
export default async function PlatformSupportPage() {
  const session = await requireMerchantSession();
  
  // 🛡️ AUTH CHECK: Verify Platform-level clearance
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(session.user.role);
  if (!isPlatformStaff) {
    throw new Error("UNAUTHORIZED_ACCESS: Identity level insufficient for global support.");
  }

  // 🏁 Data Fetch: All tickets in the system + Merchant Context
  const tickets = await prisma.ticket.findMany({
    include: { 
      user: true,
      // We need the merchant name to know which bot the user came from
      merchant: { select: { companyName: true } } 
    },
    orderBy: { createdAt: 'desc' }
  });

  const urgentCount = tickets.filter(t => t.priority === 'URGENT' && t.status === 'OPEN').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-8">
      
      {/* --- PLATFORM HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-4 w-4 shrink-0 fill-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic opacity-80">
              Platform_Service_Node
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Intervention <span className="text-primary">Queue</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic">
              Critical Alerts: <span className="text-rose-500 tabular-nums">{urgentCount}</span> // Total_Tickets: {tickets.length}
            </p>
          </div>
        </div>

        {/* Global Search & Filtration Cluster */}
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

      {/* --- DATA NODE: THE CENTRALIZED LEDGER --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <Table className="w-full text-left border-collapse min-w-[950px]">
            <TableHeader className="bg-muted/30 border-b border-border/10">
              <TableRow className="hover:bg-transparent border-none"> 
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Identity</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Merchant Origin</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Inquiry Manifest</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Status</TableHead>
                <TableHead className="h-12 px-6 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Protocol</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-border/10 text-foreground tabular-nums">
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-primary/[0.02] transition-colors group border-none">
                  {/* User Identity */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40 border border-primary/20">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-black text-foreground uppercase italic tracking-tight text-sm leading-none truncate">
                          @{ticket.user.username || 'anon_node'}
                        </p>
                        <p className="text-[8px] font-mono font-bold text-muted-foreground/40 mt-1">
                          {ticket.user.telegramId.toString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Merchant Identity Badge */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Globe className="h-3 w-3 text-primary/30" />
                       <span className="text-[10px] font-black uppercase tracking-wider text-foreground/70">
                         {ticket.merchant?.companyName || "ROOT_NODE"}
                       </span>
                    </div>
                  </TableCell>

                  {/* Inquiry Preview */}
                  <TableCell className="px-6 py-4 max-w-xs">
                    <div className="flex flex-col">
                       <p className="font-bold text-xs uppercase tracking-tight text-foreground/80 truncate">
                         {ticket.subject}
                       </p>
                       <p className="text-[9px] text-muted-foreground/40 italic line-clamp-1 mt-1">
                         "{ticket.category.replace('_', ' ')}"
                       </p>
                    </div>
                  </TableCell>

                  {/* Priority/Status */}
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className={cn(
                      "text-[8px] font-black px-1.5 py-0 rounded border uppercase tracking-widest",
                      ticket.priority === 'URGENT' ? "bg-rose-500/5 text-rose-500 border-rose-500/20" : "bg-muted/10 text-muted-foreground"
                    )}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>

                  {/* Response Link */}
                  <TableCell className="px-6 py-4 text-right">
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="h-8 px-3 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/10"
                    >
                      <Link href={`/dashboard/support/${ticket.id}`} className="flex items-center gap-2">
                        Resolve Node
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
         <Terminal className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Zipha Platform Support Core // State: Operational
         </p>
      </div>
    </div>
  );
}
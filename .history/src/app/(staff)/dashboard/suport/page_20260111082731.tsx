// src/app/(staff)/dashboard/support/page.tsx

import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  ShieldCheck, MessageSquare, Terminal, Search, Filter, User, Globe, ChevronRight, Eye, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function SupportPage() {
  const session = await requireMerchantSession();
  const { role, merchantId } = session.user;

  // 1. IDENTITY MAPPING
  const isSuperAdmin = role === "super_admin";
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);
  const isMerchant = role === "merchant";

  // 2. DATA INGRESS: Filtered by role
  const tickets = await prisma.ticket.findMany({
    where: isPlatformStaff ? {} : { merchantId: merchantId },
    include: { 
      user: { select: { username: true, id: true } },
      merchant: { select: { companyName: true } } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-8">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg border shadow-inner",
              isSuperAdmin ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : 
              isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : 
              "bg-primary/10 border-primary/20 text-primary"
            )}>
              <ShieldCheck className="h-4 w-4 fill-current" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic opacity-60">
              {isSuperAdmin ? "System_Root_Oversight" : isPlatformStaff ? "Platform_Support_Node" : "Merchant_Audit_Trail"}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Support <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Desk</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic">
               Role: {role.replace('_', ' ')} // Total_Nodes: {tickets.length}
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full lg:w-auto shrink-0">
          <div className="relative min-w-0 sm:w-64 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30" />
            <Input 
              placeholder="SEARCH PROTOCOLS..." 
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
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Inquiry Node</TableHead>
                {isPlatformStaff && <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Cluster Origin</TableHead>}
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Subject</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-border/10 text-foreground">
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-primary/[0.02] transition-colors group border-none">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-muted/20 border border-border/10 flex items-center justify-center text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <p className="font-black uppercase italic text-sm leading-none truncate">
                        @{ticket.user?.username || 'anon_node'}
                      </p>
                    </div>
                  </TableCell>

                  {isPlatformStaff && (
                    <TableCell className="px-6 py-4">
                       <span className="text-[10px] font-black uppercase tracking-wider text-foreground/50">
                         {ticket.merchant?.companyName || "ROOT"}
                       </span>
                    </TableCell>
                  )}

                  <TableCell className="px-6 py-4 max-w-xs">
                     <p className="font-bold text-xs uppercase tracking-tight text-foreground/70 truncate italic">
                       {ticket.subject}
                     </p>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-right">
                    <Button 
                      asChild 
                      variant="ghost" 
                      className={cn(
                        "h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
                        isPlatformStaff ? "bg-amber-500/5 text-amber-500 border-amber-500/10 hover:bg-amber-500 hover:text-black" : "bg-primary/5 text-primary border-primary/10 hover:bg-primary"
                      )}
                    >
                      <Link href={`/dashboard/support/${ticket.id}`} className="flex items-center gap-2">
                        {isPlatformStaff ? "Resolve Node" : "Audit Node"}
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

      {/* FOOTER SIGNAL */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
         <Terminal className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Centralized support synchronized // Session: {role}
         </p>
      </div>
    </div>
  );
}
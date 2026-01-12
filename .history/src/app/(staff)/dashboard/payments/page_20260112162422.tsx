import { requireStaff } from "@/lib/auth/session";
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
  ArrowDownLeft, 
  Terminal, 
  Search, 
  Download,
  Globe,
  Zap,
  Calendar,
  Building2,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * 🏛️ CAPITAL INGRESS LEDGER (Institutional v9.3.3)
 * Fix: Direct RBAC Filter to prevent 'merchantId: null' validation errors.
 * Logic: Super Admins monitor global inflow; Merchants track local liquidity.
 */
export default async function PaymentsPage() {
  const session = await requireStaff();
  const realMerchantId = session.merchantId;
  const isSuperAdmin = session.user.role === "super_admin";

  // 🛡️ DYNAMIC PROTOCOL FILTER
  // Uses direct Payment.merchantId for high-speed indexing
  const whereClause = realMerchantId ? { merchantId: realMerchantId } : {};

  const transactions = await prisma.payment.findMany({
    where: whereClause,
    include: {
      user: {
        select: { fullName: true, username: true }
      },
      service: {
        select: { 
          name: true,
          merchant: { select: { companyName: true } }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1 text-left">
          <div className="flex items-center gap-2 text-primary/60">
            <ArrowDownLeft className="h-4 w-4 shrink-0 fill-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              {isSuperAdmin ? "Global Revenue Sync" : "Merchant Liquidity"}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Inflow <span className="text-primary">Ledger</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
              Validated Packets: <span className="text-foreground tabular-nums">{transactions.length}</span> // Identity: {session.user.role}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full lg:w-auto shrink-0">
          <div className="relative min-w-0 sm:w-60 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30" />
            <Input 
              placeholder="SEARCH TX_ID..." 
              className="h-10 md:h-11 w-full pl-10 rounded-xl border-border/40 bg-card/40 font-bold text-[9px] uppercase tracking-widest focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" className="h-10 md:h-11 px-4 rounded-xl border-border/40 bg-muted/10 text-[9px] font-bold uppercase tracking-widest text-foreground">
            <Download className="mr-2 h-3.5 w-3.5 opacity-40" /> Export
          </Button>
        </div>
      </div>

      {/* --- DATA NODE: THE LEDGER --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <Table className="w-full text-left border-collapse min-w-[900px]">
            <TableHeader className="bg-muted/30 border-b border-border/10">
              <TableRow className="hover:bg-transparent border-none"> 
                <TableHead className="px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Identity Node</TableHead>
                {isSuperAdmin && <TableHead className="px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Origin Merchant</TableHead>}
                <TableHead className="px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Service Node</TableHead>
                <TableHead className="px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Liquidity</TableHead>
                <TableHead className="px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Timestamp</TableHead>
                <TableHead className="px-6 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Protocol</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-border/10">
              {transactions.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={isSuperAdmin ? 6 : 5} className="h-40 text-center opacity-20">
                    <p className="text-xs font-black uppercase italic tracking-widest">No Ingress Signals Detected.</p>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-primary/[0.02] transition-colors group border-none">
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40 border border-primary/20 shadow-inner group-hover:scale-105 transition-all">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase italic tracking-tight text-sm leading-none truncate group-hover:text-primary transition-colors">
                            @{tx.user.username || 'anon_node'}
                          </p>
                          <p className="text-[8px] font-mono font-bold text-muted-foreground/40 uppercase tracking-tighter mt-1">
                            UID: {tx.userId.slice(-10)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {isSuperAdmin && (
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                          <Building2 className="h-3 w-3" />
                          <span className="text-[10px] font-black uppercase italic truncate max-w-[120px]">
                            {tx.service.merchant?.companyName || "PLATFORM"}
                          </span>
                        </div>
                      </TableCell>
                    )}

                    <TableCell className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-primary opacity-40" />
                          <p className="text-[10px] font-black uppercase tracking-wider text-primary/80 italic leading-none truncate max-w-[140px]">
                            {tx.service.name}
                          </p>
                        </div>
                        <p className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest ml-5">
                          TX: {tx.id.slice(0, 8)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <p className="text-lg font-black tracking-tighter italic text-foreground leading-none tabular-nums">
                        <span className="text-xs align-top mr-0.5 opacity-40 font-bold">{tx.currency}</span>
                        {parseFloat(tx.amount.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/30" />
                        <span className="font-bold text-[10px] uppercase italic text-foreground/60 leading-none">
                          {format(new Date(tx.createdAt), "dd MMM yyyy")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5 text-right">
                      <div className={cn(
                        "inline-flex items-center rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-widest border shadow-sm",
                        tx.status === 'SUCCESS' 
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      )}>
                        {tx.status === 'SUCCESS' ? <CheckCircle2 className="h-2.5 w-2.5 mr-1.5 animate-pulse" /> : <Clock className="h-2.5 w-2.5 mr-1.5" />}
                        {tx.status}
                      </div>
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
           Secure Ledger Sync: Optimal // Role_Node: {session.user.role}
         </p>
      </div>
    </div>
  );
}
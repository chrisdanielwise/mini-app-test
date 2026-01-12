import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import {
  MoreHorizontal,
  Calendar,
  Zap,
  UserPlus,
  Terminal,
  ShieldAlert,
  ChevronRight,
  Globe,
  User,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubscriberSearch } from "@/components/dashboard/subscriber-search";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";

/**
 * 🏛️ SUBSCRIBER BASE LEDGER (Tactical Medium)
 * Normalized: World-standard fluid scaling for operational identity nodes.
 * Optimized: Resilient grid geometry to prevent horizontal cropping.
 */
export default async function SubscribersPage(props: {
  searchParams: Promise<{ query?: string }>;
}) {
  const session = await requireMerchantSession();
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const realMerchantId = session.merchantId;

  // 🏁 Data Fetch: Filtering based on Identity Node query
  const subscriptions = await prisma.subscription.findMany({
    where: {
      service: { merchantId: realMerchantId },
      OR: [
        { adminUser: { fullName: { contains: query, mode: "insensitive" } } },
        { adminUser: { username: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: {
      adminUser: { select: { id: true, fullName: true, username: true } },
      service: { select: { name: true } },
      tier: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4">
      
      {/* --- COMMAND HUD HEADER: TACTICAL SYNC --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary/60">
            <UserPlus className="h-4 w-4 shrink-0 fill-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              Network Identity Hub
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Subscriber <span className="text-primary">Base</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic">
              {query
                ? `Manifest Search: ${subscriptions.length} Found`
                : `Cluster Integrity: ${subscriptions.length} Linked Nodes`}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0">
          <SubscriberSearch />
        </div>
      </div>

      {/* --- DATA NODE: THE LEDGER --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/10">
                {[
                  "Identity Node",
                  "Assigned Service",
                  "Expiration Horizon",
                  "",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10 text-foreground">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center opacity-20">
                    <div className="flex flex-col items-center gap-4">
                      <ShieldAlert className="h-10 w-10" />
                      <p className="text-sm font-black uppercase italic tracking-tight">
                        {query
                          ? `Zero matches found for "${query}"`
                          : "No active membership protocols detected."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    {/* Identity Node */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 md:h-11 md:w-11 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black italic border border-primary/20 shadow-inner">
                          {(sub.adminUser?.fullName || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-foreground uppercase italic tracking-tight text-sm md:text-base leading-none truncate group-hover:text-primary transition-colors">
                            {sub.adminUser?.fullName || "Verified User"}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "w-fit text-[8px] font-black px-1.5 py-0.5 mt-1.5 uppercase tracking-widest border-none",
                              sub.status === 'ACTIVE' 
                                ? "bg-emerald-500/10 text-emerald-500" 
                                : "bg-amber-500/10 text-amber-500"
                            )}
                          >
                            {sub.status}
                          </Badge>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Service */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-primary opacity-40" />
                          <p className="text-[10px] font-black uppercase tracking-wider text-primary/80 italic leading-none truncate max-w-[140px]">
                            {sub.service.name}
                          </p>
                        </div>
                        <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest ml-5">
                          {sub.tier?.name || "Standard"} Tier
                        </p>
                      </div>
                    </td>

                    {/* Expiration Horizon */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/30" />
                        <span className="font-bold text-[10px] uppercase italic text-foreground/60">
                          {sub.expiresAt
                            ? format(new Date(sub.expiresAt), "dd MMM yyyy")
                            : "LIFETIME_PROTO"}
                        </span>
                      </div>
                    </td>

                    {/* Actions Entry */}
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-muted/10 border border-border/10 hover:bg-primary hover:text-white transition-all"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-border/40 bg-card/95 backdrop-blur-3xl p-1.5 shadow-2xl">
                          <DropdownMenuItem asChild className="rounded-lg py-2 px-3 focus:bg-primary/10 cursor-pointer">
                            <Link href={`/dashboard/subscribers/${sub.id}`} className="flex items-center justify-between w-full">
                              <span className="text-[9px] font-black uppercase italic tracking-widest">Node Audit</span>
                              <ChevronRight className="h-3 w-3 opacity-20" />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg py-2 px-3 text-rose-500 focus:bg-rose-500/10 cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            <span className="text-[9px] font-black uppercase italic tracking-widest">Revoke Access</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
        <Terminal className="h-3 w-3 text-muted-foreground" />
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
          Identity sync active // Query finalized: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
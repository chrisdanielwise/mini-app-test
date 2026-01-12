import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import {
  Users,
  MoreHorizontal,
  Calendar,
  Zap,
  Search,
  Filter,
  Download,
  ChevronRight,
  Terminal,
  UserPlus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

/**
 * 🏛️ SUBSCRIBER LEDGER CLUSTER (Tactical Medium)
 * Normalized: High-density Skimming scale.
 * Optimized: Zero-bleed horizontal constraints for professional staff view.
 */
export default async function SubscribersPage() {
  const session = await getSession();
  const realMerchantId = session.merchantId;

  const subscriptions = await prisma.subscription.findMany({
    where: {
      service: {
        merchantId: realMerchantId,
      },
    },
    include: {
      user: true,
      service: true,
      serviceTier: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4">
      
      {/* --- COMMAND HUD HEADER: TACTICAL SYNC --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary/60">
            <UserPlus className="h-4 w-4 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              Network Identity Hub
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Subscriber <span className="text-primary">Ledger</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
              Validated: <span className="text-foreground tabular-nums">{subscriptions.length}</span> Nodes
            </p>
          </div>
        </div>

        {/* Global Utility Actions Cluster */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full lg:w-auto shrink-0">
          <div className="relative min-w-0 sm:w-60 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30" />
            <Input
              placeholder="SEARCH NODE ID..."
              className="h-10 md:h-11 w-full pl-10 rounded-xl border-border/40 bg-card/40 font-bold text-[9px] uppercase tracking-widest focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2 h-10 md:h-11">
            <Button
              variant="outline"
              className="flex-1 lg:flex-none h-full px-4 rounded-xl border-border/40 bg-muted/10 text-[9px] font-bold uppercase tracking-widest"
            >
              <Filter className="mr-2 h-3.5 w-3.5 opacity-40" /> Filter
            </Button>
            <Button className="flex-1 lg:flex-none h-full px-4 rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-lg bg-primary text-primary-foreground active:scale-95 transition-all">
              <Download className="mr-2 h-3.5 w-3.5" /> Export
            </Button>
          </div>
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
                  "Service // Access",
                  "Protocol Status",
                  "Expiry Horizon",
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
                  <td colSpan={5} className="px-6 py-24 text-center opacity-20">
                    <p className="text-xs font-black uppercase italic tracking-widest">
                      Zero nodes synchronized.
                    </p>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 md:h-11 md:w-11 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black italic border border-primary/20 shadow-inner">
                          {(sub.user.username || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase italic tracking-tight text-sm md:text-base leading-none truncate group-hover:text-primary transition-colors">
                            @{sub.user.username || "unknown_node"}
                          </p>
                          <p className="text-[8px] font-mono font-bold text-muted-foreground/40 uppercase tracking-tighter mt-1">
                            UID: {sub.user.id.toString().slice(-12)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-primary opacity-40" />
                          <p className="text-[10px] font-black uppercase tracking-wider text-primary/80 italic leading-none truncate max-w-[140px]">
                            {sub.service.name}
                          </p>
                        </div>
                        <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest ml-5">
                          {sub.serviceTier?.name || "N/A"} TIER
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className={cn(
                          "inline-flex items-center rounded-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border",
                          sub.status === "ACTIVE"
                            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                        )}
                      >
                        <div className={cn(
                            "h-1 w-1 rounded-full mr-1.5 animate-pulse",
                            sub.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        {sub.status}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/30" />
                        <span className="font-bold text-[10px] uppercase italic text-foreground/60">
                          {sub.expiresAt
                            ? format(new Date(sub.expiresAt), "dd MMM yyyy")
                            : "LIFETIME"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-muted/10 border border-border/10 hover:bg-primary hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-border/40 bg-card/95 backdrop-blur-3xl p-1.5 shadow-2xl">
                          <DropdownMenuItem asChild className="rounded-lg py-2 px-3 focus:bg-primary/10 cursor-pointer">
                            <Link href={`/dashboard/subscribers/${sub.id}`} className="flex items-center justify-between w-full">
                              <span className="text-[9px] font-black uppercase italic tracking-widest">Deep Audit</span>
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

      <div className="flex items-center gap-3 px-1 opacity-20 py-4">
        <Terminal className="h-3 w-3 text-muted-foreground" />
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic leading-none">
          Secure identity verification node active // Sync_State: Optimal
        </p>
      </div>
    </div>
  );
}
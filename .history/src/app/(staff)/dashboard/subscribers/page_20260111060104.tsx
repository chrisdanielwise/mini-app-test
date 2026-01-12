import { requireMerchantSession } from "@/lib/auth/merchant-session";
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

/**
 * 🏛️ SUBSCRIBER LEDGER CLUSTER (Apex Tier Refactor)
 * Normalized: World-standard fluid typography and adaptive grid constraints.
 * Optimized: Horizontal overflow protection and kinetic touch targets.
 */
export default async function SubscribersPage() {
  const session = await requireMerchantSession();
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
    <div className="max-w-full overflow-x-hidden space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
     {/* --- COMMAND HUD HEADER --- */}
<div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between px-1">
  {/* Branding Node: Fluid Scaling */}
  <div className="space-y-4 flex-1 min-w-0">
    <div className="flex items-center gap-3 text-primary">
      <div className="h-7 w-7 md:h-8 md:w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
        <UserPlus className="h-4 w-4 fill-primary" />
      </div>
      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic opacity-80">
        Network Identity Hub
      </span>
    </div>
    
    <div className="space-y-1">
      {/* Dynamic Text size: Scaled down for mobile to prevent cropping */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.04em] uppercase italic leading-[0.85] text-foreground truncate">
        Subscriber <span className="text-primary">Ledger</span>
      </h1>
      <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-3 opacity-40">
        Validated Identities: <span className="text-foreground tabular-nums">{subscriptions.length}</span>
      </p>
    </div>
  </div>

  {/* Utility Actions Cluster: Stacks on mobile, wraps on tablet */}
  <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto flex-shrink-0">
    <div className="relative flex-1 lg:w-72 xl:w-80 group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
      <Input 
        placeholder="SEARCH NODE ID..." 
        className="h-12 md:h-14 w-full pl-12 rounded-2xl border-border/40 bg-card/40 font-black text-[10px] uppercase tracking-[0.2em] focus:ring-primary/20 transition-all"
      />
    </div>
    
    <div className="flex gap-2 h-12 md:h-14">
      <Button variant="outline" className="flex-1 lg:flex-none h-full px-5 rounded-2xl border-border/40 bg-muted/10 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
        <Filter className="mr-2 h-4 w-4" /> Filter
      </Button>
      <Button className="flex-1 lg:flex-none h-full px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 bg-primary text-primary-foreground active:scale-95 transition-all">
        <Download className="mr-2 h-4 w-4" /> Export
      </Button>
    </div>
  </div>
</div>

      {/* --- DATA NODE: THE LEDGER --- */}
      {/* SCROLLBAR FIX: Container handles the overflow shadow */}
      <div className="rounded-2xl md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/10">
                {[
                  "Identity Node",
                  "Service // Tier",
                  "Protocol Status",
                  "Expiry Horizon",
                  "",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-6 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 leading-none"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <p className="text-xs font-black uppercase italic tracking-tighter opacity-20">
                      Identity cluster empty.
                    </p>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-primary/[0.02] transition-all duration-500 group"
                  >
                    <td className="px-6 py-6 md:py-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black italic border border-primary/20">
                          {(sub.user.username || "U")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-lg md:text-2xl leading-none truncate">
                            @{sub.user.username || "unknown_node"}
                          </p>
                          <p className="text-[8px] md:text-[9px] font-mono font-bold text-muted-foreground uppercase opacity-30 tracking-widest mt-1">
                            UID: {sub.user.id.toString().slice(-12)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-primary opacity-40" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary italic leading-none truncate max-w-[120px]">
                            {sub.service.name}
                          </p>
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-5 opacity-50 leading-none">
                          {sub.serviceTier?.name || "N/A"} ACCESS
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div
                        className={cn(
                          "inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                          sub.status === "ACTIVE"
                            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                        )}
                      >
                        <div
                          className={cn(
                            "h-1 w-1 rounded-full mr-2 animate-pulse",
                            sub.status === "ACTIVE"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          )}
                        />
                        {sub.status}
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground opacity-30" />
                        <span className="font-black text-[11px] uppercase italic tracking-tighter text-foreground/80 leading-none">
                          {sub.expiresAt
                            ? new Date(sub.expiresAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "LIFETIME"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-muted/20 border border-border/40 hover:bg-primary hover:text-white"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[200px] rounded-2xl border-border/40 bg-card/95 backdrop-blur-3xl p-2 shadow-2xl z-[100]"
                        >
                          <DropdownMenuItem
                            asChild
                            className="rounded-xl py-3 px-4 focus:bg-primary/10"
                          >
                            <Link
                              href={`/dashboard/subscribers/${sub.id}`}
                              className="flex items-center justify-between w-full"
                            >
                              <span className="text-[10px] font-black uppercase tracking-widest italic">
                                Deep Audit
                              </span>
                              <ChevronRight className="h-3 w-3 opacity-20" />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl py-3 px-4 text-rose-500 focus:bg-rose-500/10">
                            <Trash2 className="h-4 w-4 mr-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">
                              Revoke
                            </span>
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

      <div className="flex items-center gap-3 px-2 opacity-20">
        <Terminal className="h-3 w-3 text-muted-foreground" />
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic leading-none">
          Audit Protocol Active
        </p>
      </div>
    </div>
  );
}

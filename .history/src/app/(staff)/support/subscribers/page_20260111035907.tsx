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

export default async function SubscribersPage(props: {
  searchParams: Promise<{ query?: string }>;
}) {
  const session = await requireMerchantSession();
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";

  // 🏁 Data Fetch: Filtering based on Identity Node query
  const subscriptions = await prisma.subscription.findMany({
    where: {
      service: { merchantId: session.merchantId },
      OR: [
        { adminUser: { fullName: { contains: query, mode: "insensitive" } } },
        { adminUser: { username: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: {
      adminUser: { select: { id: true, fullName: true, username: true } },
      service: true,
      tier: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* --- HUD HEADER & SEARCH --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-8 md:pb-12">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <UserPlus className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Network Identity Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Subscriber <span className="text-primary">Base</span>
          </h1>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-40">
            {query
              ? `Search Results: ${subscriptions.length} Nodes Found`
              : `Cluster Integrity: ${subscriptions.length} Linked Nodes`}
          </p>
        </div>

        <SubscriberSearch />
      </div>

      {/* --- DATABASE CONTAINER --- */}
      <div className="rounded-3xl md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-muted/30 border-b border-border/10">
              <tr>
                {[
                  "Identity Node",
                  "Assigned Service",
                  "Expiration Horizon",
                  "",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-muted/50 border border-border/10 flex items-center justify-center">
                        <ShieldAlert className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-black uppercase italic tracking-widest">
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
                    className="hover:bg-primary/[0.02] transition-all group"
                  >
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-sm text-primary italic shadow-inner">
                          {(sub.adminUser?.fullName || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-foreground uppercase italic text-base md:text-lg tracking-tighter leading-none truncate">
                            {sub.adminUser?.fullName || "Verified User"}
                          </span>
                          <Badge
                            variant="secondary"
                            className="w-fit text-[8px] font-black px-1.5 py-0.5 mt-1.5 uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-none"
                          >
                            {sub.status}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    {/* ... (Existing table cells for Service and Expiration) */}
                    <td className="px-6 py-8 text-right">
                      {/* ... (Existing DropdownMenu code) */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 opacity-20">
        <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
          Query finalized at {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  MoreHorizontal,
  Copy,
  Percent,
  Gift,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateCouponModal } from "@/components/dashboard/create-coupon-modal";
import { CouponSearch } from "@/components/dashboard/coupon-search";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🎫 SYSTEM LEDGER: PROMOTIONS
 * Implements server-side pagination and insensitive search to handle high-volume
 * data sets (13,000+) without crashing the database or UI thread.
 */
export default async function CouponsPage({
  searchParams,
}: {
  searchParams: { page?: string; query?: string };
}) {
  const session = await requireMerchantSession();

  // ⚙️ SEARCH & PAGINATION ENGINE
  const PAGE_SIZE = 10;
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const skip = (currentPage - 1) * PAGE_SIZE;

  // 🏁 DATA FETCH: Parallelized to minimize TTFB
  const [coupons, totalCount] = await Promise.all([
    prisma.coupon.findMany({
      where: {
        merchantId: session.merchant.id,
        code: { contains: query, mode: "insensitive" }, // 🔍 Real-time server filter
      },
      include: {
        service: true,
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: skip,
    }),
    prisma.coupon.count({
      where: {
        merchantId: session.merchant.id,
        code: { contains: query, mode: "insensitive" },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-8 p-4 sm:p-6 pb-32 animate-in fade-in duration-700">
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Promotions
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
            {query
              ? `Filter Protocol Active: "${query}"`
              : `Node Ledger: ${totalCount} Active Nodes`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <CouponSearch />
          <CreateCouponModal merchantId={session.merchant.id} />
        </div>
      </div>

      {/* --- LEDGER TABLE CARD --- */}
      <div className="rounded-[3rem] border border-border bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-8 py-5 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Identity Node
                </th>
                <th className="px-8 py-5 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Value Adjustment
                </th>
                <th className="px-8 py-5 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Utilization
                </th>
                <th className="px-8 py-5 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Service Link
                </th>
                <th className="px-8 py-5 text-right font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
                        <ShieldAlert className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs font-black uppercase italic text-muted-foreground">
                        No matches found in promotion node.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-primary/[0.02] transition-all duration-300 group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6",
                            coupon.discountPercent === 100
                              ? "bg-primary/10 text-primary shadow-primary/5"
                              : "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/5"
                          )}
                        >
                          {coupon.discountPercent === 100 ? (
                            <Gift className="h-6 w-6" />
                          ) : (
                            <Percent className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-black text-foreground uppercase tracking-tighter text-base">
                            {coupon.code}
                          </p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">
                            {coupon.discountPercent === 100
                              ? "GIFT ACCESS"
                              : "DISCOUNT NODE"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-sm uppercase tracking-tighter">
                        {coupon.discountPercent}% OFF
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-black text-[10px] uppercase tracking-widest text-primary">
                          {coupon.useCount} / {coupon.maxUses || "∞"}
                        </span>
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
                          <div
                            className="h-full bg-primary transition-all duration-1000"
                            style={{
                              width: `${
                                coupon.maxUses
                                  ? (coupon.useCount / coupon.maxUses) * 100
                                  : 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                        {coupon.service?.name || "Global Node"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 rounded-2xl bg-muted/30 hover:bg-primary hover:text-white transition-all duration-300"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[220px] rounded-[1.5rem] border-border bg-card/95 backdrop-blur-xl p-3 shadow-2xl"
                        >
                          <DropdownMenuItem className="rounded-xl font-black uppercase text-[10px] py-3.5 cursor-pointer focus:bg-primary focus:text-white transition-colors">
                            <Copy className="h-3.5 w-3.5 mr-2" /> Copy Protocol
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-2 mx-1" />
                          <DropdownMenuItem className="rounded-xl text-destructive font-black uppercase text-[10px] py-3.5 cursor-pointer focus:bg-destructive focus:text-white transition-all">
                            Revoke Authorization
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

        {/* --- PERFORMANCE PAGINATION ENGINE --- */}
        <div className="bg-muted/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border/50">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Identity Range: {skip + 1} -{" "}
            {Math.min(skip + PAGE_SIZE, totalCount)} of {totalCount}
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={`?page=${currentPage - 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-12 px-6 rounded-2xl border border-border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-card active:scale-95",
                currentPage <= 1 && "pointer-events-none opacity-20 grayscale"
              )}
            >
              <ChevronLeft className="h-4 w-4" /> PREV
            </Link>

            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-[10px] font-black text-primary-foreground shadow-lg">
              {currentPage}
            </div>

            <Link
              href={`?page=${currentPage + 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-12 px-6 rounded-2xl border border-border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-card active:scale-95",
                currentPage >= totalPages &&
                  "pointer-events-none opacity-20 grayscale"
              )}
            >
              NEXT <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

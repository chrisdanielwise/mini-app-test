import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  MoreHorizontal,
  Copy,
  Search,
  Percent,
  Gift,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CreateCouponModal } from "@/components/dashboard/create-coupon-modal";

/**
 * 🎫 COUPONS & GIFTS LEDGER
 * Manage promotional codes and direct access grants.
 */
export default async function CouponsPage() {
  const session = await requireMerchantSession();

  // 🏁 Fetch coupons linked to this merchant's services
  const coupons = await prisma.coupon.findMany({
    where: { merchantId: session.merchant.id },
    include: {
      service: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 p-6 pb-20 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Promotions
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Active Campaigns: {coupons.length} Coupons & Gifts
          </p>
        </div>

        <CreateCouponModal merchantId={session.merchant.id} />
      </div>

      {/* Ledger Table */}
      <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Code Identity
                </th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Benefit
                </th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Usage
                </th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Linked Service
                </th>
                <th className="px-6 py-4 text-right font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Ticket className="h-10 w-10 text-muted-foreground/20" />
                      <p className="text-xs font-black uppercase italic text-muted-foreground">
                        No active promotions found.
                      </p>
                      <p className="text-[9px] font-bold uppercase text-muted-foreground opacity-50">
                        Create your first coupon or gift code above.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-muted/30 transition-all duration-200"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                            coupon.discountPercent === 100
                              ? "bg-primary/10 text-primary"
                              : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          {coupon.discountPercent === 100 ? (
                            <Gift className="h-5 w-5" />
                          ) : (
                            <Percent className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-black text-foreground uppercase tracking-tighter">
                            {coupon.code}
                          </p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">
                            {coupon.discountPercent === 100
                              ? "GIFT CODE"
                              : "DISCOUNT"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-black text-sm">
                        {coupon.discountPercent}% OFF
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-[10px] uppercase">
                          {coupon.useCount} / {coupon.maxUses || "∞"}
                        </span>
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${
                                coupon.maxUses
                                  ? (coupon.useCount / coupon.maxUses) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[10px] font-black uppercase text-primary">
                        {coupon.service?.name || "Global / All Services"}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-2xl bg-muted/50"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[200px] rounded-2xl border-border p-2 shadow-xl"
                        >
                          <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] py-3 cursor-pointer">
                            <Copy className="h-3 w-3 mr-2" /> Copy Code
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-2" />
                          <DropdownMenuItem className="rounded-xl text-destructive font-black uppercase text-[10px] py-3 cursor-pointer focus:text-destructive">
                            Revoke Coupon
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
    </div>
  );
}

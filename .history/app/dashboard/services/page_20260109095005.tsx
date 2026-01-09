import { requireMerchantSession } from "@/lib/auth/merchant-auth";
/** * ✅ FIXED: Using named import instead of class ServiceService.
 * This resolves the Turbopack build error.
 */
import { getServicesByMerchant } from "@/lib/services/service.service";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Users, DollarSign, ShieldAlert } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";

/**
 * Merchant Services Dashboard Page
 * Optimized for Schema V2.0.0 and Next.js 16/Turbopack.
 */
export default async function ServicesPage() {
  // 🔐 1. Ensure the merchant is authenticated
  const session = await requireMerchantSession();

  // 🏁 2. Fetch services using the sanitized named export
  // Handles BigInt channel IDs and Decimal prices safely for the client.
  const services = await getServicesByMerchant(session.merchant.id);

  return (
    <div className="space-y-6 p-6 pb-20 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Command Center: Services
          </h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Managing assets for {session.merchant.companyName}
          </p>
        </div>
        
        {/* ✅ Pass merchantId to the modal for the Server Action */}
       <CreateServiceModal merchantId={session.merchant.id} />
      </div>

      {/* Services Table */}
      <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Service Identity
                </th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Subscribers
                </th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Active Tiers
                </th>
                <th className="px-6 py-4 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ShieldAlert className="h-10 w-10 text-muted-foreground/30" />
                      <p className="text-xs font-black uppercase italic text-muted-foreground">
                        No active services found. Deploy your first signals.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service: any) => (
                  <tr key={service.id} className="hover:bg-muted/30 transition-all duration-200">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <p className="font-black text-foreground uppercase italic tracking-tight">
                          {service.name}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                          {service.categoryTag || "General Asset"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-black text-sm">
                          {service._count?.subscriptions || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        <span className="font-black text-sm uppercase">
                          {service.tiers?.length || 0} Tiers
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter ${
                          service.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                        }`}
                      >
                        {service.isActive ? "Live on Bot" : "Draft Mode"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-2xl border-border shadow-2xl p-2">
                          <DropdownMenuItem asChild className="rounded-xl font-bold uppercase text-[10px] py-3 cursor-pointer">
                            <Link href={`/dashboard/services/${service.id}`}>
                              Configure Tiers
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-xl font-bold uppercase text-[10px] py-3 cursor-pointer">
                            <Link href={`/dashboard/subscribers?serviceId=${service.id}`}>
                              Ledger History
                            </Link>
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-2" />
                          <DropdownMenuItem className="rounded-xl text-destructive font-black uppercase text-[10px] py-3 cursor-pointer focus:text-destructive focus:bg-destructive/5">
                            Archive Service
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
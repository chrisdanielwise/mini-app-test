import { requireMerchantSession } from "@/lib/auth/merchant-auth";
/** * ✅ ARCHITECTURAL SYNC: 
 * Fetches real deployment data using the sanitized Merchant UUID.
 */
import { getServicesByMerchant } from "@/lib/services/service.service";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Users, 
  DollarSign, 
  ShieldAlert,
  Zap,
  PlusCircle,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";

/**
 * 🛰️ SERVICE DEPLOYMENT HUB
 * Centralizes multi-tier signal services and subscriber analytics.
 */
export default async function ServicesPage() {
  // 🔐 1. Authenticate and extract the REAL Merchant UUID from the session.
  const session = await requireMerchantSession();
  const realMerchantId = session.merchant.id;

  // 🏁 2. Fetch services using the sanitized UUID from the service layer.
  const services = await getServicesByMerchant(realMerchantId);

  return (
    <div className="space-y-8 p-4 sm:p-6 pb-32 animate-in fade-in duration-700">
      
      {/* --- IMMERSIVE HEADER --- */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Zap className="h-4 w-4 fill-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Node Deployment</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Service Assets
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
            Node Identity: <span className="text-foreground">{session.merchant.companyName}</span>
          </p>
        </div>

        {/* ✅ Logic-Safe: Passing the real database UUID to the deployment modal */}
        <CreateServiceModal merchantId={realMerchantId} />
      </div>

      {/* --- SERVICES DATA GRID --- */}
      <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-8 py-5 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Signal Identity
                </th>
                <th className="px-8 py-5 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Network Size
                </th>
                <th className="px-8 py-5 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Pricing Tiers
                </th>
                <th className="px-8 py-5 font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Status
                </th>
                <th className="px-8 py-5 text-right font-black uppercase text-[10px] text-muted-foreground tracking-widest">
                  Configuration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
                        <ShieldAlert className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs font-black uppercase italic text-muted-foreground">
                        No active signal nodes deployed.
                      </p>
                      <CreateServiceModal merchantId={realMerchantId} />
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service: any) => (
                  <tr
                    key={service.id}
                    className="hover:bg-primary/[0.02] transition-all duration-300 group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <p className="font-black text-foreground uppercase italic tracking-tight text-base group-hover:text-primary transition-colors">
                          {service.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
                            {service.categoryTag || "FX"}
                          </span>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">
                            ID: {service.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                           <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="font-black text-sm">
                          {service._count?.subscriptions || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="font-black text-[11px] uppercase tracking-tighter">
                          {service.tiers?.length || 0} Deployment Tiers
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-colors ${
                          service.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        }`}
                      >
                        {service.isActive ? "● Node Active" : "○ Draft Mode"}
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
                          className="w-[220px] rounded-[1.5rem] border-border shadow-2xl p-3 bg-card/95 backdrop-blur-xl"
                        >
                          <DropdownMenuItem
                            asChild
                            className="rounded-xl font-black uppercase text-[10px] py-3.5 cursor-pointer focus:bg-primary focus:text-white transition-colors"
                          >
                            <Link href={`/dashboard/services/${service.id}`}>
                              <PlusCircle className="h-3.5 w-3.5 mr-2" /> Modify Tiers
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            className="rounded-xl font-black uppercase text-[10px] py-3.5 cursor-pointer"
                          >
                            <Link
                              href={`/dashboard/analytics?serviceId=${service.id}`}
                            >
                              <BarChart3 className="h-3.5 w-3.5 mr-2" /> Node Analytics
                            </Link>
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-2 mx-1" />
                          <DropdownMenuItem className="rounded-xl text-destructive font-black uppercase text-[10px] py-3.5 cursor-pointer focus:bg-destructive focus:text-white transition-all">
                            Revoke Deployment
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
import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { getServicesByMerchant } from "@/lib/services/service.service";
import { Users, DollarSign, ShieldAlert, Zap } from "lucide-react";
import { CreateServiceModal } from "@/src/components/dashboard/create-service-modal";
// ✅ NEW: Wrapper for hydration-safe dropdowns
import { ServiceActionWrapper } from "@/src/components/dashboard/service-action-wrapper";

/**
 * 🛰️ SERVICE DEPLOYMENT HUB
 * Centralizes multi-tier signal services and subscriber analytics.
 */
export default async function ServicesPage() {
  const session = await requireMerchantSession();
  const realMerchantId = session.merchant.id;

  // 🏁 Data Fetch from V2 Ledger Protocol
  const services = await getServicesByMerchant(realMerchantId);

  return (
    <div className="space-y-10 p-4 sm:p-8 pb-32 animate-in fade-in duration-700">
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Zap className="h-3 w-3 fill-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Live Node Deployment
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
            Service Assets
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-60">
            Node Identity:{" "}
            <span className="text-foreground">
              {session.merchant.companyName}
            </span>
          </p>
        </div>

        <CreateServiceModal key="header-deploy" merchantId={realMerchantId} />
      </div>

      {/* --- SERVICES DATA GRID --- */}
      <div className="rounded-[3rem] border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20 text-left">
                <th className="px-10 py-6 font-black uppercase text-[10px] text-muted-foreground tracking-[0.2em]">
                  Signal Identity
                </th>
                <th className="px-10 py-6 font-black uppercase text-[10px] text-muted-foreground tracking-[0.2em]">
                  Network Size
                </th>
                <th className="px-10 py-6 font-black uppercase text-[10px] text-muted-foreground tracking-[0.2em]">
                  Pricing
                </th>
                <th className="px-10 py-6 font-black uppercase text-[10px] text-muted-foreground tracking-[0.2em]">
                  Node Status
                </th>
                <th className="px-10 py-6 text-right font-black uppercase text-[10px] text-muted-foreground tracking-[0.2em]">
                  Config
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-40 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="h-20 w-20 rounded-[2rem] bg-muted/10 flex items-center justify-center border border-border/50">
                        <ShieldAlert className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black uppercase italic tracking-widest text-muted-foreground">
                          No nodes detected.
                        </p>
                        <CreateServiceModal
                          key="empty-state-deploy"
                          merchantId={realMerchantId}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service: any) => (
                  <tr
                    key={service.id}
                    className="hover:bg-primary/[0.03] transition-all duration-300 group cursor-default"
                  >
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <p className="font-black text-foreground uppercase italic tracking-tighter text-xl group-hover:text-primary transition-colors leading-none">
                          {service.name}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 tracking-widest">
                            {service.categoryTag || "GENERAL"}
                          </span>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">
                            ID: {service.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border/50">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-lg leading-none tracking-tighter">
                            {(
                              service._count?.subscriptions || 0
                            ).toLocaleString()}
                          </span>
                          <span className="text-[8px] font-bold uppercase text-muted-foreground opacity-60">
                            Active Subs
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-sm tracking-tight italic">
                            {service.tiers?.length || 0} Price Nodes
                          </span>
                          <span className="text-[8px] font-bold uppercase text-muted-foreground opacity-60">
                            Architected Tiers
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span
                        className={`inline-flex items-center rounded-[1rem] px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                          service.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full mr-2 ${
                            service.isActive ? "bg-emerald-500" : "bg-amber-500"
                          } animate-pulse`}
                        />
                        {service.isActive ? "Online" : "Paused"}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      {/* ✅ WRAPPER: Handles Radix Portal Hydration correctly */}
                      <ServiceActionWrapper serviceId={service.id} />
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

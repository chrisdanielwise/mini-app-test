import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { getServicesByMerchant } from "@/lib/services/service.service";
import { 
  Users, 
  DollarSign, 
  ShieldAlert, 
  Zap, 
  Globe, 
  Layers, 
  Activity, 
  Terminal 
} from "lucide-react";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SERVICE FLEET COMMAND (Tier 2)
 * High-resiliency deployment hub for managing multi-tier signal nodes.
 * Optimized for Prisma 7 and Next.js 15 Server Components.
 */
export default async function ServicesPage() {
  /**
   * 🔐 IDENTITY HANDSHAKE
   * Fixed Pathing: requireMerchantSession returns { user, merchantId, config }
   */
  const session = await requireMerchantSession();
  
  // ✅ THE FIX: Accessing the flat property 'merchantId' instead of 'merchant.id'
  const realMerchantId = session.merchantId;

  // 🏁 1. Fetch data from the V2 Ledger Protocol
  const services = await getServicesByMerchant(realMerchantId);

  return (
    <div className="space-y-12 p-6 sm:p-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/20">
              <Zap className="h-5 w-5 fill-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              Fleet Status: Online
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Service <span className="text-primary">Assets</span>
          </h1>
          <div className="flex items-center gap-6 mt-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
              <Globe className="h-3 w-3 opacity-40" />
              {/* ✅ FIXED: Accessing companyName via the config object */}
              Node: <span className="text-foreground italic">{session.config.companyName}</span>
            </p>
            <div className="h-4 w-px bg-border/40" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
              <Terminal className="h-3 w-3 opacity-40" />
              Cluster: <span className="text-foreground italic">Edge_01</span>
            </p>
          </div>
        </div>

        <CreateServiceModal key="header-deploy" merchantId={realMerchantId} />
      </div>

      {/* --- FLEET DATA GRID --- */}
      <div className="rounded-[3.5rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl transition-all">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                {["Signal Identity", "Network Load", "Architecture", "Status", "Command"].map((head) => (
                  <th key={head} className="px-10 py-8 font-black uppercase text-[9px] text-muted-foreground/60 tracking-[0.3em]">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-48 text-center">
                    <div className="flex flex-col items-center gap-8 opacity-40">
                      <div className="h-24 w-24 rounded-[3rem] bg-muted/10 flex items-center justify-center border border-dashed border-border/40">
                        <ShieldAlert className="h-10 w-10" />
                      </div>
                      <div className="space-y-4">
                        <p className="text-xl font-black uppercase italic tracking-tighter">
                          No active nodes detected.
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
                    className="hover:bg-primary/[0.02] transition-all duration-500 group cursor-default"
                  >
                    {/* Identity Node */}
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner transition-transform group-hover:scale-110 duration-500">
                           <Activity className="h-7 w-7" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-3xl group-hover:text-primary transition-colors leading-none">
                            {service.name}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-[8px] font-black text-primary uppercase bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 tracking-widest">
                              {service.categoryTag || "GENERAL_NODE"}
                            </span>
                            <p className="text-[9px] font-mono font-bold text-muted-foreground uppercase opacity-20 tracking-widest">
                              {service.id.slice(0, 12)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Network Size */}
                    <td className="px-10 py-10">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-muted-foreground/40" />
                           <span className="font-black text-2xl leading-none tracking-tighter italic">
                             {(service._count?.subscriptions || 0).toLocaleString()}
                           </span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">
                          Sub_Count
                        </span>
                      </div>
                    </td>

                    {/* Pricing Architecture */}
                    <td className="px-10 py-10">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-emerald-500">
                          <Layers className="h-4 w-4 opacity-50" />
                          <span className="font-black text-xl tracking-tighter italic leading-none">
                            {service.tiers?.length || 0} Nodes
                          </span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">
                          Tier_Map
                        </span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-10 py-10">
                      <div className={cn(
                        "inline-flex items-center rounded-2xl px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                        service.isActive
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10"
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20 shadow-amber-500/10"
                      )}>
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full mr-2.5 animate-pulse",
                          service.isActive ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        {service.isActive ? "Online" : "Paused"}
                      </div>
                    </td>

                    {/* Operational Trigger */}
                    <td className="px-10 py-10 text-right">
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
import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { getServicesByMerchant } from "@/lib/services/service.service";
import { 
  Users, 
  Zap, 
  Globe, 
  Layers, 
  Activity, 
  Terminal, 
  ShieldAlert 
} from "lucide-react";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SERVICE FLEET COMMAND (Apex Tier)
 * Normalized: Fixed typography scales and responsive grid constraints.
 * Fixed: Integrated with Unified Shell to prevent double-sidebar visual loops.
 */
export default async function ServicesPage() {
  /**
   * 🔐 IDENTITY HANDSHAKE
   * requireMerchantSession returns the hardened { user, merchantId, config } object.
   */
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // 🏁 1. Fetch data from the V2 Ledger Protocol
  const services = await getServicesByMerchant(realMerchantId);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shadow-inner border border-primary/20">
              <Zap className="h-4 w-4 fill-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              Fleet Status: Online
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Service <span className="text-primary">Assets</span>
          </h1>
          <div className="flex items-center gap-6 mt-4">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
              <Globe className="h-3 w-3 opacity-40" />
              Node: <span className="text-foreground italic uppercase">{session.config.companyName}</span>
            </p>
            <div className="h-4 w-px bg-border/40" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
              <Terminal className="h-3 w-3 opacity-40" />
              Cluster: <span className="text-foreground italic uppercase">Edge_01</span>
            </p>
          </div>
        </div>

        <CreateServiceModal key="header-deploy" merchantId={realMerchantId} />
      </div>

      {/* --- FLEET DATA GRID --- */}
      <div className="rounded-3xl md:rounded-[2.5rem] border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border/10 bg-muted/20">
                {["Signal Identity", "Network Load", "Architecture", "Status", "Command"].map((head) => (
                  <th key={head} className="px-6 py-6 font-black uppercase text-[10px] text-muted-foreground/40 tracking-[0.3em]">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-40">
                      <div className="h-20 w-20 rounded-[2rem] bg-muted/10 flex items-center justify-center border border-dashed border-border/20">
                        <ShieldAlert className="h-8 w-8" />
                      </div>
                      <p className="text-lg font-black uppercase italic tracking-tighter">
                        No active nodes detected.
                      </p>
                      <CreateServiceModal key="empty-state-deploy" merchantId={realMerchantId} />
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service: any) => (
                  <tr key={service.id} className="hover:bg-primary/[0.02] transition-all duration-500 group">
                    {/* Identity Node */}
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:scale-105 transition-transform duration-500">
                           <Activity className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-xl md:text-2xl lg:text-3xl group-hover:text-primary transition-colors leading-none truncate">
                            {service.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
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

                    {/* Network Size (Subscriptions Count) */}
                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-muted-foreground/40" />
                           <span className="font-black text-2xl tracking-tighter italic">
                             {(service._count?.subscriptions || 0).toLocaleString()}
                           </span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-muted-foreground opacity-30 tracking-widest">Sub_Count</span>
                      </div>
                    </td>

                    {/* Architecture (Tiers Count) */}
                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-emerald-500/80">
                          <Layers className="h-4 w-4 opacity-40" />
                          <span className="font-black text-xl tracking-tighter italic leading-none">
                            {service.tiers?.length || 0} Nodes
                          </span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-muted-foreground opacity-30 tracking-widest">Tier_Map</span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-8">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                        service.isActive
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10 shadow-emerald-500/5"
                          : "bg-amber-500/5 text-amber-500 border-amber-500/10 shadow-amber-500/5"
                      )}>
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full mr-2 animate-pulse",
                          service.isActive ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        {service.isActive ? "Online" : "Paused"}
                      </div>
                    </td>

                    {/* Command Trigger */}
                    <td className="px-6 py-8 text-right">
                      <ServiceActionWrapper serviceId={service.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FOOTER OVERRIDE --- */}
      <div className="flex items-center gap-3 px-6 opacity-20">
         <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
           Fleet deployment synchronized with central ledger.
         </p>
      </div>
    </div>
  );
}
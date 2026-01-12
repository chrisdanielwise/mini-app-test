import { requireStaff } from "@/lib/auth/session";
import { getServicesByMerchant } from "@/lib/services/service.service";
import { 
  Users, 
  Zap, 
  Globe, 
  Layers, 
  Activity, 
  Terminal, 
  ShieldAlert,
  Building2
} from "lucide-react";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SERVICE FLEET COMMAND (Institutional v9.4.5)
 * Fix: Dynamic Fleet Ingress allows Super Admin global asset auditing.
 * Fix: Null-safe Merchant ID mapping for platform-root deployment.
 */
export default async function ServicesPage() {
  const session = await requireStaff();
  
  // 🛡️ IDENTITY PROTOCOLS
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 1. Fetch data from the V2 Ledger Protocol
  // If Staff, we pass 'undefined' or 'null' to the service to trigger global fetch
  const services = await getServicesByMerchant(realMerchantId);

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4 text-foreground">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2">
            <Zap className={cn(
              "h-4 w-4 shrink-0 animate-pulse",
              isPlatformStaff ? "text-amber-500 fill-amber-500" : "text-primary fill-primary"
            )} />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              {isPlatformStaff ? "Global Fleet Oversight" : "Local Asset Control"}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none">
              Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 opacity-40">
              <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="h-3 w-3" />
                Node: <span className="italic uppercase">{session.config?.companyName || "PLATFORM_ROOT"}</span>
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="h-3 w-3" />
                Identity: <span className="italic uppercase text-foreground">{role}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {/* 🚀 MODAL GUARD: Passes standard ID or ROOT alias */}
          <CreateServiceModal key="header-deploy" merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- FLEET DATA GRID --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border/10 bg-muted/20">
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-widest">Signal Identity</th>
                {isPlatformStaff && <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-widest">Origin Node</th>}
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-widest">Network Load</th>
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-widest">Architecture</th>
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-widest">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={isPlatformStaff ? 6 : 5} className="px-6 py-32 text-center opacity-20">
                    <div className="flex flex-col items-center gap-4">
                      <ShieldAlert className="h-10 w-10" />
                      <p className="text-sm font-black uppercase italic tracking-tighter">No active nodes detected.</p>
                      <CreateServiceModal key="empty-state-deploy" merchantId={realMerchantId || "PLATFORM_ROOT"} />
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service: any) => (
                  <tr key={service.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-10 w-10 md:h-12 shrink-0 rounded-xl flex items-center justify-center border shadow-inner transition-all",
                          isPlatformStaff ? "bg-amber-500/5 text-amber-500 border-amber-500/20" : "bg-primary/5 text-primary border-primary/20"
                        )}>
                           <Activity className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black uppercase italic tracking-tight text-sm md:text-base leading-none truncate group-hover:text-primary transition-colors">
                            {service.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[7px] font-black uppercase bg-muted/20 px-1.5 py-0.5 rounded border border-border/10 tracking-widest text-muted-foreground">
                              {service.categoryTag || "GENERAL"}
                            </span>
                            <p className="text-[8px] font-mono font-bold text-muted-foreground/30 uppercase tracking-tighter">
                              ID: {service.id.slice(0, 10).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {isPlatformStaff && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                           <Building2 className="h-3.5 w-3.5" />
                           <span className="text-[10px] font-black uppercase italic truncate max-w-[120px]">
                             {service.merchant?.companyName || "PLATFORM"}
                           </span>
                        </div>
                      </td>
                    )}

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                           <Users className="h-3.5 w-3.5 text-muted-foreground/40" />
                           <span className="font-black text-lg tracking-tighter italic tabular-nums">
                             {(service._count?.subscriptions || 0).toLocaleString()}
                           </span>
                        </div>
                        <span className="text-[8px] font-bold uppercase text-muted-foreground/30 tracking-widest leading-none">Subscribers</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-emerald-500/80">
                          <Layers className="h-3.5 w-3.5 opacity-40" />
                          <span className="font-black text-base tracking-tighter italic tabular-nums">
                            {service.tiers?.length || 0} Nodes
                          </span>
                        </div>
                        <span className="text-[8px] font-bold uppercase text-muted-foreground/30 tracking-widest leading-none">Tier_Map</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center rounded-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border",
                        service.isActive
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      )}>
                        <div className={cn(
                          "h-1 w-1 rounded-full mr-1.5 animate-pulse",
                          service.isActive ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        {service.isActive ? "Online" : "Paused"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <ServiceActionWrapper serviceId={service.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
         <Terminal className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center">
           Fleet identity verification: {isPlatformStaff ? "ROOT_MASTER" : "NODE_LOCAL"} // Sync_Ok
         </p>
      </div>
    </div>
  );
}
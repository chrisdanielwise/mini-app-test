import { requireAuth, sanitizeData } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { 
  Users, Zap, Globe, Layers, Activity, 
  Terminal, ShieldAlert, Building2 
} from "lucide-react";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SERVICE FLEET COMMAND (Institutional v16.1.5)
 * Strategy: Integrated Server-Side Ingress with Hybrid RBAC Chroma.
 */
export default async function ServicesPage() {
  // 🔐 1. Identity Handshake (Allows both Staff and Merchants)
  const session = await requireAuth();
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  
  // 🎨 2. Theme Resolution: Amber for HQ, Primary for Merchants
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 3. Fleet Ingress (Direct Prisma Fetch)
  // Logic: Staff see all nodes; Merchants see only their specific cluster.
  const rawServices = await prisma.service.findMany({
    where: realMerchantId ? { merchantId: realMerchantId } : {},
    include: {
      merchant: { select: { companyName: true } },
      _count: { select: { subscriptions: true } },
      tiers: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 🧼 4. BigInt Sanitization (Crucial to prevent Serialization Errors)
  const services = sanitizeData(rawServices);

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4 text-foreground">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-white/5 pb-8 relative group">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2">
            <Zap className={cn(
              "h-4 w-4 shrink-0 animate-pulse transition-colors", 
              isPlatformStaff ? "text-amber-500 fill-amber-500" : "text-primary fill-primary"
            )} />
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em] italic opacity-60",
              isPlatformStaff ? "text-amber-500" : "text-primary"
            )}>
              {isPlatformStaff ? "Global Fleet Oversight" : "Local Asset Control"}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none">
              Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 opacity-30 italic">
              <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                Node: <span className="text-foreground">{session.config?.companyName || "PLATFORM_ROOT"}</span>
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5" />
                Identity: <span className="text-foreground uppercase">{role}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 relative z-10">
          <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- FLEET DATA GRID --- */}
      <div className={cn(
        "rounded-[2.5rem] border backdrop-blur-3xl overflow-hidden shadow-2xl bg-card/40",
        isPlatformStaff ? "border-amber-500/10" : "border-white/5"
      )}>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Signal Identity</th>
                {isPlatformStaff && <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin Node</th>}
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Network Load</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Architecture</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={isPlatformStaff ? 6 : 5} className="py-40 text-center opacity-10">
                    <div className="flex flex-col items-center gap-6">
                      <ShieldAlert className="size-16 animate-pulse" />
                      <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">No_Active_Nodes_Detected</p>
                      <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service: any) => (
                  <tr key={service.id} className="hover:bg-white/[0.01] transition-all duration-300 group border-none">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "size-12 md:size-14 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12",
                          isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          <Activity className="size-6" />
                        </div>
                        <div className="flex flex-col">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-lg leading-none group-hover:text-primary transition-colors">
                            {service.name}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[8px] font-black uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5 tracking-widest text-muted-foreground/60">
                              {service.categoryTag || "GENERAL"}
                            </span>
                            <p className="text-[8px] font-mono font-bold text-muted-foreground/20 uppercase tracking-tighter">
                              ID: {service.id.slice(0, 10).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {isPlatformStaff && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest leading-none">
                          <Building2 className="size-4" />
                          <span className="truncate max-w-[150px]">{service.merchant?.companyName || "PLATFORM_ROOT"}</span>
                        </div>
                      </td>
                    )}

                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-muted-foreground/30" />
                          <span className="text-2xl font-black italic tracking-tighter text-foreground leading-none tabular-nums">
                            {(service._count?.subscriptions || 0).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-muted-foreground/20 tracking-[0.2em] italic ml-6">Subscribers</span>
                      </div>
                    </td>

                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-emerald-500/60">
                          <Layers className="size-4 opacity-40" />
                          <span className="text-xl font-black italic tracking-tighter tabular-nums leading-none">
                            {service.tiers?.length || 0} Nodes
                          </span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-muted-foreground/20 tracking-[0.2em] italic ml-6">Tier_Map</span>
                      </div>
                    </td>

                    <td className="px-10 py-8">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm italic",
                        service.isActive 
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      )}>
                        <div className={cn("size-1.5 rounded-full mr-2 animate-pulse", service.isActive ? "bg-emerald-500" : "bg-amber-500")} />
                        {service.isActive ? "Online" : "Paused"}
                      </div>
                    </td>

                    <td className="px-10 py-8 text-right">
                      <ServiceActionWrapper serviceId={service.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center justify-center gap-5 opacity-10 py-16">
        <Terminal className="size-4" />
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-foreground italic">
           Fleet identity verification: {isPlatformStaff ? "ROOT_MASTER" : "NODE_LOCAL"} // Sync_Ok
        </p>
      </div>
    </div>
  );
}
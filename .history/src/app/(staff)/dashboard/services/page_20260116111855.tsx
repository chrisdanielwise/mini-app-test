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
 * 🛰️ SERVICE FLEET COMMAND (Institutional v16.1.18)
 * Strategy: De-stacked Independent Scroll Volume.
 * Fix: Forced h-full on container and flex-1 on table area to isolate scrolling.
 */
export default async function ServicesPage() {
  const session = await requireAuth();
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  const rawServices = await prisma.service.findMany({
    where: realMerchantId ? { merchantId: realMerchantId } : {},
    include: {
      merchant: { select: { companyName: true } },
      _count: { select: { subscriptions: true } },
      tiers: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const services = sanitizeData(rawServices);

  return (
    /* 🛡️ FIX: h-full and flex-col are mandatory here to lock the header and unlock the table scroll */
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground">
      
      {/* --- 🛡️ FIXED COMMAND HUD HEADER: Stationary --- */}
      {/* <div className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-8 pt-2">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full relative group px-4">
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none truncate">
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
      </div> */}

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Scrolling Fleet Grid --- */}
      {/* 🛡️ FIX: flex-1 and min-h-0 here allows this container to take the remaining screen height */}
      <div className="flex-1 min-h-0 w-full relative p-4 pb-10">
        <div className={cn(
          "h-full w-full rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl bg-card/40 flex flex-col overflow-hidden",
          isPlatformStaff ? "border-amber-500/10" : "border-white/5"
        )}>
          {/* 🛡️ THE SCROLL ENGINE: This is the ONLY part that scrolls */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <thead className="bg-white/[0.05] border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
                <tr>
                  <th className="w-[30%] px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Signal Identity</th>
                  {isPlatformStaff && <th className="w-[15%] px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin Node</th>}
                  <th className="w-[15%] px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Network Load</th>
                  <th className="w-[15%] px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Architecture</th>
                  <th className="w-[15%] px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                  <th className="w-[10%] px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={isPlatformStaff ? 6 : 5} className="py-40 text-center opacity-10">
                      <div className="flex flex-col items-center gap-6">
                        <ShieldAlert className="size-16 animate-pulse" />
                        <p className="text-xs font-black uppercase italic tracking-widest">No_Active_Nodes_Detected</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  services.map((service: any) => (
                    <tr key={service.id} className="hover:bg-white/[0.01] transition-all duration-300 group border-none">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6 min-w-0">
                          <div className={cn(
                            "size-12 md:size-14 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12",
                            isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                          )}>
                            <Activity className="size-6" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="font-black text-foreground uppercase italic tracking-tighter text-lg leading-none group-hover:text-primary transition-colors truncate">
                              {service.name}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[8px] font-black uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5 tracking-widest text-muted-foreground/60">
                                {service.categoryTag || "GENERAL"}
                              </span>
                              <p className="text-[8px] font-mono font-bold text-muted-foreground/20 uppercase tracking-tighter truncate">
                                ID: {service.id.slice(0, 10).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      {isPlatformStaff && (
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest leading-none truncate">
                            <Building2 className="size-4 shrink-0" />
                            <span className="truncate">{service.merchant?.companyName || "PLATFORM_ROOT"}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-muted-foreground/30" />
                          <span className="text-2xl font-black italic tracking-tighter text-foreground leading-none tabular-nums">
                            {(service._count?.subscriptions || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-emerald-500/60 font-black italic text-xl">
                        {service.tiers?.length || 0} Nodes
                      </td>
                      <td className="px-10 py-8">
                        <div className={cn(
                          "inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm italic",
                          service.isActive ? "text-emerald-500 border-emerald-500/20" : "text-amber-500 border-amber-500/20"
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
      </div>
    </div>
  );
}
// import { requireAuth, sanitizeData } from "@/lib/auth/session";
// import prisma from "@/lib/db";
// import { 
//   Users, Zap, Globe, Layers, Activity, 
//   Terminal, ShieldAlert, Building2 
// } from "lucide-react";
// import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
// import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";
// import { cn } from "@/lib/utils";

// /**
//  * 🛰️ SERVICE FLEET COMMAND (Institutional Apex v2026.1.20)
//  * Strategy: Viewport-Locked Chassis & Table Reservoir.
//  * Fix: Synchronized vertical horizon to prevent HUD-Header collision.
//  */
// export default async function ServicesPage() {
//   const session = await requireAuth();
//   const { role } = session.user;
//   const realMerchantId = session.merchantId;
//   const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

//   const rawServices = await prisma.service.findMany({
//     where: realMerchantId ? { merchantId: realMerchantId } : {},
//     include: {
//       merchant: { select: { companyName: true } },
//       _count: { select: { subscriptions: true } },
//       tiers: { select: { id: true } },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   const services = sanitizeData(rawServices);

//   return (
//     /* 🏛️ PRIMARY CHASSIS: Locked at 100% height to anchor the Header */
//     <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground bg-black">
      
//       {/* --- 🛡️ FIXED COMMAND HUD: shrink-0 pins this to the top --- */}
//       <div className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2">
//         <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 w-full px-6">
//           <div className="flex flex-col gap-2 min-w-fit flex-1">
//             <div className="flex items-center gap-2">
//               <Zap className={cn(
//                 "h-3 w-3 shrink-0 animate-pulse transition-colors", 
//                 isPlatformStaff ? "text-amber-500 fill-amber-500" : "text-primary fill-primary"
//               )} />
//               <span className={cn(
//                 "text-[8px] font-black uppercase tracking-[0.4em] italic opacity-60",
//                 isPlatformStaff ? "text-amber-500" : "text-primary"
//               )}>
//                 {isPlatformStaff ? "Global Fleet Oversight" : "Local Asset Control"}
//               </span>
//             </div>

//             <div className="space-y-0.5">
//               <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
//                 Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
//               </h1>
//               <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 opacity-20 italic">
//                 <p className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
//                   <Globe className="h-3 w-3" />
//                   Node: <span className="text-foreground">{session.config?.companyName || "PLATFORM_ROOT"}</span>
//                 </p>
//                 <p className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
//                   <Terminal className="h-3 w-3" />
//                   Identity: <span className="text-foreground uppercase">{role}</span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="shrink-0 relative z-10 pb-1 scale-90 origin-bottom-right">
//             <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
//           </div>
//         </div>
//       </div>

//       {/* --- 🚀 INTERNAL SCROLL VOLUME: flex-1 + min-h-0 triggers independent scroll --- */}
//       <div className="flex-1 min-h-0 w-full relative p-3 pb-6">
//         <div className={cn(
//           "h-full w-full rounded-[1.5rem] border backdrop-blur-3xl shadow-2xl bg-card/40 flex flex-col overflow-hidden",
//           isPlatformStaff ? "border-amber-500/10" : "border-white/5"
//         )}>
          
//           {/* 🌊 THE SCROLL ENGINE: Standard internal scroll reservoir */}
//           <div className="flex-1 w-full overflow-auto custom-scrollbar overscroll-contain">
//             <table className="w-full text-left border-collapse min-w-[900px] table-fixed relative">
              
//               {/* STICKY THEAD: Fixed within the reservoir to prevent label ghosting */}
//               <thead className="bg-zinc-950 sticky top-0 z-20 border-b border-white/5 backdrop-blur-md">
//                 <tr>
//                   <th className="w-[35%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Signal_Identity</th>
//                   {isPlatformStaff && <th className="w-[15%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-amber-500/30 italic">Node</th>}
//                   <th className="w-[12%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Load</th>
//                   <th className="w-[12%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Arch</th>
//                   <th className="w-[15%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Status</th>
//                   <th className="w-[11%] px-6 py-3"></th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-white/5">
//                 {services.map((service: any) => (
//                   <tr key={service.id} className="hover:bg-white/[0.01] transition-colors group">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-4 min-w-0">
//                         <div className={cn(
//                           "size-9 shrink-0 rounded-lg flex items-center justify-center border transition-transform group-hover:rotate-12",
//                           isPlatformStaff ? "border-amber-500/20 text-amber-500" : "border-primary/20 text-primary"
//                         )}>
//                           <Activity className="size-4" />
//                         </div>
//                         <div className="flex flex-col min-w-0 leading-tight">
//                           <p className="font-black text-foreground uppercase italic tracking-tighter text-sm truncate group-hover:text-primary transition-colors">
//                             {service.name}
//                           </p>
//                           <p className="text-[6px] font-mono text-muted-foreground/20 mt-0.5 truncate uppercase">
//                             ID: {service.id.slice(0, 8).toUpperCase()}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     {isPlatformStaff && (
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[9px] truncate">
//                           <Building2 className="size-3 shrink-0" />
//                           <span className="truncate">{service.merchant?.companyName || "ROOT"}</span>
//                         </div>
//                       </td>
//                     )}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <Users className="size-3 text-muted-foreground/20" />
//                         <span className="text-lg font-black italic text-foreground leading-none tabular-nums">
//                           {(service._count?.subscriptions || 0).toLocaleString()}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="text-md font-black italic text-emerald-500/40">
//                         {service.tiers?.length || 0}N
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className={cn(
//                         "inline-flex items-center rounded-md px-2 py-0.5 text-[6px] font-black uppercase border tracking-widest",
//                         service.isActive ? "text-emerald-500 border-emerald-500/20" : "text-amber-500 border-amber-500/20"
//                       )}>
//                         <div className={cn("size-1 rounded-full mr-1", service.isActive ? "bg-emerald-500" : "bg-amber-500")} />
//                         {service.isActive ? "Online" : "Paused"}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <ServiceActionWrapper serviceId={service.id} compact={true} />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
 * 🛰️ SERVICE FLEET COMMAND (Institutional Apex v2026.1.20)
 * Strategy: Rigid Chassis & Independent Scroll Reservoir.
 * Fix: Stationary HUD HUD + Internal Sticky Table Scroll.
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
    /* 🏛️ PRIMARY CHASSIS: Locked at 100% height to anchor the Stationary Header */
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground bg-black">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary (shrink-0 prevents it from scrolling away) --- */}
      <div className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 w-full relative group px-6">
          <div className="flex flex-col gap-2 min-w-fit flex-1">
            <div className="flex items-center gap-2">
              <Zap className={cn(
                "h-3 w-3 shrink-0 animate-pulse transition-colors", 
                isPlatformStaff ? "text-amber-500 fill-amber-500" : "text-primary fill-primary"
              )} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.4em] italic opacity-60",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Global Fleet Oversight" : "Local Asset Control"}
              </span>
            </div>

            <div className="space-y-0.5">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
                Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 opacity-20 italic">
                <p className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Globe className="h-3 w-3" />
                  Node: <span className="text-foreground">{session.config?.companyName || "PLATFORM_ROOT"}</span>
                </p>
                <p className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="h-3 w-3" />
                  Identity: <span className="text-foreground uppercase">{role}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="shrink-0 relative z-10 pb-1 scale-90 origin-bottom-right">
            <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: flex-1 + min-h-0 creates the Reservoir --- */}
      <div className="flex-1 min-h-0 w-full relative p-3 pb-6">
        <div className={cn(
          "h-full w-full rounded-[1.5rem] border backdrop-blur-3xl shadow-2xl bg-card/40 flex flex-col overflow-hidden",
          isPlatformStaff ? "border-amber-500/10" : "border-white/5"
        )}>
          
          {/* 🌊 THE SCROLL ENGINE: Standard internal scroll reservoir */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar overscroll-contain">
            <table className="w-full text-left border-collapse min-w-[900px] table-fixed relative">
              
              {/* STICKY THEAD: Fixed within the reservoir to prevent label ghosting */}
              <thead className="bg-zinc-950 sticky top-0 z-20 border-b border-white/5 backdrop-blur-md">
                <tr>
                  <th className="w-[35%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Signal_Identity</th>
                  {isPlatformStaff && <th className="w-[15%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-amber-500/30 italic">Node</th>}
                  <th className="w-[12%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Load</th>
                  <th className="w-[12%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Arch</th>
                  <th className="w-[15%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Status</th>
                  <th className="w-[11%] px-6 py-3"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {services.map((service: any) => (
                  <tr key={service.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={cn(
                          "size-9 shrink-0 rounded-lg flex items-center justify-center border",
                          isPlatformStaff ? "border-amber-500/20 text-amber-500" : "border-primary/20 text-primary"
                        )}>
                          <Activity className="size-4" />
                        </div>
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-sm truncate group-hover:text-primary transition-colors">
                            {service.name}
                          </p>
                          <p className="text-[6px] font-mono text-muted-foreground/20 mt-0.5 truncate uppercase">
                            ID: {service.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    {isPlatformStaff && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[9px] truncate">
                          <Building2 className="size-3 shrink-0" />
                          <span className="truncate">{service.merchant?.companyName || "ROOT"}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-lg font-black italic text-foreground leading-none tabular-nums">
                        {(service._count?.subscriptions || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-md font-black italic text-emerald-500/40">
                      {service.tiers?.length || 0}N
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[6px] font-black uppercase border tracking-widest",
                        service.isActive ? "text-emerald-500 border-emerald-500/20" : "text-amber-500 border-amber-500/20"
                      )}>
                        <div className={cn("size-1 rounded-full mr-1", service.isActive ? "bg-emerald-500" : "bg-amber-500")} />
                        {service.isActive ? "Online" : "Paused"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right ">
                      <ServiceActionWrapper serviceId={service.id} compact={true} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
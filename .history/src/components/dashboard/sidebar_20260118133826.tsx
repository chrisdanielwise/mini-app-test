// "use client";

// import * as React from "react";
// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
// import {
//   Zap,
//   Crown,
//   LogOut,
//   Loader2,
//   Activity,
//   Cpu,
//   ShieldCheck,
//   Menu,
//   X,
//   Globe,
//   Terminal
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// // 🏛️ Institutional Contexts & Hooks
// import { useLayout } from "@/context/layout-provider";
// import { useHaptics } from "@/lib/hooks/use-haptics";
// import { useDeviceContext } from "@/components/providers/device-provider";
// import { toast } from "sonner";

// /**
//  * 🛰️ DASHBOARD_SIDEBAR (Institutional Apex v2026.1.20)
//  * Strategy: Vertical Compression & Hardware Bridge Sync.
//  * Integration: Merged Legacy Atomic Logout & Mobile Toggle logic.
//  */
// export function DashboardSidebar({ context }: { context: any }) {
//   const pathname = usePathname();
//   const { flavor } = useLayout();
//   const { impact, notification } = useHaptics();
//   const { isReady, isMobile, safeArea } = useDeviceContext();

//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   // 🛡️ ROLE_NORMALIZATION
//   const role = (context?.role || "merchant").toLowerCase();
//   const themeAmber = flavor === "AMBER";
//   const config = context?.config || {};

//   const displayName = config?.companyName || (themeAmber ? "PLATFORM_ROOT" : "INITIALIZING...");
//   const nodeStatus = themeAmber ? role.replace("_", " ") : (config?.planStatus || "Starter");

//   // Close sidebar on navigation
//   useEffect(() => {
//     setIsOpen(false);
//   }, [pathname]);

//   /**
//    * 🧹 ATOMIC_LOGOUT_PROTOCOL (v16.70.0)
//    * Logic: Dispatches cross-tab termination signals before session purge.
//    */
//   const handleLogout = async () => {
//     if (isLoggingOut) return;
//     setIsLoggingOut(true);
//     impact("heavy");
//     const toastId = toast.loading("De-provisioning Identity Node...");

//     try {
//       const res = await fetch("/api/auth/logout", { method: "POST" });
//       if (!res.ok) throw new Error("TERMINATION_FAILED");

//       // 🛰️ CROSS-TAB SIGNAL BROADCAST
//       const authChannel = new BroadcastChannel("zipha_auth_sync");
//       authChannel.postMessage({ action: "TERMINATE_SESSION", timestamp: Date.now() });
//       authChannel.close();

//       notification("success");
//       toast.success("Node Disconnected", { id: toastId });
//       window.location.href = "/dashboard/login";
//     } catch (err) {
//       toast.error("Handshake Error", { id: toastId });
//       setIsLoggingOut(false);
//     }
//   };

//   const filteredNav = NAVIGATION_CONFIG.filter((item) => item.roles.includes(role));

//   // 🛡️ HYDRATION_SHIELD
//   if (!isReady) return <div className="flex-1 bg-black animate-pulse" />;

//   return (
//     <>
//       {/* --- 📱 MOBILE_TOGGLE_TRIGGER --- */}
//       {isMobile && (
//         <div className="fixed top-4 left-4 z-[100]">
//           <button
//             onClick={() => { impact("light"); setIsOpen(!isOpen); }}
//             className={cn(
//               "p-3 backdrop-blur-3xl border rounded-xl shadow-2xl active:scale-90 transition-all",
//               themeAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-zinc-900/90 border-white/10 text-primary"
//             )}
//           >
//             {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
//           </button>
//         </div>
//       )}

//       <aside
//         className={cn(
//           "fixed inset-y-0 left-0 z-50 flex flex-col h-full w-64 md:w-72 overflow-hidden transition-all duration-500 ease-in-out lg:relative lg:translate-x-0",
//           themeAmber ? "bg-[#050300] border-amber-500/10" : "bg-zinc-950 border-white/5",
//           isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
//           !isMobile && "border-r"
//         )}
//       >
//         {/* --- IDENTITY NODE --- */}
//         <div className="flex items-center gap-3 border-b border-white/5 px-5 shrink-0 bg-white/[0.01] h-14 md:h-20 leading-none">
//           <div className={cn(
//             "size-8 md:size-10 shrink-0 flex items-center justify-center rounded-lg shadow-lg",
//             themeAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
//           )}>
//             {role === "super_admin" ? <Crown className="size-5" /> : <Zap className="size-5 fill-current" />}
//           </div>
//           <div className="flex flex-col min-w-0">
//             <span className={cn("font-black tracking-[0.25em] uppercase text-[7px] md:text-[8px] italic", themeAmber ? "text-amber-500/40" : "text-primary/40")}>
//               NODE_v16.apex
//             </span>
//             <span className="font-black text-[10px] md:text-[11px] uppercase tracking-tighter text-foreground truncate mt-0.5 italic">
//               {displayName}
//             </span>
//           </div>
//         </div>

//         {/* --- NAVIGATION: HIGH-DENSITY PROTOCOL --- */}
//         <nav className="flex-1 space-y-0.5 p-3 md:p-6 overflow-y-auto scrollbar-hide">
//           <div className="flex items-center gap-2 mb-4 px-2 opacity-20 italic">
//             <Cpu className={cn("size-2.5", themeAmber ? "text-amber-500" : "text-primary")} />
//             <p className="text-[7.5px] font-black uppercase tracking-[0.4em]">Node_Vector</p>
//           </div>

//           {filteredNav.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <Link key={item.name} href={item.href} onClick={() => impact("light")}
//                 className={cn(
//                   "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
//                   isActive 
//                     ? (themeAmber ? "bg-amber-500/10 text-amber-500" : "bg-white/[0.04] text-primary") 
//                     : "text-muted-foreground/20 hover:bg-white/[0.02] hover:text-foreground"
//                 )}
//               >
//                 <item.icon className={cn("size-3.5 shrink-0 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
//                 <span className="text-[9px] font-black uppercase tracking-[0.15em] italic truncate">{item.name}</span>
//                 {isActive && <div className={cn("absolute left-0 w-0.5 h-4 rounded-full", themeAmber ? "bg-amber-500" : "bg-primary")} />}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* --- SYSTEM HUD --- */}
//         <div
//           className="p-4 md:p-6 border-t border-white/5 bg-white/[0.01] space-y-3"
//           style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "1.25rem" }}
//         >
//           <div className={cn("rounded-xl border p-3 transition-all", themeAmber ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-white/[0.01] border-white/5")}>
//             <div className="flex items-center justify-between mb-2 opacity-10 italic">
//               <div className="flex items-center gap-1.5">
//                 <ShieldCheck className={cn("size-2.5", themeAmber ? "text-amber-500" : "text-primary")} />
//                 <p className="text-[7px] font-black uppercase tracking-[0.2em]">Oversight_OK</p>
//               </div>
//               <Activity className={cn("size-2 animate-pulse", themeAmber ? "text-amber-500" : "text-primary")} />
//             </div>
//             <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] italic leading-none", themeAmber ? "text-amber-500/60" : "text-primary/60")}>
//               {nodeStatus}
//             </p>
//           </div>

//           <button onClick={handleLogout} disabled={isLoggingOut}
//             className="w-full h-10 flex items-center justify-between px-3 rounded-lg border border-rose-500/10 bg-rose-500/[0.02] text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95 group"
//           >
//             <span className="text-[8px] font-black uppercase tracking-[0.25em] italic">Disconnect_Node</span>
//             {isLoggingOut ? <Loader2 className="size-3 animate-spin" /> : <LogOut className="size-2.5 opacity-20 group-hover:opacity-100" />}
//           </button>
//         </div>
//       </aside>

//       {/* --- MOBILE_OVERLAY --- */}
//       {isOpen && isMobile && (
//         <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
//       )}
//     </>
//   );
// }


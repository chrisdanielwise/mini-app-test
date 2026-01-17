"use client";

import * as React from "react";
import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ DASHBOARD_SHELL (TMA Hardware-Stitched Standard)
 * Fix: Uses a physical buffer to clear the 27px notch area.
 */
// export function DashboardShell({ children }: { children: React.ReactNode }) {
//   const { flavor } = useLayout();
//   const { impact } = useHaptics();
//   const { isReady, safeArea, viewportHeight } = useDeviceContext();

//   const [isInitialized, setIsInitialized] = useState(false);
//   const isStaffFlavor = flavor === "AMBER";

//   useLayoutEffect(() => {
//     if (typeof window !== "undefined" && WebApp && isReady) {
//       try {
//         WebApp.ready();
//         WebApp.expand();
        
//         // 🛡️ BLOCK NATIVE SWIPES: Prevents the app from sliding away from the notch
//         if (typeof WebApp.disableVerticalSwipes === "function") {
//           WebApp.disableVerticalSwipes();
//         }
        
//         WebApp.setHeaderColor("#000000");
//         WebApp.setBackgroundColor("#000000");
//         setIsInitialized(true);
//         impact("medium");
//       } catch (error) {
//         console.warn("🛰️ [Shell_Sync_Isolated]: Hardware handshake failed.");
//       }
//     }
//   }, [isReady]);

//   if (!isReady) return null;

//   return (
//     /**
//      * ⬛ LAYER 0: THE HARDWARE_LOCK
//      * flex-col creates a vertical stack: Buffer -> Header -> Main -> Nav
//      */
//     <div
//       className={cn(
//         "fixed inset-0 w-full bg-black antialiased overflow-hidden select-none touch-none overscroll-none flex flex-col",
//         isInitialized ? "opacity-100" : "opacity-0 transition-opacity duration-700"
//       )}
//       style={{ 
//         height: `${viewportHeight}px`, 
//         maxHeight: `${viewportHeight}px`,
//         top: 0,
//         left: 0
//       }}
//     >
//       {/* 📐 TOP_BUFFER: The Physical Wall
//           This physically occupies the 27px space. The header starts AFTER this.
//           We use !important via style to ensure it displaces the header. */}
//       <div 
//         style={{ 
//           height: `${Math.max(safeArea.top, 27)}px`,
//           minHeight: `${Math.max(safeArea.top, 27)}px`
//         }} 
//         className="shrink-0 w-full bg-black z-[60] block" 
//       />

//       {/* 🚀 LAYER 1: STATIONARY_HUD_HEADER
//           Now part of the natural Flex flow. No margins needed because the Buffer pushes it. */}
//       <header className="shrink-0 pt-2 pb-4 flex flex-col px-4 bg-black/40 backdrop-blur-3xl border-b border-white/5 z-50">
//         <div className="flex items-center gap-2 opacity-30 italic leading-none mb-1">
//           <Terminal className="size-2.5" />
//           <span className="text-[7px] font-black uppercase tracking-[0.4em]">Mesh_Ingress_v16.31</span>
//         </div>
        
//         <h1 className="text-xl font-black uppercase tracking-[0.2em] text-primary italic leading-none">
//           Merchant Terminal
//         </h1>
        
//         <div className="flex items-center gap-2 mt-2 opacity-50">
//           <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground truncate">
//             Verified Node: Verified_Merchant // ID: 09C55E7C
//           </span>
//         </div>
//       </header>

//       {/* 🌊 LAYER 2: LAMINAR_CONTENT_ENGINE
//           The ONLY volume allowed to scroll vertically. */}
//       <main
//         id="main-scroll-root"
//         className="flex-1 w-full overflow-y-auto overflow-x-hidden relative z-10 scrollbar-none"
//         style={{
//           touchAction: "pan-y", // 🚀 Kinetic Volume Isolation
//           WebkitOverflowScrolling: "touch",
//         }}
//       >
//         <div className="w-full max-w-[1600px] mx-auto flex flex-col p-4">
//           {children}
//         </div>

//         {/* 📐 BOTTOM_SPACER: Clears the Nav Bar + Safe Area */}
//         <div style={{ height: `calc(${safeArea.bottom}px + 100px)` }} className="shrink-0" />
//       </main>

//       {/* 🛰️ LAYER 3: STATIONARY_HUD_NAV
//           Stationary at the hardware bottom. */}
//       <nav 
//         className="shrink-0 bg-black/40 backdrop-blur-3xl border-t border-white/5 z-50"
//         style={{ paddingBottom: `${safeArea.bottom}px` }}
//       >
//         <div className="h-16 flex items-center justify-around px-2" />
//       </nav>
//     </div>
//   );
// }

export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string; }) {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <div className="flex flex-col gap-1.5 mb-6 animate-in fade-in slide-in-from-left-2 duration-500 min-w-0">
      <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground truncate">
        {(title || "").split(" ").map((word, i) => (
          <React.Fragment key={i}>
            <span className={cn(i === 1 && (isStaff ? "text-amber-500" : "text-primary"))}>
              {word}
            </span>{" "}
          </React.Fragment>
        ))}
      </h1>
      <div className="flex items-center gap-3">
        <div className={cn("h-[0.5px] w-8", isStaff ? "bg-amber-500/20" : "bg-primary/20")} />
        <p className="text-[7.5px] text-muted-foreground/30 font-black uppercase tracking-[0.3em] italic leading-none whitespace-nowrap">
          {subtitle || "STATUS_OPTIMAL"}
        </p>
      </div>
    </div>
  );
}
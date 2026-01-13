// "use client";

// import { createContext, useContext, useEffect, useState, type ReactNode, useCallback, useRef } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useTelegram } from "@/lib/hooks/use-telegram";
// import { useAuth } from "@/lib/hooks/use-auth";
// import { LoadingScreen } from "@/components/ui/loading-spinner";
// import { initializeNativeAppMode } from "@/lib/telegram/webapp";

// export interface TelegramContextValue {
//   auth: ReturnType<typeof useAuth>;
//   isReady: boolean;
//   isTelegram: boolean;
//   user: any; 
//   getInitData: () => string | null;
//   setBackButton: (visible: boolean, onClick?: () => void) => void;
//   setMainButton: (params: any) => void;
//   hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "warning" | "error") => void;
// }

// const TelegramContext = createContext<TelegramContextValue | null>(null);

// /**
//  * 🛰️ TELEGRAM IDENTITY ENGINE
//  * Logic: Hardened Identity Handshake with One-Shot Execution.
//  * Fixed: Explicitly gates authentication logic on login routes to prevent refresh storms.
//  */
// export function TelegramProvider({ children }: { children: ReactNode }) {
//   const telegram = useTelegram();
//   const auth = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   const [mounted, setMounted] = useState(false);
//   const [isRedirecting, setIsRedirecting] = useState(false);
  
//   // 🛡️ THE IDENTITY LOCK: Prevents redundant authentication cycles
//   const handshakeLock = useRef(false);

//   // 1. HARDWARE SYNC
//   useEffect(() => {
//     setMounted(true);
//     if (telegram.isReady && telegram.isTelegram) {
//       initializeNativeAppMode();
//     }
//   }, [telegram.isReady, telegram.isTelegram]);

//   /**
//    * 🔐 IDENTITY HANDSHAKE PROTOCOL
//    * Logic: Idempotent execution.
//    */
//   const performHandshake = useCallback(async () => {
//     // 🛡️ PASSIVE GATE: Never auto-handshake on the login page.
//     // This allows the user to manually trigger login without the provider 
//     // fighting for control over the redirect state.
//     if (pathname === "/dashboard/login") return;

//     if (
//       !telegram.isReady || 
//       auth.isAuthenticated || 
//       auth.isLoading || 
//       handshakeLock.current
//     ) {
//       return;
//     }

//     const initData = telegram.getInitData();
//     if (!initData) return;

//     try {
//       handshakeLock.current = true;
      
//       console.log("🔐 [Identity_Sync] Performing Handshake...");
//       const session = await auth.authenticate(); // Adjusted to match your useAuth method name
      
//       if (!session) {
//         handshakeLock.current = false;
//         return;
//       }

//       const role = session.role?.toUpperCase();
//       const isStaff = ["MERCHANT", "PLATFORM_MANAGER", "SUPER_ADMIN", "STAFF"].includes(role);

//       if (isStaff && (pathname === "/" || pathname === "/dashboard/login")) {
//         setIsRedirecting(true);
//         telegram.hapticFeedback("success");
//         router.replace("/dashboard");
//       } else if (pathname === "/") {
//         setIsRedirecting(true);
//         router.replace("/home");
//       }
//     } catch (err) {
//       handshakeLock.current = false;
//       console.error("❌ [Handshake_Failure] Identity link rejected.");
//       telegram.hapticFeedback("error");
//     }
//   }, [telegram, auth, router, pathname]);

//   // 2. TRIGGER SYNC
//   useEffect(() => {
//     // Ensure we don't handshake on the login page or if already authorized
//     if (telegram.isReady && !auth.isAuthenticated && pathname !== "/dashboard/login") {
//       performHandshake();
//     }
//   }, [telegram.isReady, auth.isAuthenticated, performHandshake, pathname]);

//   // --- RENDERING BARRIER ---
//   if (!mounted || (telegram.isTelegram && !telegram.isReady) || isRedirecting) {
//     return <LoadingScreen message="Establishing Secure Node Link..." />;
//   }

//   return (
//     <TelegramContext.Provider value={{ ...telegram, auth, user: auth.user }}>
//       <div className="relative flex min-h-[100dvh] w-full flex-col bg-background selection:bg-primary/30 antialiased overflow-x-hidden">
//         {children}
//         <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
//       </div>
//     </TelegramContext.Provider>
//   );
// }

// export const useTelegramContext = () => {
//   const context = useContext(TelegramContext);
//   if (!context) throw new Error("useTelegramContext must be used within a TelegramProvider");
//   return context;
// };
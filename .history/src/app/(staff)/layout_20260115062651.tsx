import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TelegramProvider } from "@/components/providers/telegram-provider";
import { LayoutProvider } from "@/context/layout-provider";

export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  
  // 🛡️ 1. TRUST THE PROXY (Middleware already did the work)
  const userId = headerList.get("x-user-id");
  const userRole = headerList.get("x-user-role")?.toUpperCase(); 
  const xPath = headerList.get("x-invoke-path") || "";

  // 🛡️ 2. THE LOOP BREAKER
  if (xPath === "/" || xPath.includes("login")) {
    return <>{children}</>;
  }

  // 🛡️ 3. INSTANT AUTH CHECK (No DB Call)
  if (!userId) {
    redirect("/login?reason=auth_required");
  }

  // 🛡️ 4. ROLE AUTHORIZATION (Final Gate)
  // We use the role from the Header. If it's 'USER', they can't be here.
  const AUTHORIZED_ROLES = ["SUPER_ADMIN", "MERCHANT", "AMBER", "PLATFORM_MANAGER"];
  
  if (!userRole || !AUTHORIZED_ROLES.includes(userRole)) {
    console.error(`🚫 [Auth_Denial]: User ${userId} with role ${userRole} attempted dashboard access.`);
    redirect("/unauthorized"); // This is where your loop is likely ending up
  }

  // 🛰️ 5. CONTEXT MAPPING (Minimal)
  const dashboardContext = {
    userId,
    role: userRole,
  };

  return (
    <TelegramProvider>
      <LayoutProvider>
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
          {/* Dashboard Components */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </LayoutProvider>
    </TelegramProvider>
  );
}
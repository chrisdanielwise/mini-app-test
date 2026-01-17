/**
 * 🏛️ STAFF_ROOT_LAYOUT (Institutional Apex v2026.1.18)
 * Architecture: Server-Side Identity Gate with Laminar Membrane.
 * Fix: Added flex-1 and min-w-0/min-h-0 to the content volume to prevent 
 * horizontal blowout and vertical cropping of tables.
 */
export default async function StaffRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  
  const userId = headerList.get("x-user-id");
  const rawRole = headerList.get("x-user-role") || "user";
  const userRole = rawRole.toLowerCase();
  const xPath = headerList.get("x-invoke-path") || "";

  if (xPath === "/" || xPath.includes("/login")) {
    return <>{children}</>;
  }

  if (!userId) {
    redirect("/login?reason=auth_required");
  }

  const AUTHORIZED_ROLES = ["super_admin", "merchant", "amber", "platform_manager"];
  
  if (!AUTHORIZED_ROLES.includes(userRole)) {
    redirect("/unauthorized");
  }

  const dashboardContext = { userId, role: userRole };

  return (
    <DeviceProvider>
      <TelegramProvider>
        <LayoutProvider>
          {/* 🌊 PRIMARY MEMBRANE */}
          <div className="flex h-[100dvh] w-full overflow-hidden bg-background selection:bg-primary/30">
            
            <DashboardSidebar context={dashboardContext as any} />
            
            {/* 🛡️ FIX: Added min-w-0 here to allow internal content to shrink correctly */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
              
              <DashboardTopNav context={dashboardContext as any} />
              
              <DashboardLayoutClient userRole={userRole}>
                {/* 🚀 KINETIC VOLUME: The Scrolling Content Shell */}
                {/* 🛡️ FIX: Added flex-1, min-w-0, and min-h-0 to the child wrapper */}
                <div className={cn(
                  "flex-1 min-w-0 min-h-0 relative", 
                  "px-6 md:px-10 lg:px-14 pt-4 md:pt-6 pb-20", 
                  "animate-in fade-in slide-in-from-bottom-2 duration-700"
                )}>
                  {children}
                </div>
              </DashboardLayoutClient>
            </div>

            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('/assets/grid.svg')] bg-[length:60px_60px]" />
          </div>
        </LayoutProvider>
      </TelegramProvider>
    </DeviceProvider>
  );
}
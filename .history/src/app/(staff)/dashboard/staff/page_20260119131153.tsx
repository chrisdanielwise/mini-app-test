import { Suspense } from "react";
import prisma from "@/lib/db";
import { requireStaff } from "@/lib/auth/session";
import { STAFF_ROLES } from "@/lib/auth/permissions";
// import StaffTable from "./_components/StaffTable";
import { Skeleton } from "@/components/ui/skeleton";
import StaffTable from "@/components/staff/platform-staff-list";

export const metadata = {
  title: "Staff Management | Amber Platform",
};

export default async function StaffListPage() {
  // 🔐 1. Clearance Check (Only staff can see this page)
  const session = await requireStaff();

  // 📡 2. Data Ingress
  const staffMembers = await prisma.user.findMany({
    where: {
      role: { in: STAFF_ROLES as any },
      deletedAt: null,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      role: true,
      telegramId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Platform Staff</h1>
        <p className="text-muted-foreground">
          Manage system-level operators and their hierarchical clearances.
        </p>
      </header>

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <StaffTable
          data={JSON.parse(JSON.stringify(staffMembers))} 
          viewerRole={session.user.role} 
        />
      </Suspense>
    </div>
  );
}
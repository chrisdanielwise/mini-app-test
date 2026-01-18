// 🛡️ SERVER NODE: Physical Data Ingress
import { getSession } from "@/lib/auth/session"; 
import { redirect } from "next/navigation";
import { DashboardClientView } from "./dashboard-client-view";
import AsyncActivityFeed from "@/components/dashboard/async-activity-feed";
import { AsyncRevenueCard } from "@/components/dashboard/async-revenue-card";
import AsyncSubscribersCard from "@/components/dashboard/async-subscribers-card";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <DashboardClientView session={session}>
      {/* 🛰️ COMPOSITION: These components run on the SERVER */}
      <section id="stats-ingress" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AsyncRevenueCard merchantId={session.merchantId} />
        <AsyncSubscribersCard merchantId={session.merchantId} />
      </section>

      <section id="activity-ingress">
        <AsyncActivityFeed merchantId={session.merchantId} />
      </section>
    </DashboardClientView>
  );
}
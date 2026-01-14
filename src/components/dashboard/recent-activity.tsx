import prisma from "@/lib/db";
import { ShieldCheck, LogOut, Zap, RefreshCw } from "lucide-react";

export async function RecentActivity({ merchantId }: { merchantId: string }) {
  const logs = await prisma.activityLog.findMany({
    where: { merchantId },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { actor: true },
  });

  const getIcon = (action: string) => {
    if (action === "LOGIN") return <ShieldCheck className="text-green-500" />;
    if (action === "LOGOUT") return <LogOut className="text-gray-500" />;
    if (action === "REMOTE_WIPE") return <Zap className="text-red-500" />;
    return <RefreshCw className="text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex items-center justify-between p-3 bg-card border rounded-xl">
          <div className="flex items-center gap-3">
            {getIcon(log.action)}
            <div>
              <p className="text-sm font-bold">{log.action}</p>
              <p className="text-xs text-muted-foreground">{log.actor?.firstName} • {new Date(log.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono opacity-50">{log.id.slice(0, 8)}</span>
        </div>
      ))}
    </div>
  );
}
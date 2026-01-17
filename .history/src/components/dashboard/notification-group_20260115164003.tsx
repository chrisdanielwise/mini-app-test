// inside src/components/dashboard/dashboard-header.tsx
import { NotificationGroup } from "./notification-group";

export function DashboardHeader() {
  return (
    <header className="...">
      {/* ... Search & Brand ... */}
      
      <div className="flex items-center gap-4">
        {/* All notification logic is now inside this single node */}
        <NotificationGroup />
        <UserAccountDropdown />
      </div>
    </header>
  );
}
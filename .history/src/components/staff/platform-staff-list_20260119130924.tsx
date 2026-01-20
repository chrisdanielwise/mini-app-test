"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldCheck, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { updateStaffRoleAction } from "@/lib/actions/staff.actions";
// import { updateStaffRoleAction } from "../_actions/staff.actions";

interface StaffTableProps {
  data: any[];
  viewerRole: string;
}

export default function StaffTable({ data, viewerRole }: StaffTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleRoleUpdate = (userId: string, newRole: string) => {
    startTransition(async () => {
      const result = await updateStaffRoleAction(userId, newRole);
      if (result.success) {
        toast.success("Identity Node Updated");
      } else {
        toast.error(result.error || "Update Failed");
      }
    });
  };

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Operator</TableHead>
            <TableHead>Clearance</TableHead>
            <TableHead>Telegram ID</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">
                {staff.firstName} {staff.lastName}
                <div className="text-xs text-muted-foreground">@{staff.username}</div>
              </TableCell>
              <TableCell>
                <Badge variant={staff.role === "super_admin" ? "destructive" : "secondary"}>
                  {staff.role.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{staff.telegramId}</TableCell>
              <TableCell className="text-sm">
                {new Date(staff.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isPending}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRoleUpdate(staff.id, "platform_manager")}>
                      <ShieldCheck className="mr-2 h-4 w-4" /> Promote to Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleRoleUpdate(staff.id, "user")}
                    >
                      <UserMinus className="mr-2 h-4 w-4" /> Revoke Staff Status
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
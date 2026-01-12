import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";
import { getMerchantActivity } from "@/src/lib/services/merchant.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default async function TransactionsPage() {
  const session = await requireMerchantSession();

  // Fetch payment records from the database
  const transactions = await getMerchantActivity(session.merchant.id);

  return (
    <div className="space-y-6 p-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground">
            Historical log of all signal service payments.
          </p>
        </div>
        <Button variant="outline" className="rounded-xl font-bold">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold uppercase text-[10px]">
                Date
              </TableHead>
              <TableHead className="font-bold uppercase text-[10px]">
                Customer
              </TableHead>
              <TableHead className="font-bold uppercase text-[10px]">
                Service
              </TableHead>
              <TableHead className="font-bold uppercase text-[10px]">
                Amount
              </TableHead>
              <TableHead className="font-bold uppercase text-[10px]">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <td
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground italic"
                >
                  No transactions found.
                </td>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs font-mono">
                    {format(new Date(tx.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {tx.user?.fullName || tx.user?.username || "Anonymous"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground italic">
                    {tx.serviceName}
                  </TableCell>
                  <TableCell className="font-black">${tx.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === "SUCCESSFUL" ? "default" : "secondary"
                      }
                      className={
                        tx.status === "SUCCESSFUL"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : ""
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

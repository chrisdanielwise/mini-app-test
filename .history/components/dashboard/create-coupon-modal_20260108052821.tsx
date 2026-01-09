"use client"

import { useState } from "react"
import { createCouponAction } from "@/lib/actions/coupons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Tag } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CreateCouponModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl font-bold">
          <Plus className="mr-2 h-4 w-4" /> Create Coupon
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 uppercase italic font-black">
            <Tag className="h-5 w-5 text-primary" />
            New Discount Code
          </DialogTitle>
        </DialogHeader>
        <form action={async (fd) => {
          await createCouponAction(fd)
          setOpen(false)
        }} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code (e.g. SAVE50)</Label>
            <Input id="code" name="code" placeholder="WINTER2026" required className="rounded-xl" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select name="type" defaultValue="PERCENTAGE">
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input id="value" name="value" type="number" step="0.01" required className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
            <Input id="expiresAt" name="expiresAt" type="date" className="rounded-xl" />
          </div>

          <Button type="submit" className="w-full rounded-xl font-bold py-6">
            Generate Coupon
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

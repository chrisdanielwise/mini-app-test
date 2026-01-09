"use client"

import { useState } from "react"
import { createServiceAction } from "@/lib/actions/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Package, DollarSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CreateServiceModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl font-bold bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 uppercase italic font-black">
            <Package className="h-5 w-5 text-primary" />
            New Signal Service
          </DialogTitle>
        </DialogHeader>
        <form action={async (fd) => {
          await createServiceAction(fd)
          setOpen(false)
        }} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input id="name" name="name" placeholder="VIP Gold Signals" required className="rounded-xl" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea id="description" name="description" placeholder="Daily 5-10 signals with 90% accuracy..." className="rounded-xl resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="price" name="price" type="number" step="0.01" placeholder="49.99" required className="rounded-xl pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select name="interval" defaultValue="MONTHLY">
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                  <SelectItem value="ONCE">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full rounded-xl font-bold py-6">
            Create Service Tier
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
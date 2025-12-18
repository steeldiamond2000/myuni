"use client"

import type React from "react"

import { useState, type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { assignEmployee, cancelAssignment, reassignEmployee } from "@/app/actions/assignments"

type Asset = {
  id: string
  name: string
  inventoryNumber: string
  currentAssignment: {
    employee: {
      id: string
      firstName: string
      lastName: string
    }
    startDate: Date
    comment: string | null
  } | null
}

type Props = {
  children: ReactNode
  asset: Asset
}

export default function AssignEmployeeDialog({ children, asset }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState<"assign" | "reassign" | "cancel">("assign")
  const [employees, setEmployees] = useState<any[]>([])
  const [formData, setFormData] = useState({
    employeeId: "",
    startDate: new Date().toISOString().split("T")[0],
    comment: "",
  })

  useEffect(() => {
    if (open) {
      fetchEmployees()
      if (asset.currentAssignment) {
        setAction("reassign")
      } else {
        setAction("assign")
      }
    }
  }, [open])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      toast.error("Hodimlarni yuklab bo'lmadi")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (action === "cancel") {
        await cancelAssignment(asset.id, formData.comment, new Date(formData.startDate))
        toast.success("Javobgarlik bekor qilindi")
      } else if (action === "reassign") {
        await reassignEmployee(asset.id, formData.employeeId, new Date(formData.startDate), formData.comment)
        toast.success("Javobgar o'zgartirildi")
      } else {
        await assignEmployee(asset.id, formData.employeeId, new Date(formData.startDate), formData.comment)
        toast.success("Javobgar biriktirildi")
      }
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Javobgarlik boshqarish</DialogTitle>
          <DialogDescription>
            {asset.name} ({asset.inventoryNumber})
          </DialogDescription>
        </DialogHeader>

        {asset.currentAssignment && (
          <div className="p-3 bg-slate-50 rounded-lg space-y-1">
            <p className="text-sm font-medium">Hozirgi javobgar:</p>
            <p className="text-sm">
              {asset.currentAssignment.employee.firstName} {asset.currentAssignment.employee.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              Boshlanish: {new Date(asset.currentAssignment.startDate).toLocaleDateString("uz-UZ")}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Amal</Label>
            <Select value={action} onValueChange={(val: any) => setAction(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {!asset.currentAssignment && <SelectItem value="assign">Javobgar biriktirish</SelectItem>}
                {asset.currentAssignment && <SelectItem value="reassign">Javobgarni o'zgartirish</SelectItem>}
                {asset.currentAssignment && <SelectItem value="cancel">Javobgarlikni bekor qilish</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          {action !== "cancel" && (
            <div className="space-y-2">
              <Label htmlFor="employee">Hodim *</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(val) => setFormData({ ...formData, employeeId: val })}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Hodimni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} - {emp.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="startDate">{action === "cancel" ? "Bekor qilish sanasi" : "Boshlanish sanasi"} *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Izoh</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Qo'shimcha ma'lumot..."
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isLoading || (action !== "cancel" && !formData.employeeId)}>
              {isLoading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

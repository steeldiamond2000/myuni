"use client"

import type React from "react"
import { useState, type ReactNode } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createEmployee, updateEmployee } from "@/app/actions/employees"
import { Loader2 } from "lucide-react"

type EmployeeFormData = {
  id?: string
  firstName: string
  lastName: string
  position: string
  phone: string
  hireDate: Date
}

type Props = {
  children: ReactNode
  employee?: EmployeeFormData
}

export default function EmployeeDialog({ children, employee }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: employee?.firstName || "",
    lastName: employee?.lastName || "",
    position: employee?.position || "",
    phone: employee?.phone || "",
    hireDate: employee?.hireDate || new Date(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (employee?.id) {
        const result = await updateEmployee(employee.id, formData)
        if (result.success) {
          toast.success("Hodim ma'lumotlari yangilandi")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Xatolik yuz berdi")
        }
      } else {
        const result = await createEmployee(formData)
        if (result.success) {
          toast.success("Yangi hodim qo'shildi")
          setOpen(false)
          setFormData({
            firstName: "",
            lastName: "",
            position: "",
            phone: "",
            hireDate: new Date(),
          })
          router.refresh()
        } else {
          toast.error(result.error || "Xatolik yuz berdi")
        }
      }
    } catch (error) {
      toast.error("Kutilmagan xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{employee ? "Hodimni tahrirlash" : "Yangi hodim qo'shish"}</DialogTitle>
          <DialogDescription>
            {employee ? "Hodim ma'lumotlarini yangilang" : "Yangi hodim qo'shish uchun ma'lumotlarni to'ldiring"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ism *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Familiya *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Lavozim *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+998901234567"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hireDate">Ishga kirgan sana *</Label>
            <Input
              id="hireDate"
              type="date"
              value={formData.hireDate instanceof Date ? formData.hireDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setFormData({ ...formData, hireDate: new Date(e.target.value) })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                "Saqlash"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

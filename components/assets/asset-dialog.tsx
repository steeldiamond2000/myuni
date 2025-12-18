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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { createAsset, updateAsset } from "@/app/actions/assets"

type AssetFormData = {
  id?: string
  name: string
  model: string
  inventoryNumber: string
  category: string
  purchaseDate: Date
  quantity: number
  status: string
}

type Props = {
  children: ReactNode
  asset?: AssetFormData
}

export default function AssetDialog({ children, asset }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<AssetFormData>({
    name: asset?.name || "",
    model: asset?.model || "",
    inventoryNumber: asset?.inventoryNumber || "",
    category: asset?.category || "material",
    purchaseDate: asset?.purchaseDate || new Date(),
    quantity: asset?.quantity || 1,
    status: asset?.status || "new",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (asset?.id) {
        await updateAsset(asset.id, formData)
        toast.success("Buyum ma'lumotlari yangilandi")
      } else {
        await createAsset(formData)
        toast.success("Yangi buyum qo'shildi va QR kod yaratildi")
      }
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      if (error.message.includes("unique")) {
        toast.error("Bu inventar raqami allaqachon mavjud")
      } else {
        toast.error("Xatolik yuz berdi")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{asset ? "Buyumni tahrirlash" : "Yangi buyum qo'shish"}</DialogTitle>
          <DialogDescription>
            {asset ? "Buyum ma'lumotlarini yangilang" : "Yangi buyum qo'shish uchun ma'lumotlarni to'ldiring"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Buyum nomi *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masalan: Stol, Printer, Kompyuter"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inventoryNumber">Inventar raqami *</Label>
              <Input
                id="inventoryNumber"
                value={formData.inventoryNumber}
                onChange={(e) => setFormData({ ...formData, inventoryNumber: e.target.value })}
                placeholder="INV-2025-001"
                required
                disabled={isLoading || !!asset}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategoriya *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category" disabled={isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronic">Elektron qurilma</SelectItem>
                  <SelectItem value="material">Moddiy buyum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status" disabled={isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Yangi</SelectItem>
                  <SelectItem value="good">Qoniqarli</SelectItem>
                  <SelectItem value="needs_repair">Ta'mirtalab</SelectItem>
                  <SelectItem value="old">Eski</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="HP LaserJet Pro M404n"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Soni *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Sotib olingan sana *</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={formData.purchaseDate instanceof Date ? formData.purchaseDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setFormData({ ...formData, purchaseDate: new Date(e.target.value) })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

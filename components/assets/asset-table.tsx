"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, QrCode, UserPlus } from "lucide-react"
import AssetDialog from "./asset-dialog"
import DeleteAssetDialog from "./delete-asset-dialog"
import QRCodeDialog from "./qr-code-dialog"
import AssignEmployeeDialog from "./assign-employee-dialog"

type Asset = {
  id: string
  name: string
  model: string | null
  inventoryNumber: string
  category: string
  purchaseDate: Date
  quantity: number
  status: string
  qrCodeValue: string
  currentAssignment: {
    employee: {
      id: string
      firstName: string
      lastName: string
      position: string
    }
    startDate: Date
    comment: string | null
  } | null
}

const STATUS_LABELS: Record<string, string> = {
  new: "Yangi",
  good: "Qoniqarli",
  needs_repair: "Ta'mirtalab",
  old: "Eski",
}

const CATEGORY_LABELS: Record<string, string> = {
  electronic: "Elektron qurilma",
  material: "Moddiy buyum",
}

export default function AssetTable({ assets }: { assets: Asset[] }) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [responsibleFilter, setResponsibleFilter] = useState<string>("all")

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.inventoryNumber.toLowerCase().includes(search.toLowerCase()) ||
      (asset.model && asset.model.toLowerCase().includes(search.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter
    const matchesResponsible =
      responsibleFilter === "all" ||
      (responsibleFilter === "assigned" && asset.currentAssignment) ||
      (responsibleFilter === "unassigned" && !asset.currentAssignment)

    return matchesSearch && matchesCategory && matchesStatus && matchesResponsible
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buyum nomi, inventar raqami yoki model bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Kategoriya" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha kategoriya</SelectItem>
            <SelectItem value="electronic">Elektron qurilma</SelectItem>
            <SelectItem value="material">Moddiy buyum</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha status</SelectItem>
            <SelectItem value="new">Yangi</SelectItem>
            <SelectItem value="good">Qoniqarli</SelectItem>
            <SelectItem value="needs_repair">Ta'mirtalab</SelectItem>
            <SelectItem value="old">Eski</SelectItem>
          </SelectContent>
        </Select>
        <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Javobgarlik" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hammasi</SelectItem>
            <SelectItem value="assigned">Javobgar biriktirilgan</SelectItem>
            <SelectItem value="unassigned">Javobgar yo'q</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Buyumlar topilmadi</div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomi</TableHead>
                <TableHead>Inventar №</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Kategoriya</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead>Javobgar</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell className="font-mono text-sm">{asset.inventoryNumber}</TableCell>
                  <TableCell>{asset.model || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{CATEGORY_LABELS[asset.category]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        asset.status === "new" ? "default" : asset.status === "good" ? "secondary" : "destructive"
                      }
                    >
                      {STATUS_LABELS[asset.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{format(new Date(asset.purchaseDate), "dd.MM.yyyy")}</TableCell>
                  <TableCell>
                    {asset.currentAssignment ? (
                      <div className="text-sm">
                        <div className="font-medium">
                          {asset.currentAssignment.employee.firstName} {asset.currentAssignment.employee.lastName}
                        </div>
                        <div className="text-muted-foreground text-xs">{asset.currentAssignment.employee.position}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Javobgar yo'q</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <QRCodeDialog assetId={asset.id} assetName={asset.name} qrValue={asset.qrCodeValue}>
                        <Button variant="ghost" size="icon" title="QR kodni ko'rish">
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </QRCodeDialog>
                      <AssignEmployeeDialog asset={asset}>
                        <Button variant="ghost" size="icon" title="Javobgar belgilash">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </AssignEmployeeDialog>
                      <AssetDialog asset={asset}>
                        <Button variant="ghost" size="icon" title="Tahrirlash">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </AssetDialog>
                      <DeleteAssetDialog assetId={asset.id} assetName={asset.name}>
                        <Button variant="ghost" size="icon" title="O'chirish">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DeleteAssetDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Jami: {filteredAssets.length} ta buyum
        {(categoryFilter !== "all" || statusFilter !== "all" || responsibleFilter !== "all" || search) &&
          ` (${assets.length} tadan)`}
      </div>
    </div>
  )
}

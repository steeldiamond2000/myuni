"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

type Assignment = {
  id: string
  startDate: Date
  endDate: Date | null
  comment: string | null
  isActive: boolean
  asset: {
    id: string
    name: string
    inventoryNumber: string
  }
  employee: {
    id: string
    firstName: string
    lastName: string
    position: string
  }
}

export default function AssignmentHistoryTable({ assignments }: { assignments: Assignment[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.asset.name.toLowerCase().includes(search.toLowerCase()) ||
      assignment.asset.inventoryNumber.toLowerCase().includes(search.toLowerCase()) ||
      assignment.employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
      assignment.employee.lastName.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && assignment.isActive) ||
      (statusFilter === "inactive" && !assignment.isActive)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buyum yoki hodim nomi bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha</SelectItem>
            <SelectItem value="active">Aktiv</SelectItem>
            <SelectItem value="inactive">Yopilgan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Yozuvlar topilmadi</div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyum</TableHead>
                <TableHead>Inventar №</TableHead>
                <TableHead>Hodim</TableHead>
                <TableHead>Lavozim</TableHead>
                <TableHead>Boshlanish</TableHead>
                <TableHead>Tugash</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Izoh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.asset.name}</TableCell>
                  <TableCell className="font-mono text-sm">{assignment.asset.inventoryNumber}</TableCell>
                  <TableCell>
                    {assignment.employee.firstName} {assignment.employee.lastName}
                  </TableCell>
                  <TableCell>{assignment.employee.position}</TableCell>
                  <TableCell className="text-sm">{format(new Date(assignment.startDate), "dd.MM.yyyy")}</TableCell>
                  <TableCell className="text-sm">
                    {assignment.endDate ? format(new Date(assignment.endDate), "dd.MM.yyyy") : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={assignment.isActive ? "default" : "secondary"}>
                      {assignment.isActive ? "Aktiv" : "Yopilgan"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{assignment.comment || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Jami: {filteredAssignments.length} ta yozuv
        {(statusFilter !== "all" || search) && ` (${assignments.length} tadan)`}
      </div>
    </div>
  )
}

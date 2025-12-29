"use client"

import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import ResponsibilityQRDialog from "./responsibility-qr-dialog"
import { QrCode, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Employee = {
  id: string
  firstName: string
  lastName: string
}

type Assignment = {
  id: string
  asset: {
    id: string
    name: string
    inventoryNumber: string
    qrCodeValue: string | null
  }
  employee: {
    id: string
    firstName: string
    lastName: string
  }
}

type Props = {
  employees: Employee[]
  assignments: Assignment[]
}

const ITEMS_PER_PAGE = 30

export default function ResponsibilitiesClient({ employees, assignments }: Props) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")
  const [lastViewedQRCode, setLastViewedQRCode] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter va pagination
  const filteredAssignments = useMemo(() => {
    if (selectedEmployeeId === "all") {
      return assignments
    }
    return assignments.filter((a) => a.employee.id === selectedEmployeeId)
  }, [assignments, selectedEmployeeId])

  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE)
  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAssignments.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAssignments, currentPage])

  // Hodim o'zgarganda 1-sahifaga qaytish
  const handleEmployeeChange = (value: string) => {
    setSelectedEmployeeId(value)
    setCurrentPage(1)
  }

  // QR kod ko'rilganda
  const handleQRViewed = (assignmentId: string) => {
    setLastViewedQRCode(assignmentId)
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Hodim:</span>
          <Select value={selectedEmployeeId} onValueChange={handleEmployeeChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Hodimni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha hodimlar</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">Jami: {filteredAssignments.length} ta</div>
      </div>

      {/* Table */}
      {paginatedAssignments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          {selectedEmployeeId === "all" ? "Hozircha faol javobgarliklar yo'q" : "Bu hodimda faol javobgarliklar yo'q"}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Javobgar</TableHead>
                <TableHead>Inventar raqami</TableHead>
                <TableHead>Buyum nomi</TableHead>
                <TableHead className="w-24 text-center">QR Kod</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAssignments.map((assignment, index) => {
                const isViewed = lastViewedQRCode === assignment.id
                const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1

                return (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium text-muted-foreground">{rowNumber}</TableCell>
                    <TableCell className="font-medium">
                      {assignment.employee.firstName} {assignment.employee.lastName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{assignment.asset.inventoryNumber}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{assignment.asset.name}</TableCell>
                    <TableCell className="text-center">
                      {assignment.asset.qrCodeValue ? (
                        <ResponsibilityQRDialog
                          assetId={assignment.asset.id}
                          assetName={assignment.asset.name}
                          inventoryNumber={assignment.asset.inventoryNumber}
                          qrValue={assignment.asset.qrCodeValue}
                          onViewed={() => handleQRViewed(assignment.id)}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "gap-1",
                              isViewed && "border-green-500 border-2 bg-green-50 hover:bg-green-100",
                            )}
                          >
                            <QrCode className={cn("h-4 w-4", isViewed && "text-green-600")} />
                          </Button>
                        </ResponsibilityQRDialog>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Sahifa {currentPage} / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Oldingi
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Keyingi
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

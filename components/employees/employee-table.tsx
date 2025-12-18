"use client"
import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Search } from "lucide-react"
import EmployeeDialog from "./employee-dialog"
import DeleteEmployeeDialog from "./delete-employee-dialog"

type Employee = {
  id: string
  firstName: string
  lastName: string
  position: string
  phone: string | null
  hireDate: Date
  assignedAssetsCount: number
}

export default function EmployeeTable({ employees }: { employees: Employee[] }) {
  const [search, setSearch] = useState("")

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ism, familiya yoki lavozim bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Hodimlar topilmadi</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ism</TableHead>
                <TableHead>Familiya</TableHead>
                <TableHead>Lavozim</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Ishga kirgan sana</TableHead>
                <TableHead>Biriktirilgan buyumlar</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.phone || "-"}</TableCell>
                  <TableCell>{format(new Date(employee.hireDate), "dd.MM.yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={employee.assignedAssetsCount > 0 ? "default" : "secondary"}>
                      {employee.assignedAssetsCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <EmployeeDialog employee={employee}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </EmployeeDialog>
                      <DeleteEmployeeDialog
                        employeeId={employee.id}
                        employeeName={`${employee.firstName} ${employee.lastName}`}
                        hasAssignments={employee.assignedAssetsCount > 0}
                      >
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DeleteEmployeeDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

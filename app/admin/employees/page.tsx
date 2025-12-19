import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import EmployeeTable from "@/components/employees/employee-table"
import EmployeeDialog from "@/components/employees/employee-dialog"
import ExportEmployeesButton from "@/components/employees/export-employees-button"
import { Suspense } from "react"

export const dynamic = "force-dynamic"
export const revalidate = 30

async function getEmployees() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            asset: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return employees.map((emp) => ({
      ...emp,
      assignedAssetsCount: emp.assignments.length,
    }))
  } catch (error) {
    console.error("[v0] getEmployees error:", error)
    return []
  }
}

export default async function EmployeesPage() {
  const employeesWithCount = await getEmployees()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hodimlar</h1>
          <p className="text-muted-foreground">Xodimlarni boshqarish va ko'rish</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportEmployeesButton employees={employeesWithCount} />
          <EmployeeDialog>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Yangi hodim
            </Button>
          </EmployeeDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcha hodimlar ({employeesWithCount.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Yuklanmoqda...</div>}>
            <EmployeeTable employees={employeesWithCount} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AssignmentHistoryTable from "@/components/assignments/assignment-history-table"
import ExportAssignmentsButton from "@/components/assignments/export-assignments-button"

export default async function AssignmentsPage() {
  const assignments = await prisma.assetAssignment.findMany({
    include: {
      asset: true,
      employee: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Javobgarlik Tarixi</h1>
          <p className="text-muted-foreground">Barcha moddiy javobgarlik yozuvlari</p>
        </div>
        <ExportAssignmentsButton assignments={assignments} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcha tarix ({assignments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <AssignmentHistoryTable assignments={assignments} />
        </CardContent>
      </Card>
    </div>
  )
}

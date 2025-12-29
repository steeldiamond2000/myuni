import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ResponsibilitiesClient from "@/components/responsibilities/responsibilities-client"

export default async function ResponsibilitiesPage() {
  // Barcha hodimlarni olish (filter uchun)
  const employees = await prisma.employee.findMany({
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  })

  // Faol javobgarliklarni olish (QR kodi bor buyumlar)
  const activeAssignments = await prisma.assetAssignment.findMany({
    where: {
      isActive: true,
      asset: {
        qrCodeValue: {
          not: null,
        },
      },
    },
    include: {
      asset: {
        select: {
          id: true,
          name: true,
          inventoryNumber: true,
          qrCodeValue: true,
        },
      },
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Javobgarlar</h1>
        <p className="text-muted-foreground">Barcha moddiy javobgarliklar va QR kodlar</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faol javobgarliklar ({activeAssignments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsibilitiesClient employees={employees} assignments={activeAssignments} />
        </CardContent>
      </Card>
    </div>
  )
}

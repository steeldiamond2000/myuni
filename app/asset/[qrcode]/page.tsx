import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, User, Briefcase, Phone, FileText, Building2 } from "lucide-react"
import { format } from "date-fns"

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

export default async function PublicAssetPage({ params }: { params: Promise<{ qrcode: string }> }) {
  const { qrcode } = await params

  const asset = await prisma.asset.findUnique({
    where: { qrCodeValue: qrcode },
    include: {
      assignments: {
        where: { isActive: true },
        include: {
          employee: true,
        },
      },
    },
  })

  if (!asset) {
    notFound()
  }

  const currentAssignment = asset.assignments[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 text-lg font-semibold text-slate-600">
            <Building2 className="h-5 w-5" />
            Universitet Moddiy-Texnik Baza Tizimi
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-balance">{asset.name}</CardTitle>
                {asset.model && <p className="text-muted-foreground mt-1">{asset.model}</p>}
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Inventar raqami</p>
                <p className="font-mono font-semibold">{asset.inventoryNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Kategoriya</p>
                <Badge variant="outline" className="font-normal">
                  {CATEGORY_LABELS[asset.category]}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={asset.status === "new" ? "default" : asset.status === "good" ? "secondary" : "destructive"}
                >
                  {STATUS_LABELS[asset.status]}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Sotib olingan sana
                </div>
                <p className="font-medium">{format(new Date(asset.purchaseDate), "dd.MM.yyyy")}</p>
              </div>
            </div>

            <Separator />

            {currentAssignment ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Javobgar shaxs
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">To'liq ism</p>
                    <p className="font-semibold text-lg">
                      {currentAssignment.employee.firstName} {currentAssignment.employee.lastName}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        Lavozimi
                      </div>
                      <p className="font-medium">{currentAssignment.employee.position}</p>
                    </div>

                    {currentAssignment.employee.phone && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          Telefon
                        </div>
                        <p className="font-medium">{currentAssignment.employee.phone}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Javobgarlik boshlangan sana
                    </div>
                    <p className="font-medium">{format(new Date(currentAssignment.startDate), "dd.MM.yyyy")}</p>
                  </div>

                  {currentAssignment.comment && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        Izoh
                      </div>
                      <p className="text-sm bg-white p-3 rounded border">{currentAssignment.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">Bu buyumga hozircha javobgar shaxs biriktirilmagan</p>
              </div>
            )}

            <Separator />

            <div className="text-center text-sm text-muted-foreground">
              <p>Ma'lumotlar faqat ko'rish uchun</p>
              <p className="mt-1">Tahrirlash uchun admin paneliga murojaat qiling</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">Bu sahifa QR kod orqali ochildi va faqat ko'rish uchun mo'ljallangan</p>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ qrcode: string }> }) {
  const { qrcode } = await params
  const asset = await prisma.asset.findUnique({
    where: { qrCodeValue: qrcode },
  })

  if (!asset) {
    return {
      title: "Buyum topilmadi",
    }
  }

  return {
    title: `${asset.name} - Universitet MTB`,
    description: `Inventar: ${asset.inventoryNumber}`,
  }
}

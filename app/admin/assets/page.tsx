import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import AssetTable from "@/components/assets/asset-table"
import AssetDialog from "@/components/assets/asset-dialog"
import ExportAssetsButton from "@/components/assets/export-assets-button"
import { Suspense } from "react"

export const dynamic = "force-dynamic"
export const revalidate = 30

async function getAssets() {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            employee: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return assets.map((asset) => ({
      ...asset,
      currentAssignment: asset.assignments[0] || null,
    }))
  } catch (error) {
    console.error("[v0] getAssets error:", error)
    return []
  }
}

export default async function AssetsPage() {
  const assetsWithResponsible = await getAssets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buyumlar</h1>
          <p className="text-muted-foreground">Moddiy-texnik bazani boshqarish</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportAssetsButton assets={assetsWithResponsible} />
          <AssetDialog>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Yangi buyum
            </Button>
          </AssetDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcha buyumlar ({assetsWithResponsible.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Yuklanmoqda...</div>}>
            <AssetTable assets={assetsWithResponsible} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

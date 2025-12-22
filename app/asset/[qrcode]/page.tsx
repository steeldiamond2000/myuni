"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"
import {
  Calendar,
  User,
  Briefcase,
  Phone,
  FileText,
  Hash,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Package,
  AlertCircle,
} from "lucide-react"

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  new: { label: "Yangi", color: "bg-emerald-500", icon: CheckCircle2 },
  good: { label: "Yaxshi holatda", color: "bg-blue-500", icon: CheckCircle2 },
  needs_repair: { label: "Ta'mir talab", color: "bg-amber-500", icon: AlertTriangle },
  old: { label: "Eskirgan", color: "bg-red-500", icon: Clock },
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  electronic: { label: "Elektron qurilma", color: "bg-violet-100 text-violet-700 border-violet-200" },
  material: { label: "Moddiy buyum", color: "bg-sky-100 text-sky-700 border-sky-200" },
}

interface AssetData {
  id: string
  name: string
  model?: string
  inventoryNumber: string
  category: string
  status: string
  quantity: number
  purchaseDate: string
  createdAt: string
  assignedEmployee?: {
    firstName: string
    lastName: string
    position: string
    phone?: string
  }
  assignmentDate?: string
  assignmentComment?: string
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function PublicAssetPage() {
  const params = useParams()
  const qrcode = params.qrcode as string

  const [asset, setAsset] = useState<AssetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAsset() {
      try {
        const res = await fetch(`/api/public/asset/${qrcode}`)
        const data = await res.json()

        if (!res.ok || !data.success) {
          setError(data.error || "Buyum topilmadi")
          return
        }

        setAsset(data.asset)
      } catch (err) {
        setError("Server xatosi")
      } finally {
        setLoading(false)
      }
    }

    if (qrcode) {
      fetchAsset()
    }
  }, [qrcode])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 text-emerald-500 mx-auto" />
          <p className="text-slate-400">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Buyum topilmadi</h2>
            <p className="text-slate-400">
              Bu QR kod bilan bog'liq buyum mavjud emas yoki o'chirilgan bo'lishi mumkin.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[asset.status] || STATUS_CONFIG.good
  const categoryConfig = CATEGORY_CONFIG[asset.category] || CATEGORY_CONFIG.material
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-1 bg-white/10 rounded-lg">
              <Image src="/logo-light.png" alt="Universitet logosi" width={40} height={40} className="object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-white">Universitet MTB Tizimi</h1>
              <p className="text-xs text-slate-400">Moddiy-texnik baza boshqaruvi</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Asset Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl overflow-hidden">
          {/* Status Banner */}
          <div className={`${statusConfig.color} px-6 py-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <StatusIcon className="h-5 w-5" />
                <span className="font-semibold">{statusConfig.label}</span>
              </div>
              <Badge className={`${categoryConfig.color} border`}>{categoryConfig.label}</Badge>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Asset Name & Model */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">{asset.name}</h2>
              {asset.model && (
                <p className="text-slate-400 flex items-center justify-center gap-2">
                  <Tag className="h-4 w-4" />
                  {asset.model}
                </p>
              )}
            </div>

            <Separator className="bg-white/20" />

            {/* Asset Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Hash className="h-4 w-4" />
                  Inventar raqami
                </div>
                <p className="font-mono text-lg font-bold text-white">{asset.inventoryNumber}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar className="h-4 w-4" />
                  Sotib olingan
                </div>
                <p className="font-semibold text-white">{formatDate(asset.purchaseDate)}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Package className="h-4 w-4" />
                  Miqdori
                </div>
                <p className="font-semibold text-white">{asset.quantity} dona</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock className="h-4 w-4" />
                  Tizimga kiritilgan
                </div>
                <p className="font-semibold text-white">{formatDate(asset.createdAt)}</p>
              </div>
            </div>

            <Separator className="bg-white/20" />

            {/* Responsible Person */}
            {asset.assignedEmployee ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <User className="h-5 w-5" />
                  <h3 className="font-semibold">Javobgar shaxs</h3>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl p-5 border border-emerald-500/30">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
                      {asset.assignedEmployee.firstName[0]}
                      {asset.assignedEmployee.lastName[0]}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-xl font-bold text-white">
                          {asset.assignedEmployee.firstName} {asset.assignedEmployee.lastName}
                        </p>
                        <div className="flex items-center gap-2 text-slate-300 mt-1">
                          <Briefcase className="h-4 w-4" />
                          {asset.assignedEmployee.position}
                        </div>
                      </div>

                      {asset.assignedEmployee.phone && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="h-4 w-4" />
                          <a
                            href={`tel:${asset.assignedEmployee.phone}`}
                            className="hover:text-emerald-400 transition-colors"
                          >
                            {asset.assignedEmployee.phone}
                          </a>
                        </div>
                      )}

                      {asset.assignmentDate && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Calendar className="h-4 w-4" />
                            Biriktirilgan: {formatDate(asset.assignmentDate)}
                          </div>
                        </div>
                      )}

                      {asset.assignmentComment && (
                        <div className="mt-3 p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                            <FileText className="h-4 w-4" />
                            Izoh
                          </div>
                          <p className="text-slate-300 text-sm">{asset.assignmentComment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-white/5 rounded-xl">
                <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-slate-500" />
                </div>
                <p className="text-slate-400 font-medium">Javobgar shaxs biriktirilmagan</p>
                <p className="text-sm text-slate-500 mt-1">Bu buyum hozircha erkin holatda</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-slate-500">QR kod orqali ochildi</p>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Supported by the IT department.   mansurbek.info</p>
        </div>
      </main>
    </div>
  )
}
